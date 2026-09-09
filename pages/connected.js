import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
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
  .badge { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--green); background: var(--green-bg); padding: 6px 14px; border-radius: 999px; margin-bottom: 20px; }
  .g-icon { width: 56px; height: 56px; border-radius: 14px; background: #e8f5ec; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; font-size: 24px; }
  h1 { font-size: 24px; font-weight: 700; margin: 0 0 10px; }
  p.lead { color: var(--muted); font-size: 15px; line-height: 1.6; margin: 0 0 24px; }
  label { display: block; font-size: 13.5px; font-weight: 600; margin-bottom: 8px; }
  .input-wrap { display: flex; align-items: center; gap: 10px; border: 1px solid var(--line); border-radius: 10px; padding: 4px 4px 4px 14px; margin-bottom: 20px; background: #faf9ff; }
  .input-wrap .ic { width: 30px; height: 30px; border-radius: 8px; background: #eeecfd; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  input[type="url"] { flex: 1; border: none; background: transparent; padding: 11px 4px; font-size: 14px; outline: none; }
  .help-box { display: flex; gap: 14px; background: #eef2ff; border-radius: 12px; padding: 16px; margin-bottom: 24px; }
  .help-box .ic { width: 32px; height: 32px; border-radius: 50%; background: var(--accent1); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
  .help-box strong { display: block; font-size: 14px; margin-bottom: 3px; }
  .help-box span { font-size: 13px; color: var(--muted); line-height: 1.5; }
  .submit-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 15px 20px; background: linear-gradient(90deg, var(--accent1), var(--accent2)); color: #fff; border: none; border-radius: 10px; font-size: 15.5px; font-weight: 600; cursor: pointer; box-shadow: 0 8px 20px rgba(109,94,248,0.3); }
  .submit-btn:hover { filter: brightness(1.05); }
  .submit-btn:disabled { background: #b7b3e8; box-shadow: none; cursor: not-allowed; filter: none; }
  .status { margin-top: 16px; font-size: 14px; border-radius: 10px; padding: 12px 14px; display: none; }
  .status.success { display: block; color: var(--green); background: var(--green-bg); }
  .status.error { display: block; color: #b3261e; background: #fbeaea; }
  .brand-footer { max-width: 900px; margin: 24px auto 0; display: flex; justify-content: space-between; font-size: 12.5px; color: var(--muted); position: relative; z-index: 1; }
  .brand-footer b { color: var(--accent-text); }
  .privacy-btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 999px; background: #fff; color: var(--accent-text); border: 1px solid #cfc9ff; text-decoration: none; font-size: 12.5px; font-weight: 700; box-shadow: 0 4px 14px rgba(109,94,248,0.12); transition: all .18s ease; }
  .privacy-btn:hover { background: #f5f3ff; border-color: var(--accent1); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(109,94,248,0.18); }

  .source-tabs { display: flex; gap: 8px; margin-bottom: 24px; }
  .source-tab { flex: 1; padding: 12px; border-radius: 10px; border: 1px solid var(--line); background: #faf9ff; color: var(--ink); font-size: 13.5px; font-weight: 600; cursor: pointer; text-align: center; }
  .source-tab.active { background: linear-gradient(90deg, var(--accent1), var(--accent2)); color: #fff; border: none; }
  .dropzone-simple { border: 2px dashed #c7c2f0; border-radius: 14px; background: #fafaff; padding: 28px 20px; text-align: center; cursor: pointer; margin-bottom: 20px; }
  .dropzone-simple:hover { background: #f0eefe; }
  .dropzone-simple .dz-icon { font-size: 30px; margin-bottom: 8px; }
  .dropzone-simple .dz-main { font-size: 14.5px; font-weight: 600; color: var(--ink); }
  .dropzone-simple .dz-sub { font-size: 12.5px; color: var(--muted); margin-top: 4px; }
  .file-chosen { display: flex; align-items: center; gap: 12px; background: #faf9ff; border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; margin-bottom: 20px; }
  .file-chosen .fc-icon { font-size: 20px; }
  .file-chosen .fc-name { font-weight: 600; font-size: 14px; }
  .file-chosen .fc-sub { font-size: 12px; color: var(--muted); }
`;

export default function Connected() {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [tab, setTab] = useState('sheet'); // 'sheet' | 'upload'
  const [provider, setProvider] = useState('google');
  const [showBackLink, setShowBackLink] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ text: '', type: '' });
  const [ready, setReady] = useState(false);
  const [chosenFile, setChosenFile] = useState(null); // { name, sizeLabel, base64 }
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!router.isReady) return;
    let currentEmail = router.query.email || null;

    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'same-origin' });
        const data = await res.json();
        if (data.loggedIn) {
          currentEmail = data.email;
          setProvider(data.provider || 'google');
          if (data.provider === 'microsoft') setTab('upload');
          if (data.hasSheet) {
            setShowBackLink(true);
            if (data.contactSource === 'upload') {
              setTab('upload');
            } else {
              setSheetUrl(data.sheetUrl || '');
            }
          }
        } else if (!currentEmail) {
          setStatus({ text: 'Missing account info — please start over from the connect page.', type: 'error' });
        }
      } catch (err) {
        // form still works if a session cookie exists
      } finally {
        setEmail(currentEmail);
        setReady(true);
      }
    })();
  }, [router.isReady, router.query.email]);

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function handleFilePicked(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setChosenFile({
        name: file.name,
        sizeLabel: formatBytes(file.size),
        base64: reader.result.split(',')[1],
      });
    };
    reader.readAsDataURL(file);
  }

  async function handleSheetSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus({ text: '', type: '' });

    try {
      const res = await fetch('/api/save-sheet', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sheetUrl: sheetUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setStatus({ text: "You're all set! Taking you to compose your email...", type: 'success' });
      setTimeout(() => { window.location.href = '/campaign'; }, 1200);
    } catch (err) {
      setStatus({ text: err.message, type: 'error' });
      setSaving(false);
    }
  }

  async function handleUploadSubmit(e) {
    e.preventDefault();
    if (!chosenFile) {
      setStatus({ text: 'Please choose a file first.', type: 'error' });
      return;
    }
    setSaving(true);
    setStatus({ text: '', type: '' });

    try {
      const res = await fetch('/api/upload-contacts', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, filename: chosenFile.name, dataBase64: chosenFile.base64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setStatus({ text: `You're all set! Found ${data.rowCount} contacts. Taking you to compose your email...`, type: 'success' });
      setTimeout(() => { window.location.href = '/campaign'; }, 1200);
    } catch (err) {
      setStatus({ text: err.message, type: 'error' });
      setSaving(false);
    }
  }

  async function handleSwitchAccount(e) {
    e.preventDefault();
    await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
    window.location.href = '/';
  }

  if (!ready) return null;

  return (
    <>
      <Head><title>Add your contact list</title></Head>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.location.href = '/profile'; }}
              style={{ fontSize: 13, color: '#4c3fd7', fontWeight: 600, textDecoration: 'none' }}
            >👤 Profile</a>
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
          <span className="badge">✓ {provider === 'microsoft' ? 'Outlook' : 'Gmail'} connected</span>
          <div className="g-icon">📇</div>
          <h1>Add your contact list</h1>
          <p className="lead">Choose where your recipients come from. Either works the same way — just needs a column named <b>email</b>.</p>

          <div className="source-tabs">
            {provider !== 'microsoft' && (
              <button type="button" className={`source-tab ${tab === 'sheet' ? 'active' : ''}`} onClick={() => setTab('sheet')}>📊 Google Sheet</button>
            )}
            <button type="button" className={`source-tab ${tab === 'upload' ? 'active' : ''}`} onClick={() => setTab('upload')}>📁 Upload File</button>
          </div>
          {provider === 'microsoft' && (
            <p style={{ fontSize: 12.5, color: '#888', marginTop: -12, marginBottom: 20 }}>Outlook accounts use an uploaded file for contacts — Google Sheets isn't available.</p>
          )}

          {tab === 'sheet' && (
            <form onSubmit={handleSheetSubmit}>
              <label htmlFor="sheetUrl">Google Sheet URL</label>
              <div className="input-wrap">
                <span className="ic">🔗</span>
                <input
                  type="url"
                  id="sheetUrl"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  required
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                />
              </div>

              <div className="help-box">
                <span className="ic">i</span>
                <div>
                  <strong>Need help?</strong>
                  <span>Make sure your Google Sheet is shared with Edit access for the connected Google account.</span>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={saving}>
                {saving ? 'Saving...' : '✓ Finish setup →'}
              </button>
            </form>
          )}

          {tab === 'upload' && (
            <form onSubmit={handleUploadSubmit}>
              {!chosenFile ? (
                <div className="dropzone-simple" onClick={() => fileInputRef.current.click()}>
                  <div className="dz-icon">☁️</div>
                  <div className="dz-main">Click to choose a file</div>
                  <div className="dz-sub">.csv, .xlsx, or .xls — must have an "email" column</div>
                </div>
              ) : (
                <div className="file-chosen">
                  <span className="fc-icon">📄</span>
                  <div style={{ flex: 1 }}>
                    <div className="fc-name">{chosenFile.name}</div>
                    <div className="fc-sub">{chosenFile.sizeLabel} — click to change</div>
                  </div>
                  <button type="button" onClick={() => fileInputRef.current.click()} style={{ background: 'none', border: 'none', color: '#6d5ef8', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Change</button>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,.xlsx,.xls"
                style={{ display: 'none' }}
                onChange={(e) => handleFilePicked(e.target.files[0])}
              />

              <div className="help-box">
                <span className="ic">i</span>
                <div>
                  <strong>Need help?</strong>
                  <span>The first row of your file should be column headers, with one column literally named "email".</span>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={saving}>
                {saving ? 'Uploading...' : '✓ Finish setup →'}
              </button>
            </form>
          )}

          {status.text && <div className={`status ${status.type}`}>{status.text}</div>}

          {showBackLink && (
            <p style={{ textAlign: 'center', marginTop: 16 }}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.location.href = '/campaign'; }}
                style={{ fontSize: 12.5, color: '#6d5ef8', fontWeight: 600 }}
              >← Back to campaign without changing</a>
            </p>
          )}
          <p style={{ textAlign: 'center', marginTop: 10 }}>
            <a href="#" onClick={handleSwitchAccount} className="button-link" style={{ marginTop: 0, color: '#6b7280' }}>Not you? Use a different account</a>
          </p>
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
