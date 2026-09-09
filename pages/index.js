import { useEffect } from 'react';
import Head from 'next/head';

const PAGE_CSS = `
  :root {
    --ink: #1e1b3a; --muted: #6b7280; --bg: #f2f1fb; --line: #e6e4f7;
    --accent1: #6d5ef8; --accent2: #8b5cf6; --accent-text: #4c3fd7;
    --green: #16a34a; --green-bg: #ecfdf3;
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--ink); }
  .es-page { min-height: 100vh; padding: 28px; position: relative; overflow-x: hidden; }
  .bg-blob { position: fixed; border-radius: 50%; background: radial-gradient(circle, rgba(109,94,248,0.12), transparent 70%); z-index: 0; }
  .bg-blob.left { width: 420px; height: 420px; top: 20%; left: -180px; }
  .bg-blob.right { width: 420px; height: 420px; bottom: 10%; right: -180px; }
  .topbar { display: flex; align-items: center; justify-content: space-between; max-width: 900px; margin: 0 auto 32px; position: relative; z-index: 1; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand img { height: 44px; }
  .brand-text h2 { margin: 0; font-size: 18px; font-weight: 700; }
  .brand-text p { margin: 0; font-size: 12.5px; color: var(--muted); }
  .trust-badge { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 8px 16px; font-size: 12.5px; box-shadow: 0 2px 10px rgba(80,60,200,0.05); }
  .trust-badge .dot { width: 26px; height: 26px; background: var(--green-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--green); font-size: 14px; }
  .trust-badge strong { display: block; color: var(--green); }
  .trust-badge span { color: var(--muted); }
  .card-wrap { max-width: 640px; margin: 0 auto; background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 48px 44px; position: relative; z-index: 1; box-shadow: 0 12px 40px rgba(80,60,200,0.08); }
  .card-wrap::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; border-radius: 18px 18px 0 0; background: linear-gradient(90deg, var(--accent1), var(--accent2)); }
  .g-icon { width: 84px; height: 84px; border-radius: 50%; background: #fff; border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 34px; box-shadow: 0 6px 20px rgba(80,60,200,0.08); }
  .g-icon img { width: 50px; height: 50px; }
  h1 { font-size: 27px; font-weight: 700; margin: 0 0 12px; text-align: center; letter-spacing: -0.01em; }
  p.lead { color: var(--muted); font-size: 15px; line-height: 1.6; margin: 0 0 8px; text-align: center; }
  p.lead .safe-line { display: block; color: var(--accent-text); font-weight: 600; margin-top: 6px; }
  .scope-list { margin: 32px 0 24px; display: flex; flex-direction: column; gap: 12px; }
  .scope-item { display: flex; align-items: center; gap: 14px; background: #faf9ff; border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; }
  .scope-item .ic { width: 38px; height: 38px; border-radius: 10px; background: #eeecfd; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
  .scope-item .txt strong { display: block; font-size: 14.5px; }
  .scope-item .txt span { font-size: 12.5px; color: var(--muted); }
  .scope-item .check { margin-left: auto; width: 26px; height: 26px; border-radius: 50%; background: var(--green-bg); color: var(--green); display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
  .connect-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 15px 20px; background: linear-gradient(90deg, var(--accent1), var(--accent2)); color: #fff; border: none; border-radius: 10px; font-size: 15.5px; font-weight: 600; cursor: pointer; text-align: center; text-decoration: none; box-shadow: 0 8px 20px rgba(109,94,248,0.3); }
  .connect-btn:hover { filter: brightness(1.05); }
  .status { margin-top: 16px; font-size: 14px; border-radius: 10px; padding: 12px 14px; display: none; }
  .status.success { display: block; color: var(--green); background: var(--green-bg); }
  .status.error { display: block; color: #b3261e; background: #fbeaea; }
  .footnote { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--muted); margin-top: 18px; line-height: 1.5; background: #faf9ff; border-radius: 10px; padding: 12px 14px; }
  .trust-row { display: flex; justify-content: space-between; gap: 16px; margin-top: 28px; padding-top: 24px; border-top: 1px solid var(--line); }
  .trust-row div { text-align: center; flex: 1; font-size: 12px; color: var(--muted); }
  .trust-row strong { display: block; font-size: 13px; color: var(--ink); margin-bottom: 2px; }
  .brand-footer { max-width: 900px; margin: 24px auto 0; display: flex; justify-content: space-between; font-size: 12.5px; color: var(--muted); position: relative; z-index: 1; }
  .brand-footer b { color: var(--accent-text); }
  .privacy-btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 999px; background: #fff; color: var(--accent-text); border: 1px solid #cfc9ff; text-decoration: none; font-size: 12.5px; font-weight: 700; box-shadow: 0 4px 14px rgba(109,94,248,0.12); transition: all .18s ease; }
  .privacy-btn:hover { background: #f5f3ff; border-color: var(--accent1); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(109,94,248,0.18); }

  .login-top-btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 10px 16px; border-radius: 10px; background: #fff; color: var(--accent-text); border: 1px solid #cfc9ff; text-decoration: none; font-size: 13px; font-weight: 700; box-shadow: 0 4px 14px rgba(109,94,248,0.12); transition: transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease; }
  .login-top-btn:hover { background: #f5f3ff; border-color: var(--accent1); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(109,94,248,0.2); }
  .login-top-btn:active { transform: translateY(0); }

  .input-wrap { display: flex; align-items: center; gap: 10px; border: 1px solid var(--line); border-radius: 10px; padding: 4px 4px 4px 14px; margin-bottom: 16px; background: #faf9ff; }
  .input-wrap input { flex: 1; border: none; background: transparent; padding: 11px 4px; font-size: 14px; outline: none; }
`;

// Set this to true once Microsoft/Outlook OAuth (Azure app registration) is set up in .env.local
const OUTLOOK_ENABLED = false;

export default function Home() {

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'same-origin' });
        const data = await res.json();
        if (data.loggedIn && data.hasSheet) {
          window.location.href = '/campaign';
        } else if (data.loggedIn && !data.hasSheet) {
          window.location.href = '/connected';
        }
      } catch (err) {
        // If this check fails (e.g. offline), just show the normal connect screen
      }
    })();
  }, []);


  return (
    <>
      <Head><title>Connect your account</title></Head>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <div className="es-page">
        <div className="bg-blob left"></div>
        <div className="bg-blob right"></div>

        <div className="topbar">
          <div className="brand">
            <img src="/assets/logo.png" alt="Email Sender" />
            <div className="brand-text">
              <h2>Email Sender</h2>
              <p>Smart Email Automation</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/login" className="login-top-btn">🔑 Log in</a>
            <div className="trust-badge">
              <span className="dot">🛡️</span>
              <div>
                <strong>Secure &amp; Private</strong>
                <span>Your data is always safe</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-wrap">
          <div className="g-icon"> <img src="/assets/google_icon.png" alt="Google" /> </div>
          <h1>Sign up — Connect your Google account</h1>
          <p className="lead">
            This lets us send emails and read/write your spreadsheet on your behalf, through your own account.
            <span className="safe-line">We never see or store your password. 🛡️</span>
          </p>

          <div className="scope-list">
            <div className="scope-item">
              <span className="ic">✈️</span>
              <div className="txt">
                <strong>Send email as you</strong>
                <span>We'll send emails using your Gmail account.</span>
              </div>
              <span className="check">✓</span>
            </div>
            <div className="scope-item">
              <span className="ic">📊</span>
              <div className="txt">
                <strong>Read and update your Google Sheets</strong>
                <span>We'll read and update your spreadsheets securely.</span>
              </div>
              <span className="check">✓</span>
            </div>
          </div>

          <a href="/api/auth/google" className="connect-btn">Connect Gmail &amp; Google Sheets →</a>

          {OUTLOOK_ENABLED && (
            <a href="/api/auth/microsoft" className="connect-btn" style={{ background: 'linear-gradient(90deg,#0072c6,#00a4ef)', marginTop: 12 }}>
              🟦 Connect Outlook →
            </a>
          )}

          <p className="footnote">🔒 You'll be taken to Google's secure sign-in page. You can revoke this access at any time from your Google Account settings.</p>

          <div className="trust-row">
            <div><strong>100% Secure</strong>OAuth 2.0 Encryption</div>
            <div><strong>You're in Control</strong>Revoke anytime</div>
            <div><strong>No Password Access</strong>We never see it</div>
          </div>
        </div>


        <div className="brand-footer">
          <span>Trusted by professionals for safe and reliable email automation.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/privacy-policy" className="privacy-btn">🔒 Privacy Policy</a>
            <span>Powered by <b>VisionFlow</b> ✔️</span>
          </span>
        </div>
      </div>
    </>
  );
}
