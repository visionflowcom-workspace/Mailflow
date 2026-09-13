import { isAdmin } from '../../../lib/session';
import { readClients } from '../../../lib/store';
import { PLANS, getPlanLimit, getRemainingQuota, getTodayKey } from '../../../lib/plans';

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Not logged in as admin.' });

  const ACTIVE_WINDOW_MS = 48 * 60 * 60 * 1000; // "recently active" = seen in the last 48 hours
  const now = Date.now();

  const clients = await readClients();
  const users = await Promise.all(Object.values(clients).map(async (c) => {
    // lastSeenAt is set on login/OAuth-connect/session-check. Older accounts
    // created before this tracking existed won't have it yet, so fall back
    // to connectedAt for them.
    const lastSeenAt = c.lastSeenAt || c.connectedAt || null;
    const isActive = !!lastSeenAt && (now - new Date(lastSeenAt).getTime()) < ACTIVE_WINDOW_MS;

    return {
      email: c.email,
      provider: c.provider || 'google',
      plan: c.plan || 'free',
      planName: PLANS[c.plan || 'free']?.name || c.plan,
      connectedAt: c.connectedAt || null,
      lastSeenAt,
      isActive,
      hasSheet: !!c.sheetUrl,
      hasPassword: !!c.passwordHash,
      sentToday: c.dailyUsage?.date === getTodayKey() ? c.dailyUsage.count : 0,
      dailyLimit: getPlanLimit(c),
      remainingQuota: await getRemainingQuota(c.email),
      quotaShare: c.quotaShare ? { slots: c.quotaShare.slots, members: c.quotaShare.members, ownerEmail: c.quotaShare.ownerEmail } : null,
      pendingUpgrade: c.pendingUpgrade && c.pendingUpgrade.status === 'pending' ? c.pendingUpgrade : null,
    };
  }));
  users.sort((a, b) => (b.connectedAt || '').localeCompare(a.connectedAt || ''));

  res.json({ users, plans: PLANS });
}
