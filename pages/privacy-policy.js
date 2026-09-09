import Head from 'next/head';

const PAGE_CSS = `
  :root {
    --ink:#1e1b3a;
    --muted:#6b7280;
    --bg:#f2f1fb;
    --line:#e6e4f7;
    --accent1:#6d5ef8;
    --accent2:#8b5cf6;
    --accent-text:#4c3fd7;
  }

  * {
    box-sizing:border-box;
  }

  body {
    margin:0;
    font-family:'Segoe UI',system-ui,-apple-system,sans-serif;
    background:var(--bg);
    color:var(--ink);
  }

  .page {
    min-height:100vh;
    padding:28px;
  }

  .topbar {
    max-width:900px;
    margin:0 auto 28px;
    display:flex;
    align-items:center;
    justify-content:space-between;
  }

  .brand {
    display:flex;
    align-items:center;
    gap:12px;
  }

  .brand img {
    height:44px;
  }

  .brand h2 {
    margin:0;
    font-size:18px;
  }

  .brand p {
    margin:0;
    font-size:12.5px;
    color:var(--muted);
  }

  .back {
    color:var(--accent-text);
    text-decoration:none;
    font-size:13px;
    font-weight:700;
  }

  .card {
    max-width:760px;
    margin:0 auto;
    background:#fff;
    border:1px solid var(--line);
    border-radius:18px;
    padding:40px 44px;
    box-shadow:0 12px 40px rgba(80,60,200,.08);
  }

  .badge {
    display:inline-flex;
    align-items:center;
    gap:8px;
    padding:8px 13px;
    border-radius:999px;
    background:#f3f1ff;
    color:var(--accent-text);
    font-size:12.5px;
    font-weight:700;
    margin-bottom:14px;
  }

  h1 {
    margin:0 0 10px;
    font-size:28px;
  }

  .updated {
    color:var(--muted);
    font-size:13px;
    margin-bottom:28px;
  }

  h2 {
    font-size:16px;
    margin:26px 0 8px;
  }

  p, li {
    color:#4b5563;
    font-size:14px;
    line-height:1.7;
  }

  ul {
    padding-left:22px;
  }

  .contact-info {
    margin-top:14px;
    padding:16px 18px;
    background:#f8f7ff;
    border:1px solid var(--line);
    border-radius:12px;
  }

  .contact-info p {
    margin:6px 0;
  }

  .contact-info strong {
    color:var(--ink);
  }

  .contact-info a {
    color:var(--accent-text);
    text-decoration:none;
    font-weight:600;
  }

  .contact-info a:hover {
    text-decoration:underline;
  }

  .footer {
    max-width:760px;
    margin:18px auto 0;
    text-align:center;
    color:var(--muted);
    font-size:12px;
  }
`;

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Email Sender</title>
      </Head>

      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      <div className="page">

        <div className="topbar">
          <div className="brand">
            <img src="/assets/logo.png" alt="Email Sender" />

            <div>
              <h2>Email Sender</h2>
              <p>Smart Email Automation</p>
            </div>
          </div>

          <a href="/" className="back">
            ← Back
          </a>
        </div>

        <main className="card">

          <div className="badge">
            🔒 Privacy &amp; Security
          </div>

          <h1>Privacy Policy</h1>

          <div className="updated">
            How Email Sender handles your account and connected services.
          </div>


          <h2>Information we use</h2>

          <p>
            When you connect an account, Email Sender may use your email
            address, connected Google account information, spreadsheet
            information, campaign usage information, and account settings
            needed to provide the service.
          </p>


          <h2>Google account access</h2>

          <p>
            Email Sender requests access needed to send email through your
            Gmail account and read or update the Google Sheets you choose to
            use. Authentication is handled through Google's OAuth
            authorization flow. We do not receive or store your Google
            password.
          </p>


          <h2>Account password</h2>

          <p>
            If you create an Email Sender password, the application stores a
            password hash rather than your plain-text password.
          </p>


          <h2>How information is used</h2>

          <ul>
            <li>To authenticate you and maintain your session.</li>
            <li>
              To send emails and process the contact list or spreadsheet you
              select.
            </li>
            <li>
              To maintain your plan, usage limits, and account settings.
            </li>
            <li>
              To provide account management and support features.
            </li>
          </ul>


          <h2>Third-party services</h2>

          <p>
            When you connect Google services, requests are made to Google APIs
            according to the permissions you authorize. You can review or
            revoke access from your Google Account settings.
          </p>


          <h2>Data deletion</h2>

          <p>
            You can use the account disconnect and delete option in your
            profile to remove the stored account data maintained by this
            application.
          </p>


          <h2>Contact</h2>

          <p>
            If you have questions about this Privacy Policy or how your data
            is handled, please contact the service administrator.
          </p>

          <div className="contact-info">

            <p>
              <strong>Company:</strong> VisionFlow
            </p>

            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:visionflow.com@gmail.com">
                visionflow.com@gmail.com
              </a>
            </p>

          </div>

        </main>

        <div className="footer">
          © {new Date().getFullYear()} VisionFlow · Email Sender
        </div>

      </div>
    </>
  );
}