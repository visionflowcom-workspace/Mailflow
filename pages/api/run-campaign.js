import { readClients } from '../../lib/store';
import { getAuthedClientFor, readSheetRows } from '../../lib/google';
import { sendClientEmail } from '../../lib/mail';
import { getSessionEmail } from '../../lib/session';
import {
  campaignStatus,
  getFeatureFlags,
  getPlanLimit,
  getRemainingQuota,
  recordSend,
  interruptibleSleep,
  isTrialExpired,
} from '../../lib/plans';

export const config = { api: { bodyParser: { sizeLimit: '30mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const email = getSessionEmail(req) || req.body.email;
  const { subjectTemplate, bodyTemplate, delaySeconds = 30, cc, bcc, attachments = [] } = req.body;

  if (!email || !subjectTemplate || !bodyTemplate) {
    return res.status(400).json({ error: 'Missing email, subjectTemplate, or bodyTemplate' });
  }

  const totalAttachmentBytes = attachments.reduce((sum, f) => sum + (f.dataBase64?.length || 0) * 0.75, 0);
  if (totalAttachmentBytes > 24 * 1024 * 1024) {
    return res.status(400).json({ error: 'Attachments are too large — Gmail allows about 25MB per email.' });
  }

  const clients = readClients();
  const client = clients[email];
  if (!client) return res.status(404).json({ error: 'Client not found. Please connect Gmail first.' });

  const hasContactSource = !!client.sheetUrl || (client.contactRows && client.contactRows.length > 0);
  if (!hasContactSource) {
    return res.status(400).json({ error: 'Please connect a Google Sheet or upload a contact file first.' });
  }

  const featureFlags = getFeatureFlags(client);
  if (attachments.length > 0 && !featureFlags.attachments) {
    return res.status(403).json({ error: 'Attachments are a Pro feature. Please upgrade your plan to send them.' });
  }
  if ((cc || bcc) && !featureFlags.ccBcc) {
    return res.status(403).json({ error: 'Cc/Bcc is a Pro feature. Please upgrade your plan to use it.' });
  }

  if (campaignStatus[email]?.running) {
    return res.status(409).json({ error: 'A campaign is already running for this client.' });
  }

  if (isTrialExpired(client)) {
    return res.status(403).json({
      code: 'OUT_OF_CREDITS',
      error: 'Your 3-day free trial has ended. Upgrade your plan to keep sending campaigns.',
    });
  }

  const remainingQuota = getRemainingQuota(email);
  const planLimit = getPlanLimit(client);
  if (remainingQuota <= 0) {
    return res.status(429).json({
      code: 'OUT_OF_CREDITS',
      error: `Daily send limit of ${planLimit} reached for this account. Try again after midnight, or upgrade your plan.`,
    });
  }

  try {
    let rows;
    if (client.contactSource === 'upload') {
      rows = client.contactRows;
    } else if (client.provider === 'microsoft') {
      return res.status(400).json({ error: 'Outlook accounts need an uploaded contact file — Google Sheets isn\'t available for Outlook. Go to "Add your contact list" and upload a CSV/Excel file.' });
    } else {
      const auth = await getAuthedClientFor(email);
      rows = await readSheetRows(auth, client.sheetUrl);
    }

    const emailKey = Object.keys(rows[0] || {}).find((k) => k.toLowerCase() === 'email');
    if (!emailKey) {
      return res.status(400).json({ error: "Sheet must have a column header named 'email'." });
    }

    const rowsToSend = rows.slice(0, remainingQuota);
    const skippedByQuota = rows.length - rowsToSend.length;

    campaignStatus[email] = {
      running: true,
      stopRequested: false,
      total: rowsToSend.length,
      sent: 0,
      failed: 0,
      skippedByQuota,
      errors: [],
    };
    res.json({
      success: true,
      message: skippedByQuota > 0
        ? `Campaign started for ${rowsToSend.length} recipients. ${skippedByQuota} were skipped — daily limit of ${planLimit} would be exceeded.`
        : `Campaign started for ${rowsToSend.length} recipients.`,
    });

    (async () => {
      for (const row of rowsToSend) {
        if (campaignStatus[email].stopRequested) break;
        // Re-check the shared pool before every send so two accounts in the
        // same quota group can never collectively exceed the subscription cap.
        if (getRemainingQuota(email) <= 0) {
          campaignStatus[email].stoppedForQuota = true;
          break;
        }

        const to = row[emailKey];
        if (!to) continue;

        // Build a case-insensitive lookup of this row's columns. Sheet/CSV
        // headers are often capitalized ("Name", "Company") while templates
        // usually use lowercase placeholders ({{name}}, {{company}}) — a
        // plain row[key] lookup was case-sensitive and silently returned ''
        // whenever the casing didn't match exactly.
        const rowLower = {};
        Object.keys(row).forEach((k) => { rowLower[k.toLowerCase()] = row[k]; });
        const fill = (template) => template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => rowLower[key.toLowerCase()] ?? '');

        try {
          await sendClientEmail(email, client, {
            to,
            cc: cc ? fill(cc) : undefined,
            bcc: bcc ? fill(bcc) : undefined,
            subject: fill(subjectTemplate),
            htmlBody: fill(bodyTemplate),
            attachments,
          });
          campaignStatus[email].sent += 1;
          recordSend(email);
        } catch (err) {
          campaignStatus[email].failed += 1;
          campaignStatus[email].errors.push({ to, error: err.message });
          console.error(`Failed to send to ${to}:`, err.message);
        }

        if (campaignStatus[email].stopRequested) break;
        await interruptibleSleep(delaySeconds * 1000, () => campaignStatus[email].stopRequested);
      }
      campaignStatus[email].running = false;
      campaignStatus[email].stoppedEarly = campaignStatus[email].stopRequested;
    })();
  } catch (err) {
    console.error('Campaign error:', err);
    res.status(500).json({ error: err.message });
  }
}
