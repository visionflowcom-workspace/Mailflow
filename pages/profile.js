import { useEffect, useState } from 'react';
import Head from 'next/head';

const PAGE_CSS = `
  :root { --ink:#172554; --ink2:#23346f; --muted:#7180a6; --bg:#f5f6ff; --line:#e5e8f7; --accent1:#4f63ff; --accent2:#7c3aed; --accent3:#9b5cf6; --green:#16a34a; --green-bg:#ecfdf3; --amber:#b45309; --amber-bg:#fffbeb; --red:#d92d5b; --red-bg:#fff1f5; }
  * { box-sizing: border-box; }
  html { scroll-behavior:smooth; }
  body { margin:0; font-family:'Segoe UI',system-ui,-apple-system,sans-serif; background:var(--bg); color:var(--ink); }
  a,button { -webkit-tap-highlight-color:transparent; }
  .es-page { min-height:100vh; padding:30px 34px 44px; position:relative; overflow:hidden; }
  .es-page::before,.es-page::after { content:""; position:fixed; width:430px; height:430px; border-radius:50%; filter:blur(12px); pointer-events:none; opacity:.42; z-index:0; }
  .es-page::before { left:-260px; top:180px; background:radial-gradient(circle,rgba(96,126,255,.18),transparent 68%); }
  .es-page::after { right:-260px; bottom:-140px; background:radial-gradient(circle,rgba(139,92,246,.18),transparent 68%); }
  .topbar,.wrap { position:relative; z-index:1; }
  .topbar { display:flex; align-items:center; justify-content:space-between; max-width:1120px; margin:0 auto 26px; }
  .brand { display:flex; align-items:center; gap:12px; }
  .brand img { height:44px; width:auto; }
  .brand-text h2 { margin:0; font-size:18px; font-weight:750; color:#1c2d67; }
  .brand-text p { margin:2px 0 0; font-size:12.5px; color:var(--muted); }
  .top-actions { display:flex; align-items:center; gap:10px; }
  .top-btn { display:inline-flex; align-items:center; gap:8px; padding:10px 15px; border-radius:12px; border:1px solid #dfe3f5; background:rgba(255,255,255,.9); color:#39477d; text-decoration:none; font-size:13px; font-weight:700; box-shadow:0 6px 18px rgba(59,73,150,.07); transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,background .2s ease; }
  .top-btn:hover { transform:translateY(-2px); border-color:#bfc6ff; box-shadow:0 12px 24px rgba(79,99,255,.14); background:#fff; }
  .wrap { max-width:1120px; margin:0 auto; }

  .hero-title { display:flex; align-items:center; gap:20px; min-height:128px; padding:18px 34px; border-radius:42px; background:linear-gradient(110deg,#5b75ff 0%,#5963f6 52%,#8a4eea 100%); color:#fff; box-shadow:0 18px 44px rgba(84,91,235,.22); margin-bottom:24px; overflow:hidden; position:relative; }
  .hero-title::after { content:""; position:absolute; width:300px; height:300px; right:-80px; top:-100px; border-radius:50%; background:rgba(255,255,255,.09); }
  .hero-icon { width:88px; height:88px; border-radius:50%; background:rgba(38,43,193,.35); border:1px solid rgba(255,255,255,.18); display:flex; align-items:center; justify-content:center; flex:0 0 auto; box-shadow:inset 0 0 0 12px rgba(255,255,255,.06); }
  .person-icon { width:48px; height:48px; position:relative; }
  .person-icon::before { content:""; position:absolute; width:22px; height:22px; border:6px solid #fff; border-radius:50%; left:7px; top:0; }
  .person-icon::after { content:""; position:absolute; width:38px; height:21px; border:6px solid #fff; border-radius:18px 18px 10px 10px; left:-1px; bottom:0; }
  .hero-title h1 { margin:0; font-size:46px; line-height:1; letter-spacing:-1px; font-weight:750; position:relative; z-index:1; }
  .hero-title p { margin:8px 0 0; color:rgba(255,255,255,.82); font-size:14px; position:relative; z-index:1; }

  .profile-shell { display:grid; grid-template-columns:minmax(0,1.6fr) minmax(300px,.8fr); gap:20px; align-items:start; }
  .card-wrap { background:rgba(255,255,255,.94); border:1px solid var(--line); border-radius:20px; padding:26px; margin-bottom:20px; box-shadow:0 12px 34px rgba(65,76,160,.08); transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease; }
  .card-wrap:hover { transform:translateY(-2px); box-shadow:0 18px 40px rgba(65,76,160,.11); border-color:#d9def7; }
  .identity { display:flex; align-items:center; gap:16px; padding-bottom:22px; border-bottom:1px solid var(--line); }
  .avatar { width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg,#4d6cff,#7b46ef); display:flex; align-items:center; justify-content:center; color:#fff; font-size:28px; font-weight:750; flex:0 0 auto; box-shadow:0 10px 24px rgba(79,99,255,.24); }
  .identity h2 { margin:0 0 5px; font-size:20px; color:#18245a; overflow-wrap:anywhere; }
  .identity p { margin:0; color:var(--muted); font-size:13px; }
  .badges { margin-left:auto; display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; }
  .plan-pill { display:inline-flex; align-items:center; gap:7px; padding:8px 13px; border-radius:999px; color:#fff; background:linear-gradient(90deg,var(--accent1),var(--accent2)); font-size:12px; font-weight:750; white-space:nowrap; }
  .provider-pill { background:#eef8f1; color:#15803d; border:1px solid #d5f0dc; }

  .section-title { display:flex; align-items:center; gap:11px; margin:0 0 17px; font-size:16px; font-weight:750; color:#1c2a64; }
  .section-icon { width:38px; height:38px; border-radius:11px; background:#eeedff; color:#5a4cf2; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; }
  .stat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:13px; }
  .stat-box { background:linear-gradient(180deg,#fbfbff,#f7f7ff); border:1px solid var(--line); border-radius:15px; padding:18px 12px; text-align:center; transition:transform .22s ease,box-shadow .22s ease; }
  .stat-box:hover { transform:translateY(-3px); box-shadow:0 10px 22px rgba(79,99,255,.09); }
  .stat-box .num { font-size:25px; font-weight:800; color:#1d2b68; }
  .stat-box .lbl { font-size:12px; color:var(--muted); margin-top:3px; }
  .usage-track { height:9px; background:#ececff; border-radius:999px; overflow:hidden; margin-top:17px; }
  .usage-fill { height:100%; width:0; border-radius:999px; background:linear-gradient(90deg,var(--accent1),var(--accent2)); transition:width .9s cubic-bezier(.22,.8,.22,1); }
  .usage-note { display:flex; justify-content:space-between; margin-top:8px; font-size:12px; color:var(--muted); }

  .info-row { display:flex; justify-content:space-between; gap:24px; padding:12px 0; border-bottom:1px dashed var(--line); font-size:13.5px; }
  .info-row:last-child { border-bottom:none; padding-bottom:0; }
  .info-row .label { color:var(--muted); }
  .info-row .value { font-weight:700; color:#253469; text-align:right; max-width:62%; overflow-wrap:anywhere; }

  .action-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
  .action-btn { min-height:82px; display:flex; align-items:center; gap:13px; width:100%; padding:15px 16px; border-radius:15px; text-align:left; cursor:pointer; text-decoration:none; border:1px solid var(--line); background:#fbfbff; color:var(--ink); font-family:inherit; transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease,background .22s ease; }
  .action-btn:hover { transform:translateY(-3px); border-color:#cbd1ff; box-shadow:0 12px 24px rgba(79,99,255,.13); background:#fff; }
  .action-btn:active { transform:translateY(0) scale(.985); }
  .action-btn.primary { background:linear-gradient(110deg,#4e67ff,#7546ed); color:#fff; border:none; box-shadow:0 10px 24px rgba(79,99,255,.22); }
  .action-btn.primary:hover { box-shadow:0 16px 30px rgba(79,99,255,.30); filter:brightness(1.03); }
  .action-btn.danger { grid-column:1/-1; background:var(--red-bg); color:var(--red); border-color:#ffd5e0; }
  .action-icon { width:45px; height:45px; border-radius:13px; background:#eeefff; display:flex; align-items:center; justify-content:center; color:#5a4cf2; font-size:18px; font-weight:800; flex:0 0 auto; }
  .primary .action-icon { background:rgba(255,255,255,.15); color:#fff; }
  .danger .action-icon { background:#ffe0e8; color:#d92d5b; }
  .action-copy { min-width:0; flex:1; }
  .action-copy strong { display:block; font-size:13.5px; margin-bottom:3px; }
  .action-copy span { display:block; font-size:11.5px; color:var(--muted); line-height:1.35; }
  .primary .action-copy span { color:rgba(255,255,255,.8); }
  .action-btn:hover

  .side-card { position:sticky; top:22px; }
  .plan-hero { border-radius:18px; padding:23px; color:#fff; background:linear-gradient(135deg,#4d69ff,#7048ed 68%,#8c4eea); box-shadow:0 16px 34px rgba(83,80,226,.22); overflow:hidden; position:relative; }
  .plan-hero::after { content:""; position:absolute; width:180px; height:180px; border-radius:50%; right:-65px; top:-65px; background:rgba(255,255,255,.10); }
  .eyebrow { font-size:11px; text-transform:uppercase; letter-spacing:.12em; opacity:.76; font-weight:750; }
  .plan-name { font-size:28px; font-weight:800; margin-top:5px; position:relative; z-index:1; }
  .plan-limit { margin-top:4px; font-size:13px; opacity:.86; position:relative; z-index:1; }
  .mini-progress { height:8px; background:rgba(255,255,255,.22); border-radius:999px; margin-top:20px; overflow:hidden; position:relative; z-index:1; }
  .mini-progress > div { height:100%; border-radius:999px; background:#fff; transition:width .8s ease; }
  .plan-hero .upgrade-link { margin-top:16px; display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:11px 14px; border-radius:11px; background:#fff; color:#5648dc; text-decoration:none; font-size:13px; font-weight:800; transition:transform .2s ease,box-shadow .2s ease; position:relative; z-index:1; }
  .plan-hero .upgrade-link:hover { transform:translateY(-2px); box-shadow:0 10px 20px rgba(35,31,120,.18); }
  .quick-note { margin-top:16px; padding:14px; border-radius:13px; background:#f7f7ff; border:1px solid var(--line); color:var(--muted); font-size:12.5px; line-height:1.5; }
  .quick-note strong { display:block; color:#27366d; margin-bottom:4px; }

  .status-banner { padding:13px 16px; border-radius:13px; font-size:13px; margin-bottom:16px; border:1px solid transparent; }
  .status-banner.pending { background:var(--amber-bg); color:var(--amber); border-color:#fde7b0; }
  .status-banner.approved { background:var(--green-bg); color:var(--green); border-color:#c9efd7; }
  .status-banner.rejected { background:var(--red-bg); color:var(--red); border-color:#ffd3df; }
  .status { margin-top:14px; font-size:13.5px; padding:11px 14px; border-radius:11px; display:none; }
  .status.success { display:block; color:var(--green); background:var(--green-bg); }
  .status.error { display:block; color:var(--red); background:var(--red-bg); }
  .footer { max-width:1120px; margin:5px auto 0; display:flex; justify-content:space-between; align-items:center; color:var(--muted); font-size:12px; position:relative; z-index:1; }
  .privacy-btn { display:inline-flex; align-items:center; gap:7px; padding:9px 13px; border-radius:999px; background:#fff; color:#4c3fd7; border:1px solid #d4d0ff; text-decoration:none; font-weight:750; transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease; }
  .privacy-btn:hover { transform:translateY(-2px); box-shadow:0 9px 18px rgba(79,99,255,.12); border-color:#b9b1ff; }
  @media (max-width: 900px) { .profile-shell { grid-template-columns:1fr; } .side-card { position:static; } .topbar { max-width:none; } .wrap { max-width:none; } }
  @media (max-width: 640px) { .es-page { padding:18px 14px 30px; } .topbar { align-items:flex-start; gap:12px; } .brand img { height:38px; } .brand-text { display:none; } .top-actions .back-campaign { display:none; } .hero-title { min-height:104px; padding:14px 18px; border-radius:30px; gap:13px; } .hero-icon { width:68px; height:68px; } .hero-title h1 { font-size:32px; } .hero-title p { font-size:11.5px; } .identity { align-items:flex-start; flex-wrap:wrap; } .badges { margin-left:0; width:100%; justify-content:flex-start; } .stat-grid { grid-template-columns:1fr; } .action-grid { grid-template-columns:1fr; } .action-btn.danger { grid-column:auto; } .card-wrap { padding:20px; border-radius:17px; } .footer { gap:12px; flex-wrap:wrap; } }
`;

export default function Profile() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState({ text: '', type: '' });
  const [changeStatus, setChangeStatus] = useState({ text: '', type: '' });

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/profile', { credentials: 'same-origin' });
      if (!res.ok) {
        window.location.href = '/';
        return;
      }
      const json = await res.json();
      setData(json);

      const params = new URLSearchParams(window.location.search);
      if (params.get('changed') === '1') {
        setChangeStatus({ text: 'Your Gmail account was changed successfully. Your plan, sheet, and password all carried over.', type: 'success' });
      } else if (params.get('changed') === 'blocked') {
        setChangeStatus({ text: 'That Gmail is already registered as a separate account here, so we logged you into that one instead — nothing was overwritten.', type: 'error' });
      }
    })();
  }, []);

  async function handleChangeEmail() {
    const sure = confirm('This will let you connect a different Gmail account. Your plan, sheet, and password will carry over to the new account. Continue?');
    if (!sure) return;
    window.location.href = '/api/start-email-change';
  }

  async function handleDisconnect() {
    const sure = confirm('This will revoke Gmail/Sheets access, log you out, and permanently delete your stored data (sheet link, password, plan). Continue?');
    if (!sure) return;

    try {
      const res = await fetch('/api/disconnect-account', { method: 'POST', credentials: 'same-origin' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setStatus({ text: 'Disconnected. Redirecting…', type: 'success' });
      setTimeout(() => { window.location.href = '/'; }, 1200);
    } catch (err) {
      setStatus({ text: err.message, type: 'error' });
    }
  }

  const remaining = data ? Math.max(data.remainingQuota, 0) : 0;
  const daily = data ? Math.max(data.dailyLimit, 0) : 0;
  const usedPct = daily ? Math.min(100, Math.max(0, (data.sentToday / daily) * 100)) : 0;

  return (
    <>
      <Head><title>Your profile</title></Head>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <div className="es-page">
        <div className="topbar">
          <div className="brand">
            <img src="/assets/logo.png" alt="Email Sender" />
            <div className="brand-text"><h2>Email Sender</h2><p>Smart Email Automation</p></div>
          </div>
          <div className="top-actions">
            <a href="/campaign" className="top-btn back-campaign">← Back to campaign</a>
          </div>
        </div>

        <div className="wrap">
          <section className="hero-title">
            <div className="hero-icon"><span className="person-icon" /></div>
            <div>
              <h1>Profile</h1>
              <p>Manage your account, plan and email automation settings</p>
            </div>
          </section>

          {changeStatus.text && <div className={`status-banner ${changeStatus.type === 'success' ? 'approved' : 'rejected'}`}>{changeStatus.text}</div>}
          {data?.pendingUpgrade && (
            <div className="status-banner pending">Your upgrade request to <b>{data.pendingUpgrade.plan}</b> (ref: {data.pendingUpgrade.reference}) is awaiting approval.</div>
          )}

          <div className="profile-shell">
            <main>
              <div className="card-wrap">
                <div className="identity">
                  <div className="avatar">{data ? data.email[0].toUpperCase() : '?'}</div>
                  <div>
                    <h2>{data ? data.email : 'Loading…'}</h2>
                    <p>{data?.connectedAt ? `Client since ${new Date(data.connectedAt).toLocaleDateString()}` : 'Loading account details…'}</p>
                  </div>
                  <div className="badges">
                    <span className="plan-pill">{data ? `${data.planName} plan` : '—'}</span>
                    {data && <span className="plan-pill provider-pill">{data.provider === 'microsoft' ? 'Outlook' : 'Gmail'}</span>}
                  </div>
                </div>
              </div>

              <div className="card-wrap">
                <h2 className="section-title"><span className="section-icon">%</span>Usage today</h2>
                <div className="stat-grid">
                  <div className="stat-box"><div className="num">{data ? data.sentToday : '—'}</div><div className="lbl">Sent today</div></div>
                  <div className="stat-box"><div className="num">{data ? remaining : '—'}</div><div className="lbl">Credits left</div></div>
                  <div className="stat-box"><div className="num">{data ? data.dailyLimit : '—'}</div><div className="lbl">Daily credits</div></div>
                </div>
                <div className="usage-track"><div className="usage-fill" style={{ width: `${usedPct}%` }} /></div>
                <div className="usage-note"><span>{data ? `${data.sentToday} credits used` : 'Loading…'}</span><span>{data ? `${remaining} remaining` : ''}</span></div>
              </div>

              {data?.lastCampaign && (
                <div className="card-wrap">
                  <h2 className="section-title"><span className="section-icon">↗</span>Last campaign</h2>
                  <div className="info-row"><span className="label">Status</span><span className="value">{data.lastCampaign.running ? 'Running…' : 'Finished'}</span></div>
                  <div className="info-row"><span className="label">Sent</span><span className="value">{data.lastCampaign.sent}</span></div>
                  <div className="info-row"><span className="label">Failed</span><span className="value">{data.lastCampaign.failed}</span></div>
                  <div className="info-row"><span className="label">Total recipients</span><span className="value">{data.lastCampaign.total}</span></div>
                </div>
              )}

              <div className="card-wrap">
                <h2 className="section-title"><span className="section-icon">i</span>Account details</h2>
                <div className="info-row"><span className="label">Email account</span><span className="value">{data?.email || '—'}</span></div>
                <div className="info-row"><span className="label">Connected since</span><span className="value">{data?.connectedAt ? new Date(data.connectedAt).toLocaleString() : '—'}</span></div>
                <div className="info-row"><span className="label">Contact list</span><span className="value">{data ? (data.hasSheet ? (data.contactSource === 'upload' ? `${data.contactFilename} (${data.contactRowCount} contacts)` : 'Google Sheet connected') : 'Not added yet') : '—'}</span></div>
                <div className="info-row"><span className="label">Password login</span><span className="value">{data ? (data.hasPassword ? 'Set' : 'Not set') : '—'}</span></div>
              </div>
            </main>

            <aside className="side-card">
              <div className="plan-hero">
                <div className="eyebrow">Current subscription</div>
                <div className="plan-name">{data ? data.planName : '—'}</div>
                <div className="plan-limit">{data ? `${data.dailyLimit} send credits / day` : 'Loading plan…'}</div>
                <div className="mini-progress"><div style={{ width: `${usedPct}%` }} /></div>
                <a href="/upgrade" className="upgrade-link">Upgrade plan <span>→</span></a>
              </div>

              <div className="card-wrap" style={{ marginTop: 18 }}>
                <h2 className="section-title"><span className="section-icon">+</span>Manage account</h2>
                <div className="action-grid">
                  <a href="/upgrade" className="action-btn primary"><span className="action-icon">↑</span><span className="action-copy"><strong>Upgrade plan</strong><span>Get more features & benefits</span></span></a>
                  <a href="/connected" className="action-btn"><span className="action-icon">▦</span><span className="action-copy"><strong>Change spreadsheet</strong><span>Select a different sheet</span></span></a>
                  <a href="/set-password?from=profile" className="action-btn"><span className="action-icon">⌑</span><span className="action-copy"><strong>Change password</strong><span>Update your password</span></span></a>
                  <button type="button" onClick={handleChangeEmail} className="action-btn"><span className="action-icon">G</span><span className="action-copy"><strong>Change Gmail account</strong><span>Switch your Gmail account</span></span></button>
                  <button type="button" onClick={handleDisconnect} className="action-btn danger"><span className="action-icon">×</span><span className="action-copy"><strong>Disconnect & delete my data</strong><span>Permanently remove your account data. This action cannot be undone.</span></span></button>
                </div>
                {status.text && <div className={`status ${status.type}`}>{status.text}</div>}
              </div>
            </aside>
          </div>

          <div className="footer">
            <a href="/privacy-policy" className="privacy-btn">Privacy Policy</a>
            <span>Powered by <b style={{ color:'#4c3fd7' }}>VisionFlow</b> ✓</span>
          </div>
        </div>
      </div>
    </>
  );
}
