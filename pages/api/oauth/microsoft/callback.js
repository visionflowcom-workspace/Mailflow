import { exchangeMicrosoftCode, getMicrosoftProfile } from '../../../../lib/microsoft';
import { readClients, saveClients, touchLastSeen } from '../../../../lib/store';
import { setSessionCookie } from '../../../../lib/session';

export default async function handler(req, res) {
  const { code, error, error_description } = req.query;
  if (error) return res.status(400).send(`Microsoft sign-in error: ${error_description || error}`);
  if (!code) return res.status(400).send('Missing authorization code.');

  try {
    const tokenData = await exchangeMicrosoftCode(code);
    const profile = await getMicrosoftProfile(tokenData.access_token);
    const email = profile.mail || profile.userPrincipalName;
    if (!email) return res.status(500).send('Could not determine your email address from Microsoft.');

    const clients = await readClients();
    const isNewClient = !clients[email];
    clients[email] = {
      ...(clients[email] || {}),
      email,
      provider: 'microsoft',
      msTokens: {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: Date.now() + tokenData.expires_in * 1000,
      },
      sheetUrl: clients[email]?.sheetUrl ?? null,
      plan: clients[email]?.plan || 'free',
      connectedAt: clients[email]?.connectedAt || new Date().toISOString(),
    };
    await saveClients(clients);
    await touchLastSeen(email);

    setSessionCookie(res, email);

    if (isNewClient) {
      res.redirect('/set-password?new=1');
    } else {
      res.redirect('/connected');
    }
  } catch (err) {
    console.error('Microsoft OAuth callback error:', err);
    res.status(500).send('Something went wrong connecting your Outlook account. Please try again.');
  }
}
