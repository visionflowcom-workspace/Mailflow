import { getOAuthClient, SCOPES } from '../../../lib/google';

export default function handler(req, res) {
  const oAuth2Client = getOAuthClient();
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });
  res.redirect(url);
}
