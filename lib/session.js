import crypto from 'crypto';
import cookie from 'cookie';

const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-secret-in-.env';
export const SESSION_COOKIE = 'vf_session';
export const ADMIN_COOKIE = 'vf_admin';
const SESSION_MAX_AGE_S = 30 * 24 * 60 * 60; // 30 days, in seconds (cookie lib wants seconds)

function sign(value) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
}

export function signEmail(email) {
  const sig = sign(email);
  return `${Buffer.from(email).toString('base64url')}.${sig}`;
}

export function verifySessionCookie(value) {
  if (!value || !value.includes('.')) return null;
  const [encoded, sig] = value.split('.');
  let email;
  try {
    email = Buffer.from(encoded, 'base64url').toString('utf-8');
  } catch {
    return null;
  }
  const expected = sign(email);
  const a = Buffer.from(sig || '');
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return email;
}

// Read the raw cookie header from a Next.js API request and parse it
export function parseCookies(req) {
  return cookie.parse(req.headers.cookie || '');
}

export function getSessionEmail(req) {
  const cookies = parseCookies(req);
  return verifySessionCookie(cookies[SESSION_COOKIE]);
}

export function setSessionCookie(res, email) {
  const serialized = cookie.serialize(SESSION_COOKIE, signEmail(email), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_S,
    path: '/',
    // secure: true, // enable once served over HTTPS
  });
  appendSetCookie(res, serialized);
}

export function clearSessionCookie(res) {
  const serialized = cookie.serialize(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', maxAge: 0, path: '/' });
  appendSetCookie(res, serialized);
}

// --- Email-change migration cookie ---
// Short-lived cookie that remembers "which account is trying to switch to a
// new Gmail" while the person is over on Google's consent screen. Uses the
// same signed-email format as the session cookie, just a different name.
export const MIGRATION_COOKIE = 'vf_migrating_from';

export function setMigrationCookie(res, oldEmail) {
  const serialized = cookie.serialize(MIGRATION_COOKIE, signEmail(oldEmail), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 10 * 60, // 10 minutes — plenty of time to go through Google's screen
    path: '/',
  });
  appendSetCookie(res, serialized);
}

export function getMigrationEmail(req) {
  const cookies = parseCookies(req);
  return verifySessionCookie(cookies[MIGRATION_COOKIE]);
}

export function clearMigrationCookie(res) {
  const serialized = cookie.serialize(MIGRATION_COOKIE, '', { httpOnly: true, sameSite: 'lax', maxAge: 0, path: '/' });
  appendSetCookie(res, serialized);
}

// --- Admin auth (single shared password from .env) ---
export function signAdmin() {
  return sign('admin');
}

export function isAdmin(req) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
  if (!ADMIN_PASSWORD) return false;
  const cookies = parseCookies(req);
  return cookies[ADMIN_COOKIE] === signAdmin();
}

export function setAdminCookie(res) {
  const serialized = cookie.serialize(ADMIN_COOKIE, signAdmin(), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 12 * 60 * 60,
    path: '/',
  });
  appendSetCookie(res, serialized);
}

export function clearAdminCookie(res) {
  const serialized = cookie.serialize(ADMIN_COOKIE, '', { httpOnly: true, sameSite: 'lax', maxAge: 0, path: '/' });
  appendSetCookie(res, serialized);
}

// Next.js API routes may already have a Set-Cookie header set — append rather than overwrite
function appendSetCookie(res, serialized) {
  const existing = res.getHeader('Set-Cookie');
  if (!existing) {
    res.setHeader('Set-Cookie', serialized);
  } else if (Array.isArray(existing)) {
    res.setHeader('Set-Cookie', [...existing, serialized]);
  } else {
    res.setHeader('Set-Cookie', [existing, serialized]);
  }
}
