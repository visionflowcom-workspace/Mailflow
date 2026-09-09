import { isAdmin } from '../../../lib/session';
import { readClients, saveClients } from '../../../lib/store';
import { PLANS } from '../../../lib/plans';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!isAdmin(req)) return res.status(401).json({ error: 'Not logged in as admin.' });

  const { email, plan } = req.body;
  if (!plan || !PLANS[plan]) return res.status(400).json({ error: 'Invalid plan.' });

  const clients = readClients();
  const client = clients[email];
  if (!client) return res.status(404).json({ error: 'User not found.' });

  // Keep an existing quota group consistent when its subscription owner
  // changes plan. Free plans cannot have shared paid quota.
  if (client.quotaShare?.ownerEmail === email) {
    const members = client.quotaShare.members || [email];
    if (plan === 'free') {
      for (const memberEmail of members) {
        if (clients[memberEmail]) delete clients[memberEmail].quotaShare;
      }
    } else {
      for (const memberEmail of members) {
        if (clients[memberEmail]) {
          clients[memberEmail].quotaShare = {
            ...client.quotaShare,
            plan,
            slots: client.quotaShare.slots,
          };
        }
      }
    }
  }

  client.plan = plan;
  saveClients(clients);

  res.json({ success: true });
}
