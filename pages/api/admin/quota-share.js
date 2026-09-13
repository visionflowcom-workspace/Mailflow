import { isAdmin } from '../../../lib/session';
import { readClients, saveClients } from '../../../lib/store';
import { PLANS } from '../../../lib/plans';

function clearGroup(clients, members) {
  for (const email of members || []) {
    if (clients[email]) delete clients[email].quotaShare;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!isAdmin(req)) return res.status(401).json({ error: 'Not logged in as admin.' });

  const { ownerEmail, memberEmails = [], slots } = req.body || {};
  const clients = await readClients();
  const normalizedOwnerEmail = String(ownerEmail || '').trim().toLowerCase();
  const owner = clients[normalizedOwnerEmail];
  if (!owner) return res.status(404).json({ error: 'Subscription owner not found.' });

  const plan = owner.plan || 'free';
  const maxSlots = plan === 'business' ? 3 : plan === 'pro' ? 2 : 1;
  const requestedSlots = Number(slots);

  if (requestedSlots === 1) {
    const oldMembers = owner.quotaShare?.members || [normalizedOwnerEmail];
    clearGroup(clients, oldMembers);
    await saveClients(clients);
    return res.json({ success: true, message: 'Quota sharing disabled for this account.' });
  }

  if (!Number.isInteger(requestedSlots) || requestedSlots < 2 || requestedSlots > maxSlots) {
    return res.status(400).json({ error: `${PLANS[plan]?.name || plan} supports up to ${maxSlots} email${maxSlots === 1 ? '' : 's'} in one quota group.` });
  }

  const members = [normalizedOwnerEmail, ...memberEmails]
    .map((e) => String(e || '').trim().toLowerCase())
    .filter(Boolean)
    .filter((e, i, arr) => arr.indexOf(e) === i);

  if (members.length !== requestedSlots) {
    return res.status(400).json({ error: `Select exactly ${requestedSlots - 1} additional email account${requestedSlots === 3 ? 's' : ''}.` });
  }

  for (const email of members) {
    if (!clients[email]) return res.status(404).json({ error: `User not found: ${email}` });
  }

  const groupId = owner.quotaShare?.groupId || `quota_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const previousMembers = owner.quotaShare?.members || [];
  clearGroup(clients, previousMembers.filter((email) => !members.includes(email)));
  // An account can belong to only one quota group. Remove any old group
  // reference before attaching it to this subscription.
  for (const email of members) {
    const oldGroup = clients[email]?.quotaShare;
    if (oldGroup && oldGroup.ownerEmail !== normalizedOwnerEmail) {
      clearGroup(clients, oldGroup.members);
    }
  }

  const share = {
    groupId,
    ownerEmail: normalizedOwnerEmail,
    plan,
    slots: requestedSlots,
    members,
    updatedAt: new Date().toISOString(),
  };

  for (const email of members) clients[email].quotaShare = share;
  await saveClients(clients);

  res.json({ success: true, share, dailyLimit: PLANS[plan].dailyLimit });
}
