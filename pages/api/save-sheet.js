import { readClients, saveClients } from '../../lib/store';
import { getSessionEmail } from '../../lib/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const email = getSessionEmail(req) || req.body.email;
  const { sheetUrl } = req.body;
  if (!email || !sheetUrl) {
    return res.status(400).json({ error: 'Missing email or sheetUrl' });
  }

  const clients = readClients();
  if (!clients[email]) {
    return res.status(404).json({ error: 'Client not found. Please connect Gmail first.' });
  }

  clients[email].sheetUrl = sheetUrl;
  clients[email].contactSource = 'sheet';
  clients[email].contactRows = null;
  clients[email].contactFilename = null;
  saveClients(clients);

  try {
    if (process.env.N8N_WEBHOOK_URL) {
      await fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sheetUrl, connectedAt: clients[email].connectedAt }),
      });
    }
  } catch (err) {
    console.error('Failed to notify n8n webhook:', err.message);
  }

  res.json({ success: true });
}
