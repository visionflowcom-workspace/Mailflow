import { getSessionEmail, clearSessionCookie } from '../../lib/session';
import { readClients, saveClients } from '../../lib/store';
import { getOAuthClient } from '../../lib/google';
import { campaignStatus } from '../../lib/plans';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const email = getSessionEmail(req);
  if (!email) return res.status(401).json({ error: 'Please log in first.' });

  const clients = await readClients();
  const client = clients[email];
  // Microsoft doesn't have a simple equivalent revoke call reachable this way —
  // deleting the stored tokens below is sufficient there.
  if (client?.provider !== 'microsoft' && client?.tokens?.access_token) {
    try {
      const oAuth2Client = getOAuthClient();
      oAuth2Client.setCredentials(client.tokens);
      await oAuth2Client.revokeCredentials();
    } catch (err) {
      console.error('Token revoke error (continuing anyway):', err.message);
    }
  }

  delete clients[email];
  await saveClients(clients);
  delete campaignStatus[email];

  clearSessionCookie(res);
  res.json({ success: true });
}
