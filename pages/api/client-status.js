import { readClients } from '../../lib/store';

export default async function handler(req, res) {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const clients = await readClients();
  const client = clients[email];
  if (!client) return res.json({ connected: false });

  res.json({ connected: true, hasSheet: !!client.sheetUrl || (client.contactRows && client.contactRows.length > 0) });
}
