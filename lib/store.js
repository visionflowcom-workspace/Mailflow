import fs from 'fs';
import path from 'path';

// Same simple local "database" as the original Express app: a JSON file.
// Fine for testing with a handful of clients; swap for a real DB later.
const DB_FILE = path.join(process.cwd(), 'data', 'clients.json');

export function readClients() {
  if (!fs.existsSync(DB_FILE)) return {};
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

export function saveClients(data) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Records "this client was just seen" (password login, OAuth connect, or an
// active session check) so the admin dashboard can show who's recently
// active. Throttled to at most once every 10 minutes per client so we don't
// rewrite the JSON file on every single page load.
const LAST_SEEN_THROTTLE_MS = 10 * 60 * 1000;

export function touchLastSeen(email) {
  if (!email) return;
  const clients = readClients();
  const client = clients[email];
  if (!client) return;

  const now = Date.now();
  const last = client.lastSeenAt ? new Date(client.lastSeenAt).getTime() : 0;
  if (now - last < LAST_SEEN_THROTTLE_MS) return;

  client.lastSeenAt = new Date(now).toISOString();
  saveClients(clients);
}
