import { getSessionEmail } from '../../lib/session';
import { campaignStatus } from '../../lib/plans';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const email = getSessionEmail(req) || req.body.email;
  const status = campaignStatus[email];
  if (!status || !status.running) {
    return res.status(404).json({ error: 'No running campaign found for this client.' });
  }
  status.stopRequested = true;
  res.json({ success: true, message: 'Stopping — this will halt within a second or two.' });
}
