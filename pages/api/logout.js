import { clearSessionCookie } from '../../lib/session';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  clearSessionCookie(res);
  res.json({ success: true });
}
