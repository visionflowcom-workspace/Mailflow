import { getSessionEmail } from '../../lib/session';
import { readClients, saveClients } from '../../lib/store';
import { PLANS } from '../../lib/plans';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const email = getSessionEmail(req);
  if (!email) return res.status(401).json({ error: 'Please log in first.' });

  const { plan, method, reference, note } = req.body;
  if (!plan || !PLANS[plan] || plan === 'free') {
    return res.status(400).json({ error: 'Invalid plan selected.' });
  }
  if (!method || !['easypaisa', 'nayapay'].includes(method)) {
    return res.status(400).json({ error: 'Please select a payment method.' });
  }
  if (!reference || !reference.trim()) {
    return res.status(400).json({ error: 'Please enter your transaction reference/ID.' });
  }

  const clients = readClients();
  const client = clients[email];
  if (!client) return res.status(404).json({ error: 'Client not found.' });

  client.pendingUpgrade = {
    plan,
    method,
    reference: reference.trim(),
    note: (note || '').trim(),
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };
  saveClients(clients);

  res.json({ success: true, message: "Submitted! We'll verify your payment and upgrade your account shortly." });
}
