import { isAdmin } from '../../../lib/session';
import { readClients, saveClients } from '../../../lib/store';
import { getOAuthClient } from '../../../lib/google';
import { campaignStatus } from '../../../lib/plans';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!isAdmin(req)) return res.status(401).json({ error: 'Not logged in as admin.' });

  const { email } = req.body;
  const clients = readClients();
  const client = clients[email];
  if (!client) return res.status(404).json({ error: 'User not found.' });

  if (client.tokens?.access_token) {
    try {
      const oAuth2Client = getOAuthClient();
      oAuth2Client.setCredentials(client.tokens);
      await oAuth2Client.revokeCredentials();
    } catch (err) {
      console.error('Token revoke error (continuing anyway):', err.message);
    }
  }

  delete clients[email];
  saveClients(clients);
  delete campaignStatus[email];

  res.json({ success: true });
}
