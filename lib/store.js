import fs from 'fs';
import path from 'path';

// --- Persistent client store ---
//
// Render's Free web services have NO durable disk and no Persistent Disk
// option at all — the container filesystem is rebuilt from scratch on every
// redeploy, crash-restart, and inactivity spin-down/spin-up. So this can no
// longer be a local JSON file on Free; the data has to live in an external
// store reachable over plain HTTPS.
//
// This uses Upstash Redis's REST API (https://upstash.com — generous free
// tier, no persistent TCP connection needed, works fine from Render Free).
// The whole `clients` object is stored as one JSON blob under a single key.
//
// Setup:
//   1. Create a free Redis database at https://console.upstash.com
//   2. Copy its "REST URL" and "REST Token" from the database details page
//   3. Set these env vars on your Render service:
//        UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
//        UPSTASH_REDIS_REST_TOKEN=xxxxxxxx
//   4. Redeploy.
//
// Local dev without those env vars set falls back to a local JSON file
// (data/clients.json) exactly like before — fine on your own machine, just
// not durable on Render Free.

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_KEY = 'email_sender:clients';
const USE_REDIS = Boolean(REST_URL && REST_TOKEN);

// --- Local file fallback (dev only) ---
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'clients.json');

function readClientsFromFile() {
  try {
    if (!fs.existsSync(DB_FILE)) return {};
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (err) {
    console.error('[store] Failed to read', DB_FILE, err);
    return {};
  }
}

function saveClientsToFile(data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- Upstash Redis backend ---
async function readClientsFromRedis() {
  const res = await fetch(`${REST_URL}/get/${encodeURIComponent(REDIS_KEY)}`, {
    headers: { Authorization: `Bearer ${REST_TOKEN}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    console.error('[store] Upstash GET failed', res.status, await res.text().catch(() => ''));
    return {};
  }
  const { result } = await res.json();
  if (!result) return {};
  try {
    return JSON.parse(result);
  } catch (err) {
    console.error('[store] Corrupt data in Redis, treating as empty', err);
    return {};
  }
}

async function saveClientsToRedis(data) {
  const res = await fetch(`${REST_URL}/set/${encodeURIComponent(REDIS_KEY)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REST_TOKEN}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`[store] Upstash SET failed: ${res.status} ${text}`);
  }
}

// --- Public API (now async — every caller needs to `await` these) ---
export async function readClients() {
  return USE_REDIS ? readClientsFromRedis() : readClientsFromFile();
}

export async function saveClients(data) {
  return USE_REDIS ? saveClientsToRedis(data) : saveClientsToFile(data);
}

// Records "this client was just seen" (password login, OAuth connect, or an
// active session check) so the admin dashboard can show who's recently
// active. Throttled to at most once every 10 minutes per client so we don't
// rewrite the store on every single page load.
const LAST_SEEN_THROTTLE_MS = 10 * 60 * 1000;

export async function touchLastSeen(email) {
  if (!email) return;
  const clients = await readClients();
  const client = clients[email];
  if (!client) return;

  const now = Date.now();
  const last = client.lastSeenAt ? new Date(client.lastSeenAt).getTime() : 0;
  if (now - last < LAST_SEEN_THROTTLE_MS) return;

  client.lastSeenAt = new Date(now).toISOString();
  await saveClients(clients);
}
