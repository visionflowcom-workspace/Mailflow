import { readClients, saveClients } from './store';

export const PLANS = {
  free: { name: 'Free', dailyLimit: 50, priceRs: 0, features: { attachments: false, ccBcc: false, templateDesigns: false }, displayFeatures: ['50 send credits every day', 'Basic email campaigns', 'Spreadsheet recipient import', '3-day trial'] },
  pro: { name: 'Pro', dailyLimit: 450, priceRs: 2500, features: { attachments: true, ccBcc: true, templateDesigns: true }, displayFeatures: ['450 send credits every day', 'File attachments', 'CC / BCC support', 'Premium template designs', 'Priority upgrade access', 'Share quota across up to 2 email accounts'] },
  business: { name: 'Business', dailyLimit: 1000, priceRs: 6000, features: { attachments: true, ccBcc: true, templateDesigns: true }, displayFeatures: ['1,000 send credits every day', 'File attachments', 'CC / BCC support', 'Premium template designs', 'Priority upgrade access', 'Share quota across up to 3 email accounts'] },
};
export const LEGACY_DAILY_LIMIT = parseInt(process.env.DAILY_SEND_LIMIT || '450', 10);
export const LEGACY_FEATURES = { attachments: true, ccBcc: true, templateDesigns: true };

export function getQuotaShare(client) {
  const share = client?.quotaShare;
  if (!share || !Array.isArray(share.members) || share.members.length < 2) return null;
  const slots = Math.max(2, Math.min(Number(share.slots) || share.members.length, share.members.length));
  return { ...share, slots };
}

export function getPlanLimit(client) {
  if (client?.quotaShare?.ownerEmail && Array.isArray(client.quotaShare.members) && client.quotaShare.members.length >= 2) {
    const ownerPlan = client.quotaShare.plan || client.plan;
    if (PLANS[ownerPlan]) return PLANS[ownerPlan].dailyLimit;
  }
  if (client?.plan && PLANS[client.plan]) return PLANS[client.plan].dailyLimit;
  return LEGACY_DAILY_LIMIT;
}

export function getFeatureFlags(client) {
  return client?.plan ? (PLANS[client.plan]?.features || PLANS.free.features) : LEGACY_FEATURES;
}

export const BANK_DETAILS = {
  bankName: process.env.BANK_NAME || 'Meezan Bank',
  accountTitle: process.env.BANK_ACCOUNT_TITLE || '',
  accountNumber: process.env.BANK_ACCOUNT_NUMBER || '',
  iban: process.env.BANK_IBAN || '',
  branch: process.env.BANK_BRANCH || '',
};

export const EASYPAISA_DETAILS = {
  accountTitle: process.env.EASYPAISA_ACCOUNT_TITLE || '',
  number: process.env.EASYPAISA_NUMBER || '',
};

export const NAYAPAY_DETAILS = {
  accountTitle: process.env.NAYAPAY_ACCOUNT_TITLE || '',
  number: process.env.NAYAPAY_NUMBER || '',
  iban: process.env.NAYAPAY_IBAN || '',
};

// Scan-to-pay QR codes, one per paid plan, so the code shown always matches
// the plan the user has selected. These are plain static image paths (no
// env vars involved) — replace the files in /public/assets with your real
// QR codes whenever you're ready.
export const QR_DETAILS_BY_PLAN = {
  pro: '/assets/payment-qr-pro.png',
  business: '/assets/payment-qr-business.png',
};

// Exposed together so the frontend can render a tab per method without
// needing to know about each one individually.
// Bank transfer is defined above (BANK_DETAILS) but left out of this list —
// add `bank: { label: 'Bank Transfer', details: BANK_DETAILS },` back in if you want it again.
export const PAYMENT_METHODS = {
  easypaisa: { label: 'EasyPaisa', details: EASYPAISA_DETAILS },
  nayapay: { label: 'NayaPay', details: NAYAPAY_DETAILS },
};

export const TRIAL_DAYS = 3;

// Free-plan clients get TRIAL_DAYS from when they first connected before
// they're blocked from sending. Paid plans are never trial-limited.
export function isTrialExpired(client) {
  if (!client) return false;
  const plan = client.plan || 'free';
  if (plan !== 'free') return false;
  if (!client.connectedAt) return false;

  const connectedMs = new Date(client.connectedAt).getTime();
  const trialEndMs = connectedMs + TRIAL_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() > trialEndMs;
}

export function getTrialDaysLeft(client) {
  if (!client?.connectedAt) return TRIAL_DAYS;
  const connectedMs = new Date(client.connectedAt).getTime();
  const trialEndMs = connectedMs + TRIAL_DAYS * 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((trialEndMs - Date.now()) / (24 * 60 * 60 * 1000)));
}

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function getRemainingQuota(email) {
  const clients = await readClients();
  const client = clients[email];
  if (!client) return LEGACY_DAILY_LIMIT;

  const today = getTodayKey();
  const share = getQuotaShare(client);
  if (share) {
    const totalUsed = share.members.reduce((sum, memberEmail) => {
      const member = clients[memberEmail];
      return sum + (member?.dailyUsage?.date === today ? Number(member.dailyUsage.count || 0) : 0);
    }, 0);
    return Math.max(0, getPlanLimit(client) - totalUsed);
  }

  if (!client.dailyUsage || client.dailyUsage.date !== today) {
    client.dailyUsage = { date: today, count: 0 };
    await saveClients(clients);
  }
  return getPlanLimit(client) - client.dailyUsage.count;
}

export async function recordSend(email) {
  const clients = await readClients();
  const client = clients[email];
  if (!client) return;

  const today = getTodayKey();
  if (!client.dailyUsage || client.dailyUsage.date !== today) {
    client.dailyUsage = { date: today, count: 0 };
  }
  client.dailyUsage.count += 1;
  await saveClients(clients);
}

// --- Shared in-memory campaign status tracker ---
// NOTE: this lives in server memory. On a normal Node host (Render, a VPS,
// `next start` on any always-on server) this works exactly like the original
// Express app. On a serverless platform (e.g. Vercel) each request can hit a
// different, short-lived instance, so this in-memory object would NOT
// reliably persist between the "start campaign" call and later "status"
// polls. If you deploy there, swap this for something external (e.g. a
// small Redis/Upstash store) — everything else in this file stays the same.
if (!global.__campaignStatus) global.__campaignStatus = {};
export const campaignStatus = global.__campaignStatus;

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function interruptibleSleep(ms, stopFn) {
  const step = 1000;
  let waited = 0;
  while (waited < ms) {
    if (stopFn()) return;
    const chunk = Math.min(step, ms - waited);
    await sleep(chunk);
    waited += chunk;
  }
}
