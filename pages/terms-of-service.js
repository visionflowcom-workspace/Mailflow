import Head from 'next/head';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service | MailFlow</title>
        <meta name="description" content="Terms of Service for MailFlow by VisionFlow." />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="terms-page">
        <div className="terms-container">
          <header className="terms-hero">
            <div className="brand-badge">MailFlow</div>
            <h1>Terms of Service</h1>
            <p>
              These terms explain the rules and conditions for using MailFlow,
              a service provided by VisionFlow.
            </p>
            <div className="updated">Last updated: September 10, 2026</div>
          </header>

          <section className="terms-card">
            <div className="section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using MailFlow, you agree to be bound by these
                Terms of Service. If you do not agree with these terms, please
                do not use the service.
              </p>
            </div>

            <div className="section">
              <h2>2. Description of the Service</h2>
              <p>
                MailFlow is an email campaign and sending platform provided by
                VisionFlow. The service may allow users to connect supported
                email accounts, create email campaigns, manage recipients,
                and send emails through connected services.
              </p>
            </div>

            <div className="section">
              <h2>3. User Responsibilities</h2>
              <p>When using MailFlow, you agree that you will:</p>
              <ul>
                <li>Provide accurate account information.</li>
                <li>Keep your login credentials secure.</li>
                <li>Use the service only for lawful purposes.</li>
                <li>Only send emails to recipients where you have a lawful basis or appropriate permission to contact them.</li>
                <li>Comply with applicable anti-spam, privacy, data-protection, and electronic communications laws.</li>
                <li>Not use MailFlow to send fraudulent, deceptive, abusive, threatening, or harmful content.</li>
              </ul>
            </div>

            <div className="section">
              <h2>4. Prohibited Use</h2>
              <p>
                You may not use MailFlow to distribute malware, phishing
                messages, scams, illegal content, unsolicited bulk messages,
                impersonation attempts, or content that violates the rights
                of others.
              </p>
              <p>
                VisionFlow may restrict, suspend, or terminate access when it
                reasonably believes the service is being misused or these
                terms are being violated.
              </p>
            </div>

            <div className="section">
              <h2>5. Email Accounts and Third-Party Services</h2>
              <p>
                MailFlow may integrate with third-party services such as
                Google or other supported email providers. Your use of those
                services is also subject to the applicable third-party terms
                and policies.
              </p>
              <p>
                You are responsible for ensuring that your connected email
                account is authorized for the actions you perform through
                MailFlow.
              </p>
            </div>

            <div className="section">
              <h2>6. Credits, Plans, and Payments</h2>
              <p>
                Certain MailFlow features may require a paid plan or sending
                credits. Plan limits, available features, and credit amounts
                may vary according to the plan selected.
              </p>
              <p>
                Payments and upgrades are subject to the applicable payment
                terms shown during the purchase or upgrade process.
              </p>
            </div>

            <div className="section">
              <h2>7. Account Security</h2>
              <p>
                You are responsible for maintaining the security of your
                MailFlow account and for activity performed through your
                account. If you believe your account has been accessed without
                authorization, you should contact VisionFlow promptly.
              </p>
            </div>

            <div className="section">
              <h2>8. Service Availability</h2>
              <p>
                We aim to keep MailFlow available and reliable, but we do not
                guarantee uninterrupted or error-free operation. The service
                may occasionally be unavailable because of maintenance,
                updates, technical issues, or problems involving third-party
                providers.
              </p>
            </div>

            <div className="section">
              <h2>9. Intellectual Property</h2>
              <p>
                MailFlow, its software, design, branding, and related materials
                are owned by or licensed to VisionFlow and are protected by
                applicable intellectual-property laws. You may not copy,
                modify, reverse engineer, or redistribute the service except
                where permitted by law or with written authorization.
              </p>
            </div>

            <div className="section">
              <h2>10. User Content</h2>
              <p>
                You retain responsibility for the content, recipient lists,
                attachments, and other material that you submit or send using
                MailFlow. You represent that you have the necessary rights and
                permissions to use and distribute that content.
              </p>
            </div>

            <div className="section">
              <h2>11. Privacy</h2>
              <p>
                Your use of MailFlow is also subject to our Privacy Policy,
                which explains how information may be collected, used, and
                handled.
              </p>
              <a className="policy-link" href="/privacy-policy">
                View Privacy Policy
              </a>
            </div>

            <div className="section">
              <h2>12. Termination</h2>
              <p>
                You may stop using MailFlow at any time. VisionFlow may suspend
                or terminate an account when necessary to protect the service,
                comply with law, address abuse, or enforce these terms.
              </p>
            </div>

            <div className="section">
              <h2>13. Disclaimer</h2>
              <p>
                To the maximum extent permitted by applicable law, MailFlow is
                provided on an “as available” basis without guarantees that it
                will meet every particular requirement or operate without
                interruption or errors.
              </p>
            </div>

            <div className="section">
              <h2>14. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, VisionFlow
                will not be liable for indirect, incidental, special,
                consequential, or loss-of-profit damages arising from the use
                of or inability to use MailFlow.
              </p>
            </div>

            <div className="section">
              <h2>15. Changes to These Terms</h2>
              <p>
                We may update these Terms of Service from time to time. When
                material changes are made, the updated version will be posted
                on this page with a revised “Last updated” date.
              </p>
            </div>

            <div className="section contact-section">
              <h2>16. Contact</h2>
              <p>
                If you have questions about these Terms of Service, please
                contact VisionFlow through the contact information provided
                within the MailFlow application.
              </p>
              <p>Company: <strong>VisionFlow</strong></p>
            </div>
          </section>

          <footer className="terms-footer">
            <a href="/">Back to MailFlow</a>
            <span>© {new Date().getFullYear()} VisionFlow</span>
          </footer>
        </div>
      </main>

      <style jsx>{`
        .terms-page {
          min-height: 100vh;
          padding: 48px 20px 70px;
          background:
            radial-gradient(circle at top left, rgba(124, 58, 237, 0.12), transparent 34%),
            radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent 30%),
            #f7f7fb;
          color: #1f2937;
        }

        .terms-container {
          width: min(920px, 100%);
          margin: 0 auto;
        }

        .terms-hero {
          text-align: center;
          margin-bottom: 28px;
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 13px;
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.85);
          color: #6d28d9;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          box-shadow: 0 5px 18px rgba(31, 41, 55, 0.06);
        }

        .terms-hero h1 {
          margin: 15px 0 10px;
          color: #111827;
          font-size: clamp(32px, 5vw, 46px);
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .terms-hero p {
          max-width: 650px;
          margin: 0 auto;
          color: #667085;
          font-size: 16px;
          line-height: 1.7;
        }

        .updated {
          margin-top: 13px;
          color: #98a2b3;
          font-size: 13px;
        }

        .terms-card {
          padding: clamp(24px, 5vw, 46px);
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          background: #ffffff;
          box-shadow: 0 18px 55px rgba(31, 41, 55, 0.08);
        }

        .section {
          padding: 0 0 28px;
          margin: 0 0 28px;
          border-bottom: 1px solid #edf0f4;
        }

        .section:last-child {
          padding-bottom: 0;
          margin-bottom: 0;
          border-bottom: 0;
        }

        .section h2 {
          margin: 0 0 10px;
          color: #111827;
          font-size: 19px;
          line-height: 1.35;
          font-weight: 750;
        }

        .section p,
        .section li {
          color: #596273;
          font-size: 15px;
          line-height: 1.8;
        }

        .section p {
          margin: 0 0 10px;
        }

        .section p:last-child {
          margin-bottom: 0;
        }

        .section ul {
          margin: 8px 0 0;
          padding-left: 22px;
        }

        .section li {
          margin-bottom: 6px;
        }

        .section li:last-child {
          margin-bottom: 0;
        }

        .policy-link {
          display: inline-flex;
          align-items: center;
          margin-top: 4px;
          padding: 9px 13px;
          border: 1px solid #ddd6fe;
          border-radius: 10px;
          background: #faf5ff;
          color: #6d28d9;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.18s ease, box-shadow 0.18s ease,
            background-color 0.18s ease;
        }

        .policy-link:hover {
          transform: translateY(-1px);
          background: #f5edff;
          box-shadow: 0 6px 18px rgba(109, 40, 217, 0.12);
        }

        .terms-footer {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 22px 4px 0;
          color: #98a2b3;
          font-size: 13px;
        }

        .terms-footer a {
          color: #6d28d9;
          font-weight: 700;
          text-decoration: none;
        }

        .terms-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .terms-page {
            padding: 28px 14px 45px;
          }

          .terms-card {
            border-radius: 17px;
            padding: 23px 20px;
          }

          .section h2 {
            font-size: 18px;
          }

          .section p,
          .section li {
            font-size: 14px;
            line-height: 1.75;
          }

          .terms-footer {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </>
  );
}
