import { getAuthedClientFor, sendEmail as sendGmailEmail } from './google';
import { getFreshMicrosoftAccessToken, sendMicrosoftEmail } from './microsoft';

// Send one email for a connected client, regardless of whether they connected
// via Google or Outlook. `payload` is { to, cc, bcc, subject, htmlBody, attachments }.
export async function sendClientEmail(email, client, payload) {
  if (client.provider === 'microsoft') {
    const accessToken = await getFreshMicrosoftAccessToken(email);
    return sendMicrosoftEmail(accessToken, payload);
  }
  // Default / legacy clients are all Google.
  const auth = await getAuthedClientFor(email);
  return sendGmailEmail(auth, payload);
}
