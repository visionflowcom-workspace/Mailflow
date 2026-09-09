import { clearAdminCookie } from '../../../lib/session';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  clearAdminCookie(res);
  res.json({ success: true });
}
