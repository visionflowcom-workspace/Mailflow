import { getSessionEmail } from '../../lib/session';
import { readClients, touchLastSeen } from '../../lib/store';

export default function handler(req, res) {
  const email = getSessionEmail(req);
  if (!email) return res.json({ loggedIn: false });

  const clients = readClients();
  const client = clients[email];
  if (!client) return res.json({ loggedIn: false });

  touchLastSeen(email);

  res.json({
    loggedIn: true,
    email,
    provider: client.provider || 'google',
    hasSheet: !!client.sheetUrl || (client.contactRows && client.contactRows.length > 0),
    sheetUrl: client.sheetUrl || null,
    contactSource: client.contactSource || 'sheet',
    contactFilename: client.contactFilename || null,
    contactRowCount: client.contactRows?.length || 0,
    hasPassword: !!client.passwordHash,
  });
}
