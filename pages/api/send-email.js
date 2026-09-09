import { readClients } from '../../lib/store';
import { sendClientEmail } from '../../lib/mail';
import { getFeatureFlags } from '../../lib/plans';

export const config = { api: { bodyParser: { sizeLimit: '30mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, to, cc, bcc, subject, body, attachments } = req.body;
  try {
    const clients = readClients();
    const client = clients[email];
    if (!client) return res.status(404).json({ error: 'Client not found.' });

    const featureFlags = getFeatureFlags(client);
    if (attachments?.length > 0 && !featureFlags.attachments) {
      return res.status(403).json({ error: 'Attachments are a Pro feature. Please upgrade your plan to send them.' });
    }
    if ((cc || bcc) && !featureFlags.ccBcc) {
      return res.status(403).json({ error: 'Cc/Bcc is a Pro feature. Please upgrade your plan to use it.' });
    }

    await sendClientEmail(email, client, { to, cc, bcc, subject, htmlBody: body, attachments });
    res.json({ success: true });
  } catch (err) {
    console.error('Send email error:', err);
    res.status(500).json({ error: err.message });
  }
}
