import { readClients, saveClients } from '../../lib/store';
import { getSessionEmail } from '../../lib/session';

// Templates are stored per-account on the client record, e.g.
//   clients[email].templates = [{ id, name, icon, subject, bodyHtml, createdAt, updatedAt }]
// Every route below resolves the account from the signed session cookie, so
// a template saved by one user is never readable or writable by another —
// there's no client-supplied "userId" anywhere that could be spoofed.

function genId() {
  return `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default async function handler(req, res) {
  const email = getSessionEmail(req);
  if (!email) return res.status(401).json({ error: 'Not signed in.' });

  const clients = await readClients();
  if (!clients[email]) return res.status(404).json({ error: 'Account not found.' });
  if (!Array.isArray(clients[email].templates)) clients[email].templates = [];

  if (req.method === 'GET') {
    return res.json({ templates: clients[email].templates });
  }

  if (req.method === 'POST') {
    const { name, subject = '', bodyHtml = '', icon = '⭐' } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: 'Template name is required.' });
    if (!subject.trim() && !bodyHtml.trim()) {
      return res.status(400).json({ error: 'Write a subject or body first, then save it as a template.' });
    }

    const now = new Date().toISOString();
    const template = {
      id: genId(),
      name: name.trim().slice(0, 60),
      icon,
      subject,
      bodyHtml,
      custom: true,
      createdAt: now,
      updatedAt: now,
    };
    clients[email].templates.push(template);
    await saveClients(clients);
    return res.status(201).json({ template });
  }

  if (req.method === 'PUT') {
    const { id, name, subject, bodyHtml } = req.body || {};
    const tpl = clients[email].templates.find((t) => t.id === id);
    if (!tpl) return res.status(404).json({ error: 'Template not found.' });
    if (name && name.trim()) tpl.name = name.trim().slice(0, 60);
    if (typeof subject === 'string') tpl.subject = subject;
    if (typeof bodyHtml === 'string') tpl.bodyHtml = bodyHtml;
    tpl.updatedAt = new Date().toISOString();
    await saveClients(clients);
    return res.json({ template: tpl });
  }

  if (req.method === 'DELETE') {
    const id = req.query.id || (req.body && req.body.id);
    const before = clients[email].templates.length;
    clients[email].templates = clients[email].templates.filter((t) => t.id !== id);
    if (clients[email].templates.length === before) {
      return res.status(404).json({ error: 'Template not found.' });
    }
    await saveClients(clients);
    return res.json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end();
}
