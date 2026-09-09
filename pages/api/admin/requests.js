import { isAdmin } from '../../../lib/session';
import { readClients } from '../../../lib/store';
import { PLANS } from '../../../lib/plans';

export default function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Not logged in as admin.' });

  const clients = readClients();
  const requests = Object.values(clients)
    .filter((c) => c.pendingUpgrade && c.pendingUpgrade.status === 'pending')
    .map((c) => ({
      email: c.email,
      currentPlan: c.plan || 'free',
      requestedPlan: c.pendingUpgrade.plan,
      method: c.pendingUpgrade.method || 'bank',
      reference: c.pendingUpgrade.reference,
      note: c.pendingUpgrade.note,
      submittedAt: c.pendingUpgrade.submittedAt,
    }));

  res.json({ requests, plans: PLANS });
}
