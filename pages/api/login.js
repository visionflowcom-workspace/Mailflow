import bcrypt from 'bcryptjs';
import { readClients, touchLastSeen } from '../../lib/store';
import { setSessionCookie } from '../../lib/session';

// Basic brute-force throttle for /api/login. In-memory only (see note in
// lib/plans.js about serverless deployments) — fine for a Node host like Render/VPS.
if (!global.__loginAttempts) global.__loginAttempts = {};
const loginAttempts = global.__loginAttempts;
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCK_MS = 5 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password.' });
  }

  const genericError = 'Invalid email or password.';

  const attempt = loginAttempts[email];
  if (attempt?.lockedUntil && attempt.lockedUntil > Date.now()) {
    const waitMin = Math.ceil((attempt.lockedUntil - Date.now()) / 60000);
    return res.status(429).json({ error: `Too many attempts. Try again in ${waitMin} minute(s).` });
  }

  const clients = await readClients();
  const client = clients[email];

  if (!client || !client.passwordHash) {
    return res.status(401).json({ error: genericError });
  }

  const ok = await bcrypt.compare(password, client.passwordHash);
  if (!ok) {
    const current = loginAttempts[email] || { count: 0 };
    current.count += 1;
    if (current.count >= LOGIN_MAX_ATTEMPTS) {
      current.lockedUntil = Date.now() + LOGIN_LOCK_MS;
      current.count = 0;
    }
    loginAttempts[email] = current;
    return res.status(401).json({ error: genericError });
  }

  delete loginAttempts[email];
  await touchLastSeen(email);
  setSessionCookie(res, email);
  res.json({ success: true, hasSheet: !!client.sheetUrl });
}
