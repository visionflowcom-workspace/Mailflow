import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

const PAGE_CSS = `
  :root { --ink:#1e1b3a; --muted:#6b7280; --bg:#f2f1fb; --line:#e6e4f7; --accent1:#6d5ef8; --accent2:#8b5cf6; --accent-text:#4c3fd7; --green:#16a34a; --green-bg:#ecfdf3; --red:#b3261e; --red-bg:#fbeaea; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--ink); }
  .es-page { min-height: 100vh; padding: 28px; }
  .wrap { max-width: 980px; margin: 0 auto; }
  h1 { font-size: 22px; margin: 0 0 20px; }
  .card-wrap { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 28px; box-shadow: 0 8px 24px rgba(80,60,200,0.06); margin-bottom: 18px; }
  #login-card input { width: 100%; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; font-size: 14px; background: #faf9ff; margin-bottom: 14px; }
  #login-card button, .logout-btn { width: 100%; padding: 12px; border: none; border-radius: 10px; background: linear-gradient(90deg, var(--accent1), var(--accent2)); color: #fff; font-weight: 600; cursor: pointer; font-size: 14px; }
  .logout-btn { width: auto; padding: 8px 16px; background: #fff; border: 1px solid var(--line); color: var(--muted); }
  .req-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--line); }
  .req-row:last-child { border-bottom: none; }
  .req-info b { display: block; font-size: 14.5px; }
  .req-info span { font-size: 12.5px; color: var(--muted); display: block; margin-top: 2px; }
  .req-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .req-actions button { padding: 8px 14px; border-radius: 8px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; }
  .approve-btn { background: var(--green-bg); color: var(--green); }
  .reject-btn { background: var(--red-bg); color: var(--red); }
  .status { margin-top: 14px; font-size: 14px; padding: 10px 14px; border-radius: 10px; display: none; }
  .status.success { display: block; color: var(--green); background: var(--green-bg); }
  .status.error { display: block; color: var(--red); background: var(--red-bg); }
  .empty { text-align: center; color: var(--muted); padding: 20px 0; font-size: 14px; }
  .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .tabs { display: flex; gap: 8px; margin-bottom: 18px; }
  .tab-btn { padding: 9px 18px; border-radius: 10px; border: 1px solid var(--line); background: #fff; color: var(--muted); font-size: 13.5px; font-weight: 600; cursor: pointer; }
  .tab-btn.active { background: linear-gradient(90deg, var(--accent1), var(--accent2)); color: #fff; border: none; }
  .users-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .users-table th { text-align: left; padding: 8px 10px; color: var(--muted); font-weight: 600; border-bottom: 1px solid var(--line); white-space: nowrap; }
  .users-table td { padding: 10px 10px; border-bottom: 1px solid var(--line); vertical-align: middle; }
  .users-table tr:last-child td { border-bottom: none; }
  .plan-select { padding: 6px 8px; border-radius: 6px; border: 1px solid var(--line); font-size: 12.5px; background: #faf9ff; }
  .save-plan-btn { padding: 6px 10px; border-radius: 6px; border: none; background: var(--accent1); color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; margin-left: 6px; }
  .del-user-btn { padding: 6px 10px; border-radius: 6px; border: none; background: var(--red-bg); color: var(--red); font-size: 12px; font-weight: 600; cursor: pointer; }
  .pill { font-size: 11px; padding: 2px 8px; border-radius: 999px; font-weight: 600; }
  .pill.yes { background: var(--green-bg); color: var(--green); }
  .pill.no { background: #f1f0f5; color: var(--muted); }
  .search-input { width: 100%; padding: 10px 14px; border: 1px solid var(--line); border-radius: 10px; font-size: 14px; background: #faf9ff; margin-bottom: 14px; }
`;

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState('requests');
  const [quotaOwner, setQuotaOwner] = useState('');
  const [quotaSlots, setQuotaSlots] = useState('2');
  const [quotaMembers, setQuotaMembers] = useState(['', '']);
  const [requests, setRequests] = useState([]);
  const [plans, setPlans] = useState({});
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [planPicks, setPlanPicks] = useState({}); // email -> selected plan key while editing
  const [loginStatus, setLoginStatus] = useState('');
  const [actionStatus, setActionStatus] = useState({ text: '', type: '' });
  const passwordRef = useRef(null);

  async function loadRequests() {
    const res = await fetch('/api/admin/requests', { credentials: 'same-origin' });
    if (!res.ok) {
      setLoggedIn(false);
      setChecked(true);
      return;
    }
    setLoggedIn(true);
    setChecked(true);
    const data = await res.json();
    setRequests(data.requests);
    setPlans(data.plans);
  }

  async function loadUsers() {
    const res = await fetch('/api/admin/users', { credentials: 'same-origin' });
    if (!res.ok) return;
    const data = await res.json();
    setUsers(data.users);
    setPlans(data.plans);
  }

  useEffect(() => { loadRequests(); }, []);
  useEffect(() => { if (loggedIn && tab === 'users') loadUsers(); }, [loggedIn, tab]);

  async function handleSetPlan(email) {
    const plan = planPicks[email];
    if (!plan) return;
    try {
      const res = await fetch('/api/admin/set-plan', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setActionStatus({ text: `${email}'s plan updated to ${plans[plan]?.name || plan}.`, type: 'success' });
      loadUsers();
    } catch (err) {
      setActionStatus({ text: err.message, type: 'error' });
    }
  }

  async function handleQuotaShare() {
    if (!quotaOwner) return setActionStatus({ text: 'Select a subscription owner first.', type: 'error' });
    const count = Number(quotaSlots);
    const memberEmails = quotaMembers.slice(0, count - 1).map((e) => e.trim().toLowerCase()).filter(Boolean);
    try {
      const res = await fetch('/api/admin/quota-share', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerEmail: quotaOwner, memberEmails, slots: count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not update quota sharing.');
      setActionStatus({ text: data.message || `${quotaOwner} quota is now shared across ${count} email accounts.`, type: 'success' });
      loadUsers();
    } catch (err) {
      setActionStatus({ text: err.message, type: 'error' });
    }
  }

  async function handleDeleteUser(email) {
    const sure = confirm(`Delete ${email}? This revokes their Gmail/Sheets access and permanently removes all their stored data.`);
    if (!sure) return;
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setActionStatus({ text: `${email} deleted.`, type: 'success' });
      loadUsers();
    } catch (err) {
      setActionStatus({ text: err.message, type: 'error' });
    }
  }

  const filteredUsers = users.filter((u) => u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const selectedOwner = users.find((u) => u.email === quotaOwner);
  const maxQuotaSlots = selectedOwner?.plan === 'business' ? 3 : selectedOwner?.plan === 'pro' ? 2 : 1;


  async function decide(email, action) {
    let reason;
    if (action === 'reject') {
      reason = prompt('Reason for rejecting (optional):') || '';
    }
    try {
      const res = await fetch(`/api/admin/${action}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setActionStatus({ text: action === 'approve' ? `${email} upgraded.` : `${email}'s request rejected.`, type: 'success' });
      loadRequests();
    } catch (err) {
      setActionStatus({ text: err.message, type: 'error' });
    }
  }

  async function handleLogin() {
    const password = passwordRef.current.value;
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      loadRequests();
    } catch (err) {
      setLoginStatus(err.message);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
    setLoggedIn(false);
  }

  if (!checked) return null;

  return (
    <>
      <Head><title>Admin — Upgrade requests</title></Head>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <div className="es-page">
        <div className="wrap">
          {!loggedIn && (
            <div id="login-card" className="card-wrap">
              <h1>Admin login</h1>
              <input type="password" ref={passwordRef} placeholder="Admin password" onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
              <button onClick={handleLogin}>Log in</button>
              {loginStatus && <div className="status error">{loginStatus}</div>}
            </div>
          )}

          {loggedIn && (
            <div id="dashboard">
              <div className="topbar">
                <h1 style={{ margin: 0 }}>Admin</h1>
                <button className="logout-btn" onClick={handleLogout}>Log out</button>
              </div>

              <div className="tabs">
                <button className={`tab-btn ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')}>Upgrade requests {requests.length > 0 ? `(${requests.length})` : ''}</button>
                <button className={`tab-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>All Users {users.length > 0 ? `(${users.length})` : ''}</button>
                <button className={`tab-btn ${tab === 'quota' ? 'active' : ''}`} onClick={() => { setTab('quota'); if (!users.length) loadUsers(); }}>Quota Sharing</button>
              </div>

              {tab === 'quota' && (
                <div className="card-wrap">
                  <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Share subscription quota</h2>
                  <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: 13 }}>
                    Give one paid subscription to multiple email accounts. Pro supports up to 2 accounts; Business supports up to 3. They use one shared daily credit pool, just like a family quota.
                  </p>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Subscription owner</label>
                  <select className="plan-select" style={{ width: '100%', padding: 10, marginBottom: 14 }} value={quotaOwner} onChange={(e) => { setQuotaOwner(e.target.value); setQuotaMembers(['', '']); }}>
                    <option value="">Select paid user...</option>
                    {users.filter((u) => u.plan === 'pro' || u.plan === 'business').map((u) => (
                      <option key={u.email} value={u.email}>{u.email} — {u.planName}</option>
                    ))}
                  </select>

                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Email accounts sharing the quota</label>
                  <select className="plan-select" style={{ width: '100%', padding: 10, marginBottom: 14 }} value={quotaSlots} onChange={(e) => setQuotaSlots(e.target.value)}>
                    <option value="2" disabled={maxQuotaSlots < 2}>2 email accounts</option>
                    <option value="3" disabled={maxQuotaSlots < 3}>3 email accounts</option>
                    <option value="1">Disable sharing / single account</option>
                  </select>

                  {Number(quotaSlots) > 1 && Array.from({ length: Number(quotaSlots) - 1 }).map((_, i) => (
                    <input key={i} className="search-input" style={{ marginBottom: 10 }} type="email" placeholder={`Additional email account ${i + 1}`} value={quotaMembers[i] || ''} onChange={(e) => setQuotaMembers((prev) => { const next = [...prev]; next[i] = e.target.value; return next; })} />
                  ))}

                  {selectedOwner && Number(quotaSlots) > 1 && (
                    <div style={{ background: '#f7f5ff', border: '1px solid var(--line)', borderRadius: 12, padding: 14, margin: '8px 0 16px', fontSize: 13 }}>
                      <b>{selectedOwner.planName}:</b> {selectedOwner.dailyLimit.toLocaleString()} daily credits shared across {quotaSlots} accounts.
                      <div style={{ color: 'var(--muted)', marginTop: 4 }}>Approx. {Math.ceil(selectedOwner.dailyLimit / Number(quotaSlots)).toLocaleString()} credits per account when the pool is split evenly.</div>
                    </div>
                  )}
                  <button className="save-plan-btn" style={{ padding: '10px 16px', borderRadius: 9, marginLeft: 0 }} onClick={handleQuotaShare}>Save quota sharing</button>
                </div>
              )}

              {tab === 'requests' && (
                <div className="card-wrap">
                  {requests.length === 0 ? (
                    <div className="empty">No pending requests right now.</div>
                  ) : (
                    requests.map((r) => (
                      <div className="req-row" key={r.email}>
                        <div className="req-info">
                          <b>{r.email}</b>
                          <span>{plans[r.currentPlan]?.name || r.currentPlan} → {plans[r.requestedPlan]?.name || r.requestedPlan} · via {r.method} · Ref: {r.reference}</span>
                          {r.note && <span>Note: {r.note}</span>}
                          <span>Submitted: {new Date(r.submittedAt).toLocaleString()}</span>
                        </div>
                        <div className="req-actions">
                          <button className="approve-btn" onClick={() => decide(r.email, 'approve')}>Approve</button>
                          <button className="reject-btn" onClick={() => decide(r.email, 'reject')}>Reject</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {tab === 'users' && (
                <div className="card-wrap">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                  {filteredUsers.length === 0 ? (
                    <div className="empty">No users found.</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="users-table">
                        <thead>
                          <tr>
                            <th>Email</th>
                            <th>Provider</th>
                            <th>Plan</th>
                            <th>Active</th>
                            <th>Sheet</th>
                            <th>Password</th>
                            <th>Sent today</th>
                            <th>Credits left</th>
                            <th>Connected</th>
                            <th>Change plan</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u) => (
                            <tr key={u.email}>
                              <td>{u.email}{u.pendingUpgrade && <span className="pill" style={{ background: '#fffbeb', color: '#b45309', marginLeft: 6 }}>pending</span>}</td>
                              <td>{u.provider === 'microsoft' ? '🟦 Outlook' : '🔵 Gmail'}</td>
                              <td>{u.planName}</td>
                              <td>
                                <span
                                  className={`pill ${u.isActive ? 'yes' : 'no'}`}
                                  title={u.lastSeenAt ? `Last seen: ${new Date(u.lastSeenAt).toLocaleString()}` : 'Never seen since connecting'}
                                >
                                  {u.isActive ? '🟢 Active' : '⚪ Inactive'}
                                </span>
                              </td>
                              <td><span className={`pill ${u.hasSheet ? 'yes' : 'no'}`}>{u.hasSheet ? 'Yes' : 'No'}</span></td>
                              <td><span className={`pill ${u.hasPassword ? 'yes' : 'no'}`}>{u.hasPassword ? 'Yes' : 'No'}</span></td>
                              <td>{u.sentToday}</td>
                              <td>{Math.max(u.remainingQuota, 0)} / {u.dailyLimit}</td>
                              <td>{u.connectedAt ? new Date(u.connectedAt).toLocaleDateString() : '—'}</td>
                              <td>
                                <select
                                  className="plan-select"
                                  defaultValue={u.plan}
                                  onChange={(e) => setPlanPicks((p) => ({ ...p, [u.email]: e.target.value }))}
                                >
                                  {Object.entries(plans).map(([key, plan]) => (
                                    <option key={key} value={key}>{plan.name}</option>
                                  ))}
                                </select>
                                <button className="save-plan-btn" onClick={() => handleSetPlan(u.email)}>Save</button>
                              </td>
                              <td><button className="del-user-btn" onClick={() => handleDeleteUser(u.email)}>Delete</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {actionStatus.text && <div className={`status ${actionStatus.type}`}>{actionStatus.text}</div>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
