import { useEffect, useRef } from 'react';
import Head from 'next/head';

const PAGE_CSS = `
  :root { --ink:#1e1b3a; --muted:#6b7280; --bg:#f2f1fb; --line:#e6e4f7; --accent1:#6d5ef8; --accent2:#8b5cf6; --accent-text:#4c3fd7; --green:#16a34a; --green-bg:#ecfdf3; --red:#b3261e; --red-bg:#fbeaea; }
  * { box-sizing:border-box; }
  body { margin:0; font-family:'Segoe UI',system-ui,-apple-system,sans-serif; background:var(--bg); color:var(--ink); }
  .es-page { min-height:100vh; padding:28px; position:relative; overflow-x:hidden; }
  .bg-blob { position:fixed; border-radius:50%; background:radial-gradient(circle,rgba(109,94,248,.12),transparent 70%); z-index:0; }
  .bg-blob.left { width:420px;height:420px;top:20%;left:-180px; } .bg-blob.right { width:420px;height:420px;bottom:10%;right:-180px; }
  .topbar { display:flex;align-items:center;justify-content:space-between;max-width:900px;margin:0 auto 32px;position:relative;z-index:1; }
  .brand { display:flex;align-items:center;gap:12px; } .brand img { height:44px; } .brand-text h2 { margin:0;font-size:18px;font-weight:700; } .brand-text p { margin:0;font-size:12.5px;color:var(--muted); }
  .back-btn { display:inline-flex;align-items:center;gap:7px;padding:10px 15px;border-radius:10px;background:#fff;color:var(--accent-text);border:1px solid #cfc9ff;text-decoration:none;font-size:13px;font-weight:700;box-shadow:0 4px 14px rgba(109,94,248,.12);transition:all .2s ease; }
  .back-btn:hover { background:#f5f3ff;border-color:var(--accent1);transform:translateY(-2px);box-shadow:0 8px 20px rgba(109,94,248,.2); }
  .card-wrap { max-width:520px;margin:0 auto;background:#fff;border:1px solid var(--line);border-radius:18px;padding:44px;position:relative;z-index:1;box-shadow:0 12px 40px rgba(80,60,200,.08); }
  .card-wrap::before { content:"";position:absolute;top:0;left:0;right:0;height:5px;border-radius:18px 18px 0 0;background:linear-gradient(90deg,var(--accent1),var(--accent2)); }
  .g-icon { width:72px;height:72px;border-radius:50%;background:#fff;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;margin:0 auto 22px;font-size:30px;box-shadow:0 6px 20px rgba(80,60,200,.08); }
  h1 { font-size:27px;font-weight:700;margin:0 0 10px;text-align:center; } p.lead { color:var(--muted);font-size:15px;line-height:1.6;margin:0 0 28px;text-align:center; }
  label { display:block;font-size:13.5px;font-weight:600;margin-bottom:8px; } .input-wrap { display:flex;align-items:center;gap:10px;border:1px solid var(--line);border-radius:10px;padding:4px 14px;margin-bottom:18px;background:#faf9ff;transition:border-color .2s ease,box-shadow .2s ease; }
  .input-wrap:focus-within { border-color:var(--accent1);box-shadow:0 0 0 3px rgba(109,94,248,.1); } .input-wrap input { flex:1;border:none;background:transparent;padding:11px 0;font-size:14px;outline:none; }
  .submit-btn { display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:15px 20px;background:linear-gradient(90deg,var(--accent1),var(--accent2));color:#fff;border:none;border-radius:10px;font-size:15.5px;font-weight:600;cursor:pointer;box-shadow:0 8px 20px rgba(109,94,248,.3);transition:transform .2s ease,box-shadow .2s ease,filter .2s ease; }
  .submit-btn:hover:not(:disabled) { transform:translateY(-2px);filter:brightness(1.05);box-shadow:0 12px 25px rgba(109,94,248,.35); } .submit-btn:active:not(:disabled) { transform:translateY(0); } .submit-btn:disabled { background:#b7b3e8;box-shadow:none;cursor:not-allowed; }
  .status { margin-top:16px;font-size:14px;border-radius:10px;padding:12px 14px;display:none; } .status.error { display:block;color:var(--red);background:var(--red-bg); }
  .brand-footer { max-width:520px;margin:24px auto 0;display:flex;justify-content:space-between;align-items:center;gap:15px;font-size:12.5px;color:var(--muted);position:relative;z-index:1; } .brand-footer b { color:var(--accent-text); }
  .privacy-btn { display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border-radius:999px;background:#fff;color:var(--accent-text);border:1px solid #cfc9ff;text-decoration:none;font-size:12.5px;font-weight:700;box-shadow:0 4px 14px rgba(109,94,248,.12);transition:all .18s ease; } .privacy-btn:hover { background:#f5f3ff;border-color:var(--accent1);transform:translateY(-1px);box-shadow:0 6px 18px rgba(109,94,248,.18); }
  @media (max-width:650px) { .es-page{padding:18px}.topbar{margin-bottom:24px}.card-wrap{padding:36px 24px}.brand-text{display:none}.brand-footer{flex-direction:column;text-align:center}.brand-footer span:last-child{justify-content:center;} }
`;

export default function Login() {
  const statusRef = useRef(null); const btnRef = useRef(null);
  useEffect(() => { (async()=>{ try { const r=await fetch('/api/me',{credentials:'same-origin'}); const d=await r.json(); if(d.loggedIn) window.location.href=d.hasSheet?'/campaign':'/connected'; } catch(e){} })(); }, []);
  async function handleLogin(e) {
    e.preventDefault(); const email=e.target.loginEmail.value.trim(); const password=e.target.loginPassword.value; const btn=btnRef.current; const status=statusRef.current;
    status.textContent=''; status.className='status'; btn.disabled=true; btn.textContent='Logging in...';
    try { const r=await fetch('/api/login',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})}); const d=await r.json(); if(!r.ok) throw new Error(d.error||'Login failed'); window.location.href=d.hasSheet?'/campaign':'/connected'; }
    catch(err){ status.textContent=err.message; status.className='status error'; btn.disabled=false; btn.textContent='🔑 Log in'; }
  }
  return <><Head><title>Log in — Email Sender</title></Head><style dangerouslySetInnerHTML={{__html:PAGE_CSS}}/><div className="es-page"><div className="bg-blob left"/><div className="bg-blob right"/>
    <div className="topbar"><div className="brand"><img src="/assets/logo.png" alt="Email Sender"/><div className="brand-text"><h2>Email Sender</h2><p>Smart Email Automation</p></div></div><a href="/" className="back-btn">← Back to sign up</a></div>
    <div className="card-wrap"><div className="g-icon">🔑</div><h1>Welcome back</h1><p className="lead">Log in with your email and password to continue to your campaigns.</p>
      <form onSubmit={handleLogin}><label htmlFor="loginEmail">Email</label><div className="input-wrap"><input type="email" id="loginEmail" name="loginEmail" placeholder="you@gmail.com" autoComplete="email" required/></div><label htmlFor="loginPassword">Password</label><div className="input-wrap"><input type="password" id="loginPassword" name="loginPassword" placeholder="Your password" autoComplete="current-password" required/></div><button type="submit" ref={btnRef} className="submit-btn">🔑 Log in</button></form>
      <div ref={statusRef} className="status"/>
    </div>
    <div className="brand-footer"><span>Your data is secure and encrypted.</span><span style={{display:'flex',alignItems:'center',gap:12}}><a href="/privacy-policy" className="privacy-btn">🔒 Privacy Policy</a><span>Powered by <b>VisionFlow</b></span></span></div>
  </div></>;
}
