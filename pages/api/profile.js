import { getSessionEmail } from '../../lib/session';
import { readClients } from '../../lib/store';
import { PLANS, getPlanLimit, getRemainingQuota, getTodayKey, campaignStatus } from '../../lib/plans';

export default async function handler(req, res) {
  const email = getSessionEmail(req);
  if (!email) return res.status(401).json({ error: 'Please log in first.' });

  const clients = await readClients();
  const client = clients[email];
  if (!client) return res.status(404).json({ error: 'Client not found.' });

  const planKey = client.plan || 'free';
  const remainingQuota = await getRemainingQuota(email);

  res.json({
    email,
    provider: client.provider || 'google',
    connectedAt: client.connectedAt || null,
    hasSheet: !!client.sheetUrl || (client.contactRows && client.contactRows.length > 0),
    sheetUrl: client.sheetUrl || null,
    contactSource: client.contactSource || 'sheet',
    contactFilename: client.contactFilename || null,
    contactRowCount: client.contactRows?.length || 0,
    hasPassword: !!client.passwordHash,
    plan: planKey,
    planName: PLANS[planKey]?.name || planKey,
    dailyLimit: getPlanLimit(client),
    remainingQuota,
    sentToday: client.quotaShare ? Math.max(0, getPlanLimit(client) - remainingQuota) : (client.dailyUsage?.date === getTodayKey() ? client.dailyUsage.count : 0),
    quotaShare: client.quotaShare ? { slots: client.quotaShare.slots, members: client.quotaShare.members, ownerEmail: client.quotaShare.ownerEmail } : null,
    pendingUpgrade: client.pendingUpgrade && client.pendingUpgrade.status === 'pending' ? client.pendingUpgrade : null,
    lastCampaign: campaignStatus[email]
      ? {
          running: campaignStatus[email].running,
          sent: campaignStatus[email].sent,
          failed: campaignStatus[email].failed,
          total: campaignStatus[email].total,
        }
      : null,
  });
}
