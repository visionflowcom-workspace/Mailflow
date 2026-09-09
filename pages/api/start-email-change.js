import { getOAuthClient, SCOPES } from '../../lib/google';
import { getSessionEmail, setMigrationCookie } from '../../lib/session';

export default function handler(req, res) {
  const currentEmail = getSessionEmail(req);
  if (!currentEmail) return res.status(401).send('Please log in first.');

  // Remember which account is switching, so oauth/callback can move
  // its data (plan, sheet, password) over to the new Gmail once connected.
  setMigrationCookie(res, currentEmail);

  const oAuth2Client = getOAuthClient();
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent select_account', // force the account picker so they can't accidentally pick the same one
    scope: SCOPES,
  });
  res.redirect(url);
}
