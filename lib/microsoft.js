// Outlook/Microsoft 365 integration via the Microsoft identity platform +
// Microsoft Graph API. This mirrors what lib/google.js does for Gmail, but
// Microsoft doesn't have an official Node SDK as simple as googleapis, so
// these are plain REST calls with fetch.

const authBase = () => `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT || 'common'}/oauth2/v2.0`;
const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';

import { readClients, saveClients } from './store';

// Mail.Send lets us send email; offline_access gets us a refresh_token so
// the connection keeps working without asking them to sign in again.
const SCOPES = 'openid profile email offline_access Mail.Send';

export function getMicrosoftAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.MICROSOFT_REDIRECT_URI,
    response_mode: 'query',
    scope: SCOPES,
    prompt: 'select_account',
  });
  return `${authBase()}/authorize?${params.toString()}`;
}

export async function exchangeMicrosoftCode(code) {
  const res = await fetch(`${authBase()}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET,
      code,
      redirect_uri: process.env.MICROSOFT_REDIRECT_URI,
      grant_type: 'authorization_code',
      scope: SCOPES,
    }),
  });
  if (!res.ok) throw new Error(`Microsoft token exchange failed: ${await res.text()}`);
  return res.json(); // { access_token, refresh_token, expires_in, ... }
}

async function refreshMicrosoftToken(refreshToken) {
  const res = await fetch(`${authBase()}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      scope: SCOPES,
    }),
  });
  if (!res.ok) throw new Error(`Microsoft token refresh failed: ${await res.text()}`);
  return res.json();
}

export async function getMicrosoftProfile(accessToken) {
  const res = await fetch(`${GRAPH_BASE}/me`, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`Could not fetch Microsoft profile: ${await res.text()}`);
  return res.json(); // { mail, userPrincipalName, displayName, ... }
}

// Reads clients.json, refreshes the access token if it's expired or about to
// expire, saves the new one back, and returns a usable access token.
export async function getFreshMicrosoftAccessToken(email) {
  const clients = readClients();
  const client = clients[email];
  if (!client?.msTokens) throw new Error('This account is not connected to Outlook.');

  const isExpiringSoon = !client.msTokens.expires_at || Date.now() > client.msTokens.expires_at - 60_000;
  if (!isExpiringSoon) return client.msTokens.access_token;

  const refreshed = await refreshMicrosoftToken(client.msTokens.refresh_token);
  client.msTokens = {
    access_token: refreshed.access_token,
    refresh_token: refreshed.refresh_token || client.msTokens.refresh_token,
    expires_at: Date.now() + refreshed.expires_in * 1000,
  };
  saveClients(clients);
  return client.msTokens.access_token;
}

// Send an email through Microsoft Graph, mirroring lib/google.js's sendEmail signature.
export async function sendMicrosoftEmail(accessToken, { to, cc, bcc, subject, htmlBody, attachments = [] }) {
  const toRecipients = String(to).split(',').map((addr) => ({ emailAddress: { address: addr.trim() } })).filter((r) => r.emailAddress.address);
  const ccRecipients = cc ? String(cc).split(',').map((addr) => ({ emailAddress: { address: addr.trim() } })).filter((r) => r.emailAddress.address) : [];
  const bccRecipients = bcc ? String(bcc).split(',').map((addr) => ({ emailAddress: { address: addr.trim() } })).filter((r) => r.emailAddress.address) : [];

  const message = {
    subject,
    body: { contentType: 'HTML', content: htmlBody },
    toRecipients,
    ccRecipients,
    bccRecipients,
    attachments: attachments.map((f) => ({
      '@odata.type': '#microsoft.graph.fileAttachment',
      name: f.filename,
      contentType: f.mimeType || 'application/octet-stream',
      contentBytes: f.dataBase64,
    })),
  };

  const res = await fetch(`${GRAPH_BASE}/me/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, saveToSentItems: true }),
  });
  if (!res.ok) throw new Error(`Outlook send failed: ${await res.text()}`);
}
