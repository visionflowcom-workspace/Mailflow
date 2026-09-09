import bcrypt from 'bcryptjs';
import { getSessionEmail } from '../../lib/session';
import { readClients, saveClients } from '../../lib/store';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const email = getSessionEmail(req);
  if (!email) return res.status(401).json({ error: 'Please connect with Google first.' });

  const { currentPassword, password } = req.body;
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  const clients = readClients();
  const client = clients[email];
  if (!client) return res.status(404).json({ error: 'Client not found.' });

  if (client.passwordHash) {
    if (!currentPassword) {
      return res.status(400).json({ error: 'Please enter your current password.' });
    }
    const ok = await bcrypt.compare(currentPassword, client.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  client.passwordHash = await bcrypt.hash(password, 10);
  saveClients(clients);

  res.json({ success: true });
}
