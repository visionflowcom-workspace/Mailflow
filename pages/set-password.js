import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const PAGE_CSS = `
  :root { --ink:#1e1b3a; --muted:#6b7280; --bg:#f2f1fb; --line:#e6e4f7; --accent1:#6d5ef8; --accent2:#8b5cf6; --accent-text:#4c3fd7; --green:#16a34a; --green-bg:#ecfdf3; --red:#b3261e; --red-bg:#fbeaea; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--ink); }
  .es-page { min-height: 100vh; padding: 28px; }
  .topbar { display: flex; align-items: center; justify-content: space-between; max-width: 640px; margin: 0 auto 32px; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand img { height: 44px; }
  .brand-text h2 { margin: 0; font-size: 18px; font-weight: 700; }
  .brand-text p { margin: 0; font-size: 12.5px; color: var(--muted); }
  .card-wrap { max-width: 640px; margin: 0 auto; background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 48px 44px; box-shadow: 0 12px 40px rgba(80,60,200,0.08); position: relative; }
  .card-wrap::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; border-radius: 18px 18px 0 0; background: linear-gradient(90deg, var(--accent1), var(--accent2)); }
  .g-icon { width: 56px; height: 56px; border-radius: 14px; background: #fdf3d9; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; font-size: 24px; }
  h1 { font-size: 24px; font-weight: 700; margin: 0 0 10px; }
  p.lead { color: var(--muted); font-size: 15px; line-height: 1.6; margin: 0 0 28px; }
  label { display: block; font-size: 13.5px; font-weight: 600; margin-bottom: 8px; }
  .input-wrap { display: flex; align-items: center; gap: 10px; border: 1px solid var(--line); border-radius: 10px; padding: 4px 4px 4px 14px; margin-bottom: 20px; background: #faf9ff; }
  .input-wrap .ic { width: 30px; height: 30px; border-radius: 8px; background: #fdf3d9; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  input[type="password"] { flex: 1; border: none; background: transparent; padding: 11px 4px; font-size: 14px; outline: none; }
  .submit-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 15px 20px; background: linear-gradient(90deg, var(--accent1), var(--accent2)); color: #fff; border: none; border-radius: 10px; font-size: 15.5px; font-weight: 600; cursor: pointer; box-shadow: 0 8px 20px rgba(109,94,248,0.3); }
  .submit-btn:disabled { background: #b7b3e8; box-shadow: none; cursor: not-allowed; }
  .status { margin-top: 16px; font-size: 14px; border-radius: 10px; padding: 12px 14px; display: none; }
  .status.success { display: block; color: var(--green); background: var(--green-bg); }
  .status.error { display: block; color: var(--red); background: var(--red-bg); }
  .skip-link { display: block; text-align: center; margin-top: 18px; font-size: 13px; color: var(--muted); text-decoration: none; }
  .brand-footer { max-width: 640px; margin: 24px auto 0; display: flex; justify-content: space-between; font-size: 12.5px; color: var(--muted); }
  .brand-footer b { color: var(--accent-text); }
  .privacy-btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 999px; background: #fff; color: var(--accent-text); border: 1px solid #cfc9ff; text-decoration: none; font-size: 12.5px; font-weight: 700; box-shadow: 0 4px 14px rgba(109,94,248,0.12); transition: all .18s ease; }
  .privacy-btn:hover { background: #f5f3ff; border-color: var(--accent1); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(109,94,248,0.18); }

`;

export default function SetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [isNewSignup, setIsNewSignup] = useState(false);
  const [title, setTitle] = useState('Set a password');
  const [lead, setLead] = useState("You're connected! Add a password now so next time you can log in with your email instead of going through Google every time.");
  const [showCurrent, setShowCurrent] = useState(false);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ text: '', type: '' });

  const currentPasswordRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!router.isReady) return;
    let currentEmail = router.query.email || null;
    const newFlag = router.query.new === '1';
    const fromProfile = router.query.from === 'profile';
    setIsNewSignup(newFlag);
    if (!newFlag) setLead('Update the password you use to log in without Google.');

    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'same-origin' });
        const data = await res.json();
        if (data.loggedIn) {
          currentEmail = data.email;

          // Once a password has been set, password changes should only be
          // opened from the Profile page. Do not show the change-password
          // screen just because the user is logged in or visits this URL.
          if (data.hasPassword && !fromProfile && !newFlag) {
            window.location.href = data.hasSheet ? '/campaign' : '/connected';
            return;
          }

          if (data.hasPassword) {
            setTitle('Change your password');
            setShowCurrent(true);
          }
        } else if (!currentEmail) {
          setStatus({ text: 'Missing account info — please start over from the connect page.', type: 'error' });
        }
      } catch (err) {
        // form still works if ?email= is present and a session cookie exists
      } finally {
        setEmail(currentEmail);
        setReady(true);
      }
    })();
  }, [router.isReady, router.query.email, router.query.new, router.query.from]);

  function goToSheet() {
    window.location.href = '/connected';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const currentPassword = currentPasswordRef.current?.value || '';
    const password = passwordRef.current.value;
    const confirmPassword = confirmRef.current.value;
    setStatus({ text: '', type: '' });

    if (password !== confirmPassword) {
      setStatus({ text: "Passwords don't match.", type: 'error' });
      return;
    }
    if (password.length < 8) {
      setStatus({ text: 'Password must be at least 8 characters.', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/set-password', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setStatus({ text: 'Password saved!', type: 'success' });

      if (isNewSignup) {
        setTimeout(goToSheet, 900);
      } else {
        setSaving(false);
        formRef.current.reset();
      }
    } catch (err) {
      setStatus({ text: err.message, type: 'error' });
      setSaving(false);
    }
  }

  if (!ready) return null;

  return (
    <>
      <Head><title>Set your password</title></Head>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <div className="es-page">
        <div className="topbar">
          <div className="brand">
            <img src="/assets/logo.png" alt="Email Sender" />
            <div className="brand-text"><h2>Email Sender</h2><p>Smart Email Automation</p></div>
          </div>
        </div>

        <div className="card-wrap">
          <div className="g-icon">🔑</div>
          <h1>{title}</h1>
          <p className="lead">{lead}</p>

          <form ref={formRef} onSubmit={handleSubmit}>
            {showCurrent && (
              <div>
                <label htmlFor="currentPassword">Current password</label>
                <div className="input-wrap">
                  <span className="ic">🔒</span>
                  <input type="password" id="currentPassword" ref={currentPasswordRef} placeholder="Your current password" required={showCurrent} />
                </div>
              </div>
            )}

            <label htmlFor="password">New password</label>
            <div className="input-wrap">
              <span className="ic">🔒</span>
              <input type="password" id="password" ref={passwordRef} placeholder="At least 8 characters" minLength={8} required />
            </div>

            <label htmlFor="confirmPassword">Confirm password</label>
            <div className="input-wrap">
              <span className="ic">🔒</span>
              <input type="password" id="confirmPassword" ref={confirmRef} placeholder="Re-enter password" minLength={8} required />
            </div>

            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? 'Saving...' : (showCurrent ? '🔑 Update password' : '🔑 Save password')}
            </button>
          </form>

          {status.text && <div className={`status ${status.type}`}>{status.text}</div>}

          {isNewSignup && (
            <a href="#" onClick={(e) => { e.preventDefault(); goToSheet(); }} className="skip-link button-link">Skip for now →</a>
          )}
        </div>

        <div className="brand-footer">
          <span>Your data is secure and encrypted. We never store your credentials.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/privacy-policy" className="privacy-btn">🔒 Privacy Policy</a>
            <span>Powered by <b>VisionFlow</b></span>
          </span>
        </div>
      </div>
    </>
  );
}
