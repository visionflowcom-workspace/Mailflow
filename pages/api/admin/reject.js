import { isAdmin } from '../../../lib/session';
import { readClients, saveClients } from '../../../lib/store';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!isAdmin(req)) return res.status(401).json({ error: 'Not logged in as admin.' });

  const { email, reason } = req.body;
  const clients = await readClients();
  const client = clients[email];
  if (!client || !client.pendingUpgrade) return res.status(404).json({ error: 'No pending request for this client.' });

  client.pendingUpgrade = {
    ...client.pendingUpgrade,
    status: 'rejected',
    reason: reason || '',
    decidedAt: new Date().toISOString(),
  };
  await saveClients(clients);

  res.json({ success: true });
}
