import { getSessionEmail } from '../../lib/session';
import { readClients } from '../../lib/store';
import { PLANS, PAYMENT_METHODS, QR_DETAILS_BY_PLAN, getPlanLimit, getRemainingQuota, LEGACY_FEATURES, isTrialExpired, getTrialDaysLeft } from '../../lib/plans';

export default function handler(req, res) {
  const email = getSessionEmail(req);
  if (!email) return res.status(401).json({ error: 'Please log in first.' });

  const clients = readClients();
  const client = clients[email];
  if (!client) return res.status(404).json({ error: 'Client not found.' });

  res.json({
    plans: PLANS,
    paymentMethods: PAYMENT_METHODS,
    qrByPlan: QR_DETAILS_BY_PLAN,
    currentPlan: client.plan || 'free',
    remainingQuota: getRemainingQuota(email),
    dailyLimit: getPlanLimit(client),
    quotaShare: client.quotaShare ? { slots: client.quotaShare.slots, members: client.quotaShare.members, ownerEmail: client.quotaShare.ownerEmail } : null,
    pendingUpgrade: client.pendingUpgrade || null,
    features: client.plan ? (PLANS[client.plan]?.features || PLANS.free.features) : LEGACY_FEATURES,
    trialExpired: isTrialExpired(client),
    trialDaysLeft: getTrialDaysLeft(client),
  });
}
