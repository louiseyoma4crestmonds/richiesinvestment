import { Resend } from 'resend';

// Initialize Resend Client
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'QUANTUM PLUS <onboarding@resend.dev>';

const resend = resendApiKey && !resendApiKey.includes('MY_') && resendApiKey.startsWith('re_')
  ? new Resend(resendApiKey)
  : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendTransactionalEmail({ to, subject, html, text }: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  console.log(`[Email Service] Outgoing dispatch to: ${to} | Subject: "${subject}"`);

  if (!resend) {
    console.log(`[Email Service - Simulated] RESEND_API_KEY not active or using placeholder. Transactional email logged to server output:`);
    console.log(`----------------------------------------`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${text || html.replace(/<[^>]*>?/gm, ' ')}`);
    console.log(`----------------------------------------`);
    return { success: true, id: 'simulated-' + Date.now() };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ' ')
    });

    if (error) {
      console.warn(`[Resend Warning] API returned error:`, error.message);
      // Fallback logging so developer can still read verification codes
      console.log(`[Resend Fallback - Verification/Content]:\n${text || html.replace(/<[^>]*>?/gm, ' ')}`);
      return { success: false, error: error.message };
    }

    console.log(`[Resend Success] Email delivered. ID: ${data?.id}`);
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error(`[Resend Exception] Error sending email to ${to}:`, err?.message);
    return { success: false, error: err?.message };
  }
}

// 1. Password Reset Verification Code Email
export async function sendPasswordResetVerificationEmail(toEmail: string, userName: string, code: string): Promise<boolean> {
  const subject = `Your Password Verification Code: ${code} - QUANTUM PLUS`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset Code</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #071426; padding: 32px 24px; text-align: center; color: #ffffff; }
        .logo { font-size: 20px; font-weight: 900; letter-spacing: 2px; color: #ffffff; text-transform: uppercase; margin: 0; }
        .logo span { color: #0070f3; }
        .subtitle { font-size: 11px; letter-spacing: 1.5px; color: #94a3b8; text-transform: uppercase; margin-top: 4px; }
        .content { padding: 36px 32px; color: #334155; line-height: 1.6; }
        .code-box { background: #f8fafc; border: 2px dashed #0070f3; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0; }
        .code { font-family: 'Courier New', monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #071426; }
        .expiry { font-size: 12px; color: #64748b; margin-top: 8px; }
        .security-notice { background: #eff6ff; border-left: 4px solid #0070f3; padding: 14px 16px; border-radius: 6px; font-size: 12px; color: #1e40af; margin-top: 24px; }
        .footer { background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">QUANTUM<span>PLUS</span></div>
          <div class="subtitle">Industrial Partnership Limited &bull; London</div>
        </div>
        <div class="content">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Password Reset Request</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>We received a request to reset your password for your QUANTUM PLUS Industrial Partnership account. Use the verification code below to authorize this change:</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
            <div class="expiry">This verification code is valid for 15 minutes.</div>
          </div>

          <p>Enter this verification code into the password reset prompt to establish your new credentials.</p>

          <div class="security-notice">
            <strong>Security Reminder:</strong> If you did not initiate this password reset request, please disregard this email or contact our London Security Desk immediately at <a href="mailto:support@quantumindustrialpartnership.net" style="color: #0070f3;">support@quantumindustrialpartnership.net</a>.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} QUANTUM PLUS Industrial Partnership Limited.<br>
          120 London Wall, London, EC2Y 5ET, United Kingdom | Companies House #13894210
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
QUANTUM PLUS Industrial Partnership - Password Reset Code

Hello ${userName},

We received a request to reset your password. Your 6-digit verification code is:

${code}

This code will expire in 15 minutes.

If you did not request this password reset, please ignore this email or contact support@quantumindustrialpartnership.net.

QUANTUM PLUS Industrial Partnership Limited
120 London Wall, London, EC2Y 5ET, UK
  `;

  const res = await sendTransactionalEmail({ to: toEmail, subject, html, text });
  return res.success;
}

// 2. Account Creation / Welcome Email
export async function sendWelcomeEmail(toEmail: string, userName: string, initialPassword?: string): Promise<boolean> {
  const subject = `Welcome to QUANTUM PLUS Industrial Partnership - Account Activated`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to QUANTUM PLUS</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #071426; padding: 32px 24px; text-align: center; color: #ffffff; }
        .logo { font-size: 20px; font-weight: 900; letter-spacing: 2px; color: #ffffff; text-transform: uppercase; margin: 0; }
        .logo span { color: #0070f3; }
        .subtitle { font-size: 11px; letter-spacing: 1.5px; color: #94a3b8; text-transform: uppercase; margin-top: 4px; }
        .content { padding: 36px 32px; color: #334155; line-height: 1.6; }
        .badge { display: inline-block; background: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; margin-bottom: 16px; }
        .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #64748b; }
        .info-value { font-weight: 600; color: #0f172a; }
        .cta-btn { display: inline-block; background: #0070f3; color: #ffffff; font-weight: 700; font-size: 13px; padding: 14px 28px; border-radius: 10px; text-decoration: none; margin: 20px 0 10px; text-align: center; }
        .footer { background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">QUANTUM<span>PLUS</span></div>
          <div class="subtitle">Industrial Partnership Limited &bull; London</div>
        </div>
        <div class="content">
          <span class="badge">Account Ready</span>
          <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">Welcome to the Platform, ${userName}!</h2>
          <p>Thank you for choosing QUANTUM PLUS Industrial Partnership Limited. Your institutional-grade investor account has been successfully provisioned on our algorithmic trading infrastructure.</p>
          
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">Investor ID:</span>
              <span class="info-value">${userName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Registered Email:</span>
              <span class="info-value">${toEmail}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Account Tier:</span>
              <span class="info-value">Verified Investor</span>
            </div>
            ${initialPassword ? `
            <div class="info-row">
              <span class="info-label">Initial Password:</span>
              <span class="info-value font-mono">${initialPassword}</span>
            </div>
            ` : ''}
          </div>

          <p>You can now deposit digital capital, allocate to high-yield algorithmic arbitrage packages, and track daily compounding returns in real-time.</p>

          <center>
            <a href="https://quantumindustrialpartnership.net/login" class="cta-btn">Access Investor Portal</a>
          </center>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} QUANTUM PLUS Industrial Partnership Limited.<br>
          120 London Wall, London, EC2Y 5ET, United Kingdom | Companies House #13894210
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Welcome to QUANTUM PLUS Industrial Partnership Limited!

Hello ${userName},

Your account has been successfully created.
Email: ${toEmail}
${initialPassword ? `Initial Password: ${initialPassword}\n` : ''}
You can sign in to your dashboard to deposit capital and explore algorithmic yield strategies.

QUANTUM PLUS Industrial Partnership Limited
120 London Wall, London, EC2Y 5ET, UK
  `;

  const res = await sendTransactionalEmail({ to: toEmail, subject, html, text });
  return res.success;
}

// 3. Password Reset Success Confirmation
export async function sendPasswordResetConfirmationEmail(toEmail: string, userName: string): Promise<boolean> {
  const subject = `Security Alert: Your Password Was Successfully Changed - QUANTUM PLUS`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Changed</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
        .header { background: #071426; padding: 28px 24px; text-align: center; color: #ffffff; }
        .logo { font-size: 18px; font-weight: 900; letter-spacing: 2px; color: #ffffff; }
        .logo span { color: #0070f3; }
        .content { padding: 32px; color: #334155; line-height: 1.6; }
        .footer { background: #f8fafc; padding: 18px 24px; text-align: center; font-size: 11px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">QUANTUM<span>PLUS</span></div>
        </div>
        <div class="content">
          <h2 style="color: #0f172a; margin-top: 0;">Password Successfully Updated</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>This is a confirmation that your QUANTUM PLUS account password has been updated as requested on <strong>${new Date().toUTCString()}</strong>.</p>
          <p>If you made this change, no further action is required. If you did NOT change your password, please contact our security team immediately at <a href="mailto:support@quantumindustrialpartnership.net">support@quantumindustrialpartnership.net</a>.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} QUANTUM PLUS Industrial Partnership Limited.
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Security Alert: Password Changed

Hello ${userName},

Your password for QUANTUM PLUS was changed on ${new Date().toUTCString()}.
If you did not authorize this, contact support@quantumindustrialpartnership.net immediately.
  `;

  const res = await sendTransactionalEmail({ to: toEmail, subject, html, text });
  return res.success;
}

// 4. Deposit Confirmation Email
export async function sendDepositConfirmationEmail(toEmail: string, userName: string, amount: number, asset: string, txId: string): Promise<boolean> {
  const subject = `Deposit Confirmed: $${amount.toLocaleString()} ${asset} - QUANTUM PLUS`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Deposit Confirmed</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
        .header { background: #071426; padding: 28px 24px; text-align: center; color: #ffffff; }
        .content { padding: 32px; color: #334155; line-height: 1.6; }
        .box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin: 20px 0; text-align: center; }
        .amount { font-size: 28px; font-weight: 800; color: #166534; font-family: monospace; }
        .footer { background: #f8fafc; padding: 18px 24px; text-align: center; font-size: 11px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0; color: #ffffff;">QUANTUM PLUS</h2>
        </div>
        <div class="content">
          <h3 style="color: #0f172a; margin-top: 0;">Deposit Credit Confirmed</h3>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Your deposit has been verified and successfully credited to your investment balance.</p>
          <div class="box">
            <div class="amount">+$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</div>
            <div style="font-size: 12px; color: #15803d; margin-top: 4px;">Asset: ${asset} &bull; Ref: ${txId}</div>
          </div>
          <p>You can now allocate these funds into an active algorithmic trading contract to begin generating daily yields.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} QUANTUM PLUS Industrial Partnership Limited.
        </div>
      </div>
    </body>
    </html>
  `;
  const res = await sendTransactionalEmail({ to: toEmail, subject, html });
  return res.success;
}

// 5. Withdrawal Notification Email
export async function sendWithdrawalNotificationEmail(toEmail: string, userName: string, amount: number, destinationAddress: string, txId: string): Promise<boolean> {
  const subject = `Withdrawal Dispatched: $${amount.toLocaleString()} USD - QUANTUM PLUS`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Withdrawal Notice</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
        .header { background: #071426; padding: 28px 24px; text-align: center; color: #ffffff; }
        .content { padding: 32px; color: #334155; line-height: 1.6; }
        .footer { background: #f8fafc; padding: 18px 24px; text-align: center; font-size: 11px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0; color: #ffffff;">QUANTUM PLUS</h2>
        </div>
        <div class="content">
          <h3 style="color: #0f172a; margin-top: 0;">Withdrawal Processing</h3>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>A withdrawal of <strong>$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</strong> has been dispatched to your blockchain wallet address:</p>
          <p style="font-family: monospace; background: #f1f5f9; padding: 10px; border-radius: 8px; font-size: 12px; word-break: break-all;">${destinationAddress}</p>
          <p>Reference ID: <span style="font-family: monospace;">${txId}</span></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} QUANTUM PLUS Industrial Partnership Limited.
        </div>
      </div>
    </body>
    </html>
  `;
  const res = await sendTransactionalEmail({ to: toEmail, subject, html });
  return res.success;
}
