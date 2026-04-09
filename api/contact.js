const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // ── CORS headers ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body || {};

  // ── Server-side validation ──
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // ── Transporter ──
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_SENT_USER,  // sends FROM this Gmail account
      pass: process.env.GMAIL_PASS,
    },
  });

  // ── Timestamp ──
  const now = new Date().toLocaleString('en-US', {
    timeZone: 'America/Toronto',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // ── Beautiful HTML Email Template ──
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Portfolio Message</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#0d0d0d;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;background-color:#111111;border-radius:16px;
                 overflow:hidden;border:1px solid #222222;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);
                        padding:48px 40px 40px;text-align:center;">

              <!-- Accent line -->
              <div style="width:48px;height:3px;background:linear-gradient(90deg,#e8b86d,#f5d08a);
                           margin:0 auto 24px;border-radius:2px;"></div>

              <!-- Initials avatar -->
              <div style="width:72px;height:72px;border-radius:50%;
                           background:linear-gradient(135deg,#e8b86d,#c9933a);
                           margin:0 auto 20px;display:flex;align-items:center;
                           justify-content:center;font-size:28px;font-weight:700;
                           color:#0d0d0d;line-height:72px;text-align:center;">
                AV
              </div>

              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;
                          color:#ffffff;letter-spacing:-0.3px;">
                New Message Received
              </h1>
              <p style="margin:0;font-size:14px;color:#8899aa;letter-spacing:0.5px;
                          text-transform:uppercase;">
                Portfolio Contact Form
              </p>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="padding:40px 40px 32px;">

              <!-- Greeting -->
              <p style="margin:0 0 28px;font-size:15px;color:#aabbcc;line-height:1.6;">
                Hey <strong style="color:#e8b86d;">Anurajsinh</strong>, someone reached out
                through your portfolio. Here are their details:
              </p>

              <!-- ── Info Cards ── -->

              <!-- Name -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="margin-bottom:12px;background:#1a1a1a;border-radius:10px;
                       border:1px solid #252525;overflow:hidden;">
                <tr>
                  <td width="44" style="padding:16px 0 16px 20px;vertical-align:middle;">
                    <div style="width:36px;height:36px;border-radius:8px;
                                 background:rgba(232,184,109,0.12);text-align:center;
                                 line-height:36px;font-size:16px;">
                      👤
                    </div>
                  </td>
                  <td style="padding:16px 20px;vertical-align:middle;">
                    <p style="margin:0 0 2px;font-size:11px;color:#556677;
                                text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">
                      Full Name
                    </p>
                    <p style="margin:0;font-size:16px;color:#ffffff;font-weight:600;">
                      ${escapeHtml(name.trim())}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Email -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="margin-bottom:12px;background:#1a1a1a;border-radius:10px;
                       border:1px solid #252525;overflow:hidden;">
                <tr>
                  <td width="44" style="padding:16px 0 16px 20px;vertical-align:middle;">
                    <div style="width:36px;height:36px;border-radius:8px;
                                 background:rgba(232,184,109,0.12);text-align:center;
                                 line-height:36px;font-size:16px;">
                      ✉️
                    </div>
                  </td>
                  <td style="padding:16px 20px;vertical-align:middle;">
                    <p style="margin:0 0 2px;font-size:11px;color:#556677;
                                text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">
                      Email Address
                    </p>
                    <a href="mailto:${escapeHtml(email.trim())}"
                      style="font-size:15px;color:#e8b86d;font-weight:500;
                              text-decoration:none;">
                      ${escapeHtml(email.trim())}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Phone -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="margin-bottom:24px;background:#1a1a1a;border-radius:10px;
                       border:1px solid #252525;overflow:hidden;">
                <tr>
                  <td width="44" style="padding:16px 0 16px 20px;vertical-align:middle;">
                    <div style="width:36px;height:36px;border-radius:8px;
                                 background:rgba(232,184,109,0.12);text-align:center;
                                 line-height:36px;font-size:16px;">
                      📞
                    </div>
                  </td>
                  <td style="padding:16px 20px;vertical-align:middle;">
                    <p style="margin:0 0 2px;font-size:11px;color:#556677;
                                text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">
                      Phone Number
                    </p>
                    <p style="margin:0;font-size:15px;color:${phone?.trim() ? '#ffffff' : '#445566'};
                                font-weight:${phone?.trim() ? '500' : '400'};
                                font-style:${phone?.trim() ? 'normal' : 'italic'};">
                      ${phone?.trim() ? escapeHtml(phone.trim()) : 'Not provided'}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Message Box -->
              <div style="background:#141414;border-radius:12px;padding:24px;
                           border:1px solid #222222;border-left:3px solid #e8b86d;">
                <p style="margin:0 0 12px;font-size:11px;color:#556677;
                            text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">
                  💬 &nbsp; Message
                </p>
                <p style="margin:0;font-size:15px;color:#ccd8e0;line-height:1.75;
                            white-space:pre-wrap;">
                  ${escapeHtml(message.trim())}
                </p>
              </div>

              <!-- Reply CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="margin-top:32px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(email.trim())}?subject=Re: Your message to Anurajsinh Vaghela"
                      style="display:inline-block;padding:14px 36px;
                              background:linear-gradient(135deg,#e8b86d,#c9933a);
                              color:#0d0d0d;font-size:14px;font-weight:700;
                              text-decoration:none;border-radius:8px;
                              letter-spacing:0.3px;">
                      Reply to ${escapeHtml(name.trim().split(' ')[0])}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#252525,transparent);"></div>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#334455;">
                Received on ${now} (Toronto Time)
              </p>
              <p style="margin:0;font-size:12px;color:#334455;">
                Sent via <span style="color:#e8b86d;">anurajsinhvaghela.vercel.app</span>
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

        <!-- Bottom tag -->
        <p style="margin:20px 0 0;font-size:11px;color:#334455;text-align:center;">
          © ${new Date().getFullYear()} Anurajsinh Vaghela &mdash; Portfolio
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
  `;

  // ── Plain-text fallback ──
  const textFallback = `
New Portfolio Contact
=====================
Name:    ${name.trim()}
Email:   ${email.trim()}
Phone:   ${phone?.trim() || 'Not provided'}
Time:    ${now}

Message:
${message.trim()}
  `.trim();

  const mailOptions = {
    from: `"Portfolio — ${name.trim()}" <${process.env.GMAIL_SENT_USER}>`,
    to: process.env.CONTACT_RECEIVER,
    replyTo: email.trim(),
    subject: `✉️ New message from ${name.trim()} — Portfolio`,
    text: textFallback,
    html: htmlTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Nodemailer error:', err);
    return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
};

// ── Sanitise user input to prevent XSS in the email HTML ──
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}