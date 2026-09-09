import { google } from 'googleapis';
import { getOAuthClient } from '../../../lib/google';
import { readClients, saveClients, touchLastSeen } from '../../../lib/store';
import { setSessionCookie, getMigrationEmail, clearMigrationCookie } from '../../../lib/session';

export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing authorization code.');

  try {
    const oAuth2Client = getOAuthClient();
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oAuth2Client, version: 'v2' });
    const { data: profile } = await oauth2.userinfo.get();
    const newEmail = profile.email;

    const clients = readClients();
    const oldEmail = getMigrationEmail(req);

    // --- Handling an in-progress "Change Gmail account" request ---
    if (oldEmail && oldEmail !== newEmail) {
      clearMigrationCookie(res);
      const oldClient = clients[oldEmail];

      if (oldClient && !clients[newEmail]) {
        // Move everything (plan, sheet, password, usage) over to the new email,
        // keep the fresh tokens from the account they just picked.
        clients[newEmail] = {
          ...oldClient,
          email: newEmail,
          tokens,
        };
        delete clients[oldEmail];
        saveClients(clients);
        setSessionCookie(res, newEmail);
        return res.redirect('/profile?changed=1');
      }

      if (clients[newEmail]) {
        // That Gmail is already registered as a separate account here — refuse
        // to overwrite it. Just log them into that existing account instead.
        clients[newEmail].tokens = tokens;
        saveClients(clients);
        setSessionCookie(res, newEmail);
        return res.redirect('/profile?changed=blocked');
      }
    } else if (oldEmail) {
      // They picked the same Gmail account again — nothing to migrate.
      clearMigrationCookie(res);
    }

    // --- Normal connect/reconnect flow ---
    const isNewClient = !clients[newEmail];
    clients[newEmail] = {
      ...(clients[newEmail] || {}),
      email: newEmail,
      tokens,
      sheetUrl: clients[newEmail]?.sheetUrl ?? null,
      plan: clients[newEmail]?.plan || 'free',
      connectedAt: clients[newEmail]?.connectedAt || new Date().toISOString(),
    };
    saveClients(clients);
    touchLastSeen(newEmail);

    setSessionCookie(res, newEmail);

    if (isNewClient) {
      res.redirect('/set-password?new=1');
    } else {
      res.redirect('/connected');
    }
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('Something went wrong connecting your account. Please try again.');
  }
}
