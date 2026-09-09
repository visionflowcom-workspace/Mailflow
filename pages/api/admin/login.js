import { setAdminCookie } from '../../../lib/session';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
  if (!ADMIN_PASSWORD) return res.status(503).json({ error: 'Admin panel is not configured (set ADMIN_PASSWORD in .env).' });

  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Wrong password.' });

  setAdminCookie(res);
  res.json({ success: true });
}
