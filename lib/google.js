import { google } from 'googleapis';
import crypto from 'crypto';
import { readClients, saveClients } from './store';

export function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/spreadsheets',
  'openid',
  'email',
  'profile',
];

// Get a fresh, auto-refreshing authed client for a given connected client email
export async function getAuthedClientFor(email) {
  const clients = await readClients();
  const client = clients[email];
  if (!client) throw new Error('Client not found');

  const oAuth2Client = getOAuthClient();
  oAuth2Client.setCredentials(client.tokens);

  oAuth2Client.on('tokens', (newTokens) => {
    if (newTokens.refresh_token) client.tokens.refresh_token = newTokens.refresh_token;
    client.tokens.access_token = newTokens.access_token;
    client.tokens.expiry_date = newTokens.expiry_date;
    clients[email] = client;
    // Fire-and-forget: this fires from inside the googleapis token-refresh
    // event, which isn't awaited by its caller. Catch so a transient store
    // error doesn't produce an unhandled rejection.
    saveClients(clients).catch((err) => console.error('[google] Failed to persist refreshed tokens', err));
  });

  return oAuth2Client;
}

// Send an email, optionally with CC/BCC and file attachments.
// attachments: [{ filename, mimeType, dataBase64 }]
export async function sendEmail(auth, { to, cc, bcc, subject, htmlBody, attachments = [] }) {
  const gmail = google.gmail({ version: 'v1', auth });

  const headers = [
    `To: ${to}`,
    ...(cc ? [`Cc: ${cc}`] : []),
    ...(bcc ? [`Bcc: ${bcc}`] : []),
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
  ];

  let messageParts;

  if (attachments.length === 0) {
    messageParts = [...headers, 'Content-Type: text/html; charset=utf-8', '', htmlBody];
  } else {
    const boundary = `boundary_${crypto.randomBytes(12).toString('hex')}`;
    messageParts = [
      ...headers,
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      htmlBody,
      '',
    ];

    for (const file of attachments) {
      messageParts.push(
        `--${boundary}`,
        `Content-Type: ${file.mimeType || 'application/octet-stream'}; name="${file.filename}"`,
        'Content-Transfer-Encoding: base64',
        `Content-Disposition: attachment; filename="${file.filename}"`,
        '',
        file.dataBase64.replace(/(.{76})/g, '$1\n'),
        ''
      );
    }
    messageParts.push(`--${boundary}--`);
  }

  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return gmail.users.messages.send({ userId: 'me', requestBody: { raw: encodedMessage } });
}

export function extractSheetId(sheetUrl) {
  const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) throw new Error('Could not parse a Sheet ID from that URL');
  return match[1];
}

export async function readSheetRows(auth, sheetUrl) {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = extractSheetId(sheetUrl);

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A1:Z10000',
  });

  const rows = data.values || [];
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || '';
    });
    return obj;
  });
}
