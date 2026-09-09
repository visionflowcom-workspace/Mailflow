// Ready-made, visually designed email templates (like marketing emails from
// Daraz, Amazon, etc.) — inline-styled HTML so they render correctly across
// Gmail, Outlook, and other email clients. Use {{name}}, {{company}}, or any
// other column header from the sheet as a placeholder.

const wrapper = (inner) => `
<div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#ffffff;border:1px solid #eee;">
${inner}
</div>
`;

const footer = `
  <div style="background:#f7f7fb;padding:24px 32px;text-align:center;">
    <p style="margin:0 0 8px;font-size:12px;color:#888;">You're receiving this email because you're a valued contact.</p>
    <p style="margin:0;font-size:12px;color:#888;">[Your Company Name] · [Your Address] · <a href="#" style="color:#888;">Unsubscribe</a></p>
  </div>
`;

export const EMAIL_TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank',
    icon: '📄',
    subject: '',
    bodyHtml: '',
  },
  {
    id: 'flash-sale',
    name: 'Flash Sale',
    icon: '🔥',
    subject: '⚡ FLASH SALE: 50% OFF — Today Only, {{name}}!',
    bodyHtml: wrapper(`
      <div style="background:linear-gradient(135deg,#ff4d4f,#ff7a45);padding:36px 32px;text-align:center;">
        <p style="margin:0 0 6px;color:#fff;font-size:13px;letter-spacing:2px;font-weight:700;">LIMITED TIME OFFER</p>
        <p style="margin:0;color:#fff;font-size:38px;font-weight:800;line-height:1.1;">FLASH SALE</p>
        <p style="margin:10px 0 0;color:#fff;font-size:22px;font-weight:700;">UP TO 50% OFF</p>
      </div>
      <div style="padding:32px;">
        <p style="margin:0 0 16px;font-size:15px;color:#222;">Hi {{name}},</p>
        <p style="margin:0 0 20px;font-size:15px;color:#444;line-height:1.6;">Our biggest sale of the season is here — but only for the next 24 hours. Don't miss out on massive savings across your favorite items.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td width="48%" style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:16px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;color:#999;">Category</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#222;">Up to 40% off</p>
            </td>
            <td width="4%"></td>
            <td width="48%" style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:16px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;color:#999;">Bestsellers</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#222;">Up to 50% off</p>
            </td>
          </tr>
        </table>
        <div style="text-align:center;margin-bottom:8px;">
          <a href="#" style="display:inline-block;background:#ff4d4f;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:8px;">SHOP NOW →</a>
        </div>
        <p style="text-align:center;font-size:12px;color:#999;margin-top:10px;">Offer ends tonight at midnight.</p>
      </div>
      ${footer}
    `),
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    icon: '🚀',
    subject: 'Introducing something new for {{company}}',
    bodyHtml: wrapper(`
      <div style="background:#1e1b3a;padding:40px 32px;text-align:center;">
        <p style="margin:0 0 10px;color:#a78bfa;font-size:13px;letter-spacing:2px;font-weight:700;">JUST LAUNCHED</p>
        <p style="margin:0;color:#fff;font-size:30px;font-weight:800;line-height:1.2;">Meet Our Newest Product</p>
      </div>
      <div style="padding:32px;">
        <p style="margin:0 0 16px;font-size:15px;color:#222;">Hi {{name}},</p>
        <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.6;">We're excited to announce our latest product — built to help teams like {{company}} save time and get better results.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:12px 0;border-bottom:1px solid #eee;">
            <span style="display:inline-block;width:28px;height:28px;background:#eeecfd;border-radius:50%;text-align:center;line-height:28px;color:#6d5ef8;font-weight:700;margin-right:10px;">✓</span>
            <span style="font-size:14.5px;color:#333;">Feature one — a short benefit that matters to them</span>
          </td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #eee;">
            <span style="display:inline-block;width:28px;height:28px;background:#eeecfd;border-radius:50%;text-align:center;line-height:28px;color:#6d5ef8;font-weight:700;margin-right:10px;">✓</span>
            <span style="font-size:14.5px;color:#333;">Feature two — a short benefit that matters to them</span>
          </td></tr>
          <tr><td style="padding:12px 0;">
            <span style="display:inline-block;width:28px;height:28px;background:#eeecfd;border-radius:50%;text-align:center;line-height:28px;color:#6d5ef8;font-weight:700;margin-right:10px;">✓</span>
            <span style="font-size:14.5px;color:#333;">Feature three — a short benefit that matters to them</span>
          </td></tr>
        </table>
        <div style="text-align:center;margin-top:28px;">
          <a href="#" style="display:inline-block;background:linear-gradient(90deg,#6d5ef8,#8b5cf6);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:8px;">See it in action →</a>
        </div>
      </div>
      ${footer}
    `),
  },
  {
    id: 'promo-discount',
    name: 'Promo Code',
    icon: '🏷️',
    subject: 'A special offer just for you, {{name}}',
    bodyHtml: wrapper(`
      <div style="background:#0f9d58;padding:14px 32px;text-align:center;">
        <p style="margin:0;color:#fff;font-size:12.5px;font-weight:600;letter-spacing:1px;">EXCLUSIVE OFFER FOR OUR CONTACTS</p>
      </div>
      <div style="padding:36px 32px 24px;text-align:center;">
        <p style="margin:0 0 6px;font-size:15px;color:#444;">Hi {{name}}, here's a gift for you</p>
        <p style="margin:0 0 20px;font-size:40px;font-weight:800;color:#0f9d58;">20% OFF</p>
        <div style="display:inline-block;border:2px dashed #0f9d58;border-radius:8px;padding:12px 28px;margin-bottom:24px;">
          <span style="font-size:20px;font-weight:700;color:#222;letter-spacing:3px;">SAVE20</span>
        </div>
        <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.6;">Use this code at checkout to save on your next order. Valid for a limited time only.</p>
        <a href="#" style="display:inline-block;background:#0f9d58;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:8px;">Redeem Now →</a>
      </div>
      ${footer}
    `),
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    icon: '📰',
    subject: "This month's update from us",
    bodyHtml: wrapper(`
      <div style="background:#fafafa;padding:28px 32px;border-bottom:3px solid #6d5ef8;">
        <p style="margin:0;font-size:22px;font-weight:800;color:#1e1b3a;">Monthly Update</p>
        <p style="margin:4px 0 0;font-size:13px;color:#888;">Hi {{name}} — here's what's new</p>
      </div>
      <div style="padding:28px 32px;">
        <div style="margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #eee;">
          <p style="margin:0 0 6px;font-size:11px;color:#6d5ef8;font-weight:700;letter-spacing:1px;">UPDATE 01</p>
          <p style="margin:0 0 8px;font-size:17px;font-weight:700;color:#222;">Headline goes here</p>
          <p style="margin:0;font-size:14px;color:#555;line-height:1.6;">A short paragraph describing this update and why it matters to the reader.</p>
        </div>
        <div style="margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #eee;">
          <p style="margin:0 0 6px;font-size:11px;color:#6d5ef8;font-weight:700;letter-spacing:1px;">UPDATE 02</p>
          <p style="margin:0 0 8px;font-size:17px;font-weight:700;color:#222;">Headline goes here</p>
          <p style="margin:0;font-size:14px;color:#555;line-height:1.6;">A short paragraph describing this update and why it matters to the reader.</p>
        </div>
        <p style="font-size:14px;color:#555;">Thanks for staying with us — more updates coming soon.</p>
      </div>
      ${footer}
    `),
  },
  {
    id: 'cold-outreach',
    name: 'Cold Outreach',
    icon: '👋',
    subject: 'Quick question, {{name}}',
    bodyHtml: wrapper(`
      <div style="padding:32px;">
        <p style="margin:0 0 16px;font-size:15px;color:#222;">Hi {{name}},</p>
        <p style="margin:0 0 14px;font-size:15px;color:#444;line-height:1.6;">I hope you're doing well. I came across {{company}} and wanted to reach out directly.</p>
        <p style="margin:0 0 14px;font-size:15px;color:#444;line-height:1.6;">We help businesses like yours [describe what you do in one line]. I'd love to share a bit more if you're open to a quick chat.</p>
        <p style="margin:0 0 22px;font-size:15px;color:#444;line-height:1.6;">Would you be free for a short call this week?</p>
        <div style="margin-bottom:8px;">
          <a href="#" style="display:inline-block;background:#1e1b3a;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 24px;border-radius:8px;">Book a quick call →</a>
        </div>
        <p style="margin:24px 0 0;font-size:14px;color:#444;">Best regards,<br>[Your name]</p>
      </div>
    `),
  },
  {
    id: 'order-confirmation',
    name: 'Order Confirmation',
    icon: '📦',
    subject: 'Your order is confirmed, {{name}}!',
    bodyHtml: wrapper(`
      <div style="background:#1e1b3a;padding:28px 32px;text-align:center;">
        <p style="margin:0;color:#fff;font-size:20px;font-weight:700;">✓ Order Confirmed</p>
      </div>
      <div style="padding:32px;">
        <p style="margin:0 0 16px;font-size:15px;color:#222;">Hi {{name}},</p>
        <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.6;">Thanks for your order! We're getting it ready and will notify you once it ships.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;overflow:hidden;margin-bottom:24px;">
          <tr style="background:#fafafa;">
            <td style="padding:12px 16px;font-size:13px;color:#888;">Order Number</td>
            <td style="padding:12px 16px;font-size:13px;color:#222;font-weight:700;text-align:right;">#[Order ID]</td>
          </tr>
          <tr>
            <td style="padding:12px 16px;font-size:13px;color:#888;">Estimated delivery</td>
            <td style="padding:12px 16px;font-size:13px;color:#222;font-weight:700;text-align:right;">[Delivery date]</td>
          </tr>
        </table>
        <div style="text-align:center;">
          <a href="#" style="display:inline-block;background:linear-gradient(90deg,#6d5ef8,#8b5cf6);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 32px;border-radius:8px;">Track Your Order →</a>
        </div>
      </div>
      ${footer}
    `),
  },
  {
    id: 'welcome',
    name: 'Welcome',
    icon: '✦',
    subject: 'Welcome to {{company}}, {{name}}',
    bodyHtml: wrapper(`
      <div style="background:linear-gradient(135deg,#6d5ef8,#8b5cf6);padding:40px 32px;text-align:center;">
        <p style="margin:0 0 8px;color:#ddd8ff;font-size:12px;letter-spacing:2px;font-weight:700;">WELCOME</p>
        <p style="margin:0;color:#fff;font-size:30px;font-weight:800;">Great to have you here</p>
      </div>
      <div style="padding:32px;">
        <p style="margin:0 0 16px;font-size:15px;color:#222;">Hi {{name}},</p>
        <p style="margin:0 0 18px;font-size:15px;color:#444;line-height:1.7;">Thanks for joining us. We're excited to have you with us and look forward to helping you get started.</p>
        <div style="background:#f7f6ff;border-radius:10px;padding:18px;margin-bottom:24px;">
          <p style="margin:0 0 7px;font-size:14px;font-weight:700;color:#1e1b3a;">Here's what you can do next</p>
          <p style="margin:0;font-size:13.5px;color:#666;line-height:1.6;">Explore your account, discover the key features, and reach out if you need any help.</p>
        </div>
        <div style="text-align:center;"><a href="#" style="display:inline-block;background:#6d5ef8;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 32px;border-radius:8px;">Get Started →</a></div>
      </div>
      ${footer}
    `),
  },
  {
    id: 'event-invitation',
    name: 'Event Invite',
    icon: '◈',
    subject: 'You’re invited: {{company}} event',
    bodyHtml: wrapper(`
      <div style="background:#111827;padding:38px 32px;text-align:center;">
        <p style="margin:0 0 8px;color:#a78bfa;font-size:12px;letter-spacing:2px;font-weight:700;">SAVE THE DATE</p>
        <p style="margin:0;color:#fff;font-size:30px;font-weight:800;">You’re Invited</p>
      </div>
      <div style="padding:32px;">
        <p style="margin:0 0 14px;font-size:15px;color:#222;">Hi {{name}},</p>
        <p style="margin:0 0 22px;font-size:15px;color:#555;line-height:1.7;">Join us for an upcoming event designed to bring together people, ideas, and practical insights.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #eee;border-radius:10px;margin-bottom:24px;">
          <tr><td style="padding:14px 16px;font-size:13px;color:#888;">DATE</td><td style="padding:14px 16px;font-size:14px;font-weight:700;color:#222;text-align:right;">[Event date]</td></tr>
          <tr><td style="padding:14px 16px;font-size:13px;color:#888;border-top:1px solid #eee;">TIME</td><td style="padding:14px 16px;font-size:14px;font-weight:700;color:#222;text-align:right;border-top:1px solid #eee;">[Event time]</td></tr>
          <tr><td style="padding:14px 16px;font-size:13px;color:#888;border-top:1px solid #eee;">LOCATION</td><td style="padding:14px 16px;font-size:14px;font-weight:700;color:#222;text-align:right;border-top:1px solid #eee;">[Location / Online]</td></tr>
        </table>
        <div style="text-align:center;"><a href="#" style="display:inline-block;background:#1e1b3a;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 32px;border-radius:8px;">Reserve My Spot →</a></div>
      </div>
      ${footer}
    `),
  },
  {
    id: 'webinar',
    name: 'Webinar',
    icon: '◎',
    subject: 'Join our upcoming webinar, {{name}}',
    bodyHtml: wrapper(`
      <div style="background:#eef2ff;padding:34px 32px;text-align:center;border-bottom:1px solid #e0e7ff;">
        <p style="margin:0 0 8px;color:#4c3fd7;font-size:12px;letter-spacing:1.5px;font-weight:700;">LIVE WEBINAR</p>
        <p style="margin:0;color:#1e1b3a;font-size:27px;font-weight:800;line-height:1.25;">Practical ideas you can use right away</p>
      </div>
      <div style="padding:32px;">
        <p style="margin:0 0 14px;font-size:15px;color:#222;">Hi {{name}},</p>
        <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.7;">We're hosting a focused session on [topic]. You'll leave with practical takeaways, examples, and time for questions.</p>
        <div style="text-align:center;background:#1e1b3a;border-radius:10px;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 5px;color:#a78bfa;font-size:12px;font-weight:700;">[DATE] · [TIME]</p>
          <p style="margin:0;color:#fff;font-size:18px;font-weight:700;">Online · Free to attend</p>
        </div>
        <div style="text-align:center;"><a href="#" style="display:inline-block;background:#6d5ef8;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 32px;border-radius:8px;">Register for Free →</a></div>
      </div>
      ${footer}
    `),
  },
  {
    id: 'seasonal-greeting',
    name: 'Seasonal',
    icon: '✧',
    subject: 'A special message from {{company}}',
    bodyHtml: wrapper(`
      <div style="background:linear-gradient(135deg,#0f766e,#14b8a6);padding:42px 32px;text-align:center;">
        <p style="margin:0 0 8px;color:#ccfbf1;font-size:12px;letter-spacing:2px;font-weight:700;">A SPECIAL MOMENT</p>
        <p style="margin:0;color:#fff;font-size:30px;font-weight:800;">Warm wishes from our team</p>
      </div>
      <div style="padding:34px 32px;text-align:center;">
        <p style="margin:0 0 16px;font-size:15px;color:#222;">Hi {{name}},</p>
        <p style="margin:0 auto 22px;max-width:470px;font-size:15px;color:#555;line-height:1.7;">We're taking a moment to say thank you for being part of our community. Wishing you a wonderful season filled with good moments.</p>
        <a href="#" style="display:inline-block;background:#0f766e;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 30px;border-radius:8px;">Learn More →</a>
      </div>
      ${footer}
    `),
  },
  {
    id: 'feedback',
    name: 'Feedback',
    icon: '◌',
    subject: 'Could you share your feedback, {{name}}?',
    bodyHtml: wrapper(`
      <div style="padding:34px 32px 18px;">
        <p style="margin:0 0 8px;color:#6d5ef8;font-size:12px;letter-spacing:1.5px;font-weight:700;">WE VALUE YOUR INPUT</p>
        <p style="margin:0;font-size:27px;font-weight:800;color:#1e1b3a;line-height:1.25;">Help us make the experience better</p>
      </div>
      <div style="padding:14px 32px 34px;">
        <p style="margin:0 0 16px;font-size:15px;color:#222;">Hi {{name}},</p>
        <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.7;">Your opinion matters to us. Would you take a minute to share what worked well and what we could improve?</p>
        <div style="background:#f7f6ff;border:1px solid #e9e6ff;border-radius:10px;padding:18px;margin-bottom:22px;">
          <p style="margin:0;font-size:14px;font-weight:700;color:#333;">It only takes 60 seconds.</p>
          <p style="margin:5px 0 0;font-size:13px;color:#777;">Your feedback helps us prioritize meaningful improvements.</p>
        </div>
        <div style="text-align:center;"><a href="#" style="display:inline-block;background:#6d5ef8;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 30px;border-radius:8px;">Share Feedback →</a></div>
      </div>
      ${footer}
    `),
  },
  {
    id: 're-engagement',
    name: 'Re-engagement',
    icon: '↗',
    subject: 'We’d love to see you again, {{name}}',
    bodyHtml: wrapper(`
      <div style="background:#fff7ed;padding:34px 32px;text-align:center;border-bottom:1px solid #fed7aa;">
        <p style="margin:0 0 8px;color:#c2410c;font-size:12px;letter-spacing:1.5px;font-weight:700;">WE MISS YOU</p>
        <p style="margin:0;color:#7c2d12;font-size:29px;font-weight:800;">Ready to come back?</p>
      </div>
      <div style="padding:32px;">
        <p style="margin:0 0 16px;font-size:15px;color:#222;">Hi {{name}},</p>
        <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.7;">It's been a while. We've added new updates and would love for you to take another look.</p>
        <div style="text-align:center;margin-bottom:8px;"><a href="#" style="display:inline-block;background:#ea580c;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 32px;border-radius:8px;">Come Back →</a></div>
        <p style="margin:14px 0 0;text-align:center;font-size:12px;color:#999;">You can unsubscribe anytime.</p>
      </div>
      ${footer}
    `),
  },
];
