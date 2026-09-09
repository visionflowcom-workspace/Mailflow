import { getSessionEmail } from '../../lib/session';
import { readClients } from '../../lib/store';
import { campaignStatus, getRemainingQuota, getPlanLimit } from '../../lib/plans';

export default function handler(req, res) {
  const email = getSessionEmail(req) || req.query.email;
  const status = campaignStatus[email];
  if (!status) return res.status(404).json({ error: 'No campaign found for this client yet.' });

  const clients = readClients();
  res.json({ ...status, remainingQuota: getRemainingQuota(email), dailyLimit: getPlanLimit(clients[email]) });
}
