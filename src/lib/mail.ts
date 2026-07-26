import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "flarelap.org@gmail.com",
    pass: "fluggvftciljggon", // Google App Password (no spaces)
  },
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flarelap.org";

export async function sendOtpEmail(to: string, otp: string): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            color: #334155;
          }
          .container {
            max-width: 580px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03), 0 1px 2px rgba(15, 23, 42, 0.05);
            border: 1px solid #e2e8f0;
          }
          .header {
            background: linear-gradient(135deg, #047857 0%, #065f46 100%);
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            font-size: 20px;
            font-weight: 800;
            margin: 0;
            letter-spacing: 0.5px;
          }
          .content {
            padding: 40px 32px;
          }
          .content p {
            font-size: 14px;
            line-height: 1.6;
            margin-top: 0;
            margin-bottom: 24px;
          }
          .otp-container {
            background-color: #f0fdf4;
            border: 1.5px dashed #a7f3d0;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin-bottom: 28px;
          }
          .otp-code {
            font-size: 32px;
            font-weight: 900;
            color: #047857;
            letter-spacing: 6px;
            margin: 0;
          }
          .footer {
            background-color: #f8fafc;
            padding: 24px 32px;
            border-t: 1px solid #f1f5f9;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            line-height: 1.5;
          }
          .warning {
            color: #e11d48;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FLARELAP GLOBAL FOUNDATION</h1>
          </div>
          <div class="content">
            <p>Hello Super Admin,</p>
            <p>We received a request to reset your password for the Flarelap Foundation Admin Dashboard. Please use the verification code below to proceed with changing your password:</p>
            
            <div class="otp-container">
              <div class="otp-code">${otp}</div>
            </div>
            
            <p>This verification code is valid for <strong>15 minutes</strong>. If you did not make this request, someone else may be trying to access your account. Please <span class="warning">ignore this email</span> and your password will remain unchanged.</p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Flarelap Global Foundation. All rights reserved.<br>
            This is an automated system email. Please do not reply directly to this message.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: '"Flarelap Global Foundation" <flarelap.org@gmail.com>',
      to,
      subject: `[OTP: ${otp}] Admin Password Reset Verification`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return false;
  }
}

export async function sendTfaOtpEmail(to: string, otp: string, purpose: "setup" | "login"): Promise<boolean> {
  const isSetup = purpose === "setup";
  const actionText = isSetup 
    ? "enable Two-Factor Authentication (TFA) on your account" 
    : "complete your Two-Factor Authentication (TFA) dashboard sign-in";
  
  const titleText = isSetup ? "Enable Two-Factor Authentication" : "TFA Sign-In Verification";
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${titleText}</title>
        <style>
          body {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            color: #334155;
          }
          .container {
            max-width: 580px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03), 0 1px 2px rgba(15, 23, 42, 0.05);
            border: 1px solid #e2e8f0;
          }
          .header {
            background: linear-gradient(135deg, #047857 0%, #065f46 100%);
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            font-size: 20px;
            font-weight: 800;
            margin: 0;
            letter-spacing: 0.5px;
          }
          .content {
            padding: 40px 32px;
          }
          .content p {
            font-size: 14px;
            line-height: 1.6;
            margin-top: 0;
            margin-bottom: 24px;
          }
          .otp-container {
            background-color: #f0fdf4;
            border: 1.5px dashed #a7f3d0;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin-bottom: 28px;
          }
          .otp-code {
            font-size: 32px;
            font-weight: 900;
            color: #047857;
            letter-spacing: 6px;
            margin: 0;
          }
          .footer {
            background-color: #f8fafc;
            padding: 24px 32px;
            border-t: 1px solid #f1f5f9;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FLARELAP GLOBAL FOUNDATION</h1>
          </div>
          <div class="content">
            <p>Hello Super Admin,</p>
            <p>Please use the verification code below to ${actionText}:</p>
            
            <div class="otp-container">
              <div class="otp-code">${otp}</div>
            </div>
            
            <p>This verification code is valid for <strong>10 minutes</strong>. If you did not make this request or attempt to sign in, please immediately change your credentials and review security logs.</p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Flarelap Global Foundation. All rights reserved.<br>
            This is an automated system email. Please do not reply directly to this message.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: '"Flarelap Global Foundation" <flarelap.org@gmail.com>',
      to,
      subject: `[TFA Code: ${otp}] Admin Two-Factor Authentication`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Failed to send TFA email:", error);
    return false;
  }
}

export async function sendStudentWelcomeEmail(
  to: string, 
  studentName: string, 
  studentId: string, 
  tempPassword: string
): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Flarelap Learning Portal</title>
        <style>
          body {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            color: #334155;
          }
          .container {
            max-width: 580px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03), 0 1px 2px rgba(15, 23, 42, 0.05);
            border: 1px solid #e2e8f0;
          }
          .header {
            background: linear-gradient(135deg, #047857 0%, #065f46 100%);
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            font-size: 20px;
            font-weight: 800;
            margin: 0;
            letter-spacing: 0.5px;
          }
          .content {
            padding: 40px 32px;
          }
          .content p {
            font-size: 14px;
            line-height: 1.6;
            margin-top: 0;
            margin-bottom: 24px;
          }
          .credentials-container {
            background-color: #f0fdf4;
            border: 1.5px dashed #a7f3d0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 28px;
          }
          .credential-row {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            padding: 8px 0;
          }
          .credential-label {
            font-weight: bold;
            color: #475569;
          }
          .credential-value {
            font-weight: 900;
            color: #047857;
            font-family: monospace;
          }
          .button-container {
            text-align: center;
            margin-top: 24px;
            margin-bottom: 24px;
          }
          .login-btn {
            background-color: #047857;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 28px;
            font-size: 14px;
            font-weight: 800;
            border-radius: 9999px;
            display: inline-block;
            box-shadow: 0 4px 6px rgba(4, 120, 87, 0.15);
          }
          .footer {
            background-color: #f8fafc;
            padding: 24px 32px;
            border-top: 1px solid #f1f5f9;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FLARELAP GLOBAL FOUNDATION</h1>
          </div>
          <div class="content">
            <p>Hello ${studentName},</p>
            <p>Welcome to the Flarelap Learning Portal! Your student account has been successfully created. Use the following credentials to access the learning portal:</p>
            
            <div class="credentials-container">
              <div class="credential-row">
                <span class="credential-label">Student ID / User ID:</span>
                <span class="credential-value">${studentId}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">Temporary Password:</span>
                <span class="credential-value">${tempPassword}</span>
              </div>
            </div>
            
            <div class="button-container">
              <a href="${appUrl}/student/login" class="login-btn" style="color: #ffffff;">Log In to Learning Portal</a>
            </div>
            
            <p>For security reasons, we strongly recommend changing your password immediately after logging in for the first time.</p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Flarelap Global Foundation. All rights reserved.<br>
            This is an automated system email. Please do not reply directly to this message.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: '"Flarelap Global Foundation" <flarelap.org@gmail.com>',
      to,
      subject: `Welcome to Flarelap! Your Student Account Credentials [ID: ${studentId}]`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Failed to send student credentials email:", error);
    return false;
  }
}

export interface VolunteerEmailRecipient {
  fullName: string;
  email: string;
  phone?: string | null;
  memberId?: string | null;
  designation?: string | null;
}

export async function sendVolunteerEmail(
  recipients: (string | VolunteerEmailRecipient)[],
  subject: string,
  htmlMessage: string
): Promise<{ success: boolean; count: number }> {
  if (!recipients || recipients.length === 0) {
    return { success: false, count: 0 };
  }

  let sentCount = 0;

  for (const item of recipients) {
    const isObject = typeof item !== "string" && item !== null;
    const recipientEmail = isObject ? (item as VolunteerEmailRecipient).email : (item as string);

    if (!recipientEmail || !recipientEmail.includes("@")) continue;

    const displayFullName = isObject ? ((item as VolunteerEmailRecipient).fullName || "Valued Volunteer") : "Valued Volunteer";
    const displayMemberId = isObject ? ((item as VolunteerEmailRecipient).memberId || "FGF-VOLUNTEER") : "FGF-VOLUNTEER";
    const displayDesignation = isObject ? ((item as VolunteerEmailRecipient).designation || "Volunteer") : "Volunteer";
    const displayPhone = isObject ? ((item as VolunteerEmailRecipient).phone || "N/A") : "N/A";

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #f1f5f9;
              margin: 0;
              padding: 0;
              color: #1e293b;
            }
            .email-wrapper {
              max-width: 620px;
              margin: 30px auto;
              background-color: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
              border: 1px solid #e2e8f0;
            }
            .email-header {
              background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #0d9488 100%);
              padding: 36px 32px 28px 32px;
              text-align: center;
            }
            .header-logo {
              width: 68px;
              height: 68px;
              border-radius: 16px;
              background: #ffffff;
              padding: 6px;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
              margin: 0 auto 14px auto;
              display: block;
            }
            .header-title {
              color: #ffffff;
              font-size: 22px;
              font-weight: 800;
              letter-spacing: 0.8px;
              margin: 0 0 4px 0;
              text-transform: uppercase;
            }
            .header-subtitle {
              color: #a7f3d0;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 1.5px;
              margin: 0 0 14px 0;
              text-transform: uppercase;
            }
            .header-badge {
              display: inline-block;
              background: rgba(255, 255, 255, 0.18);
              border: 1px solid rgba(255, 255, 255, 0.3);
              color: #ffffff;
              font-size: 10.5px;
              font-weight: 800;
              padding: 4px 14px;
              border-radius: 20px;
              letter-spacing: 0.5px;
            }
            .email-body {
              padding: 36px 32px;
              font-size: 14.5px;
              line-height: 1.75;
              color: #334155;
              background-color: #ffffff;
            }
            .message-box {
              background-color: #ffffff;
            }
            .message-box p {
              margin-top: 0;
              margin-bottom: 16px;
            }
            .message-box h1, .message-box h2, .message-box h3 {
              color: #065f46;
              font-weight: 800;
            }
            .email-footer {
              background-color: #0f172a;
              padding: 30px 24px;
              text-align: center;
              color: #94a3b8;
              font-size: 12px;
              line-height: 1.6;
            }
            .footer-logo-text {
              color: #ffffff;
              font-size: 14px;
              font-weight: 800;
              letter-spacing: 0.5px;
              margin-bottom: 6px;
            }
            .footer-address {
              color: #cbd5e1;
              font-size: 11.5px;
              margin-bottom: 16px;
            }
            .footer-btn {
              display: inline-block;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: #ffffff !important;
              text-decoration: none;
              font-weight: 800;
              font-size: 12px;
              padding: 10px 24px;
              border-radius: 10px;
              margin-bottom: 16px;
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
            }
            .footer-disclaimer {
              font-size: 10.5px;
              color: #64748b;
              border-top: 1px solid #1e293b;
              padding-top: 14px;
              margin-top: 14px;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <!-- HEADER -->
            <div class="email-header">
              <img src="${appUrl}/logo.png" alt="Flarelap Logo" class="header-logo" />
              <h1 class="header-title">Flarelap Global Foundation</h1>
              <p class="header-subtitle">Empowering Communities & Inspiring Change</p>
              <div class="header-badge">★ OFFICIAL VOLUNTEER COMMUNICATION</div>
            </div>

            <!-- BODY CONTENT -->
            <div class="email-body">
              <!-- VOLUNTEER IDENTITY BADGE CARD -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="vertical-align: top;">
                      <span style="font-size: 9.5px; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.5px;">MEMBER ID</span><br/>
                      <strong style="font-size: 15px; font-family: monospace; color: #1e1b4b; letter-spacing: 0.5px;">${displayMemberId}</strong>
                    </td>
                    <td align="right" style="vertical-align: top;">
                      <span style="font-size: 9.5px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">DESIGNATION</span><br/>
                      <span style="background: #dbeafe; color: #1e40af; font-size: 10.5px; font-weight: 800; padding: 3px 10px; border-radius: 6px; text-transform: uppercase; display: inline-block; margin-top: 2px;">${displayDesignation}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top: 14px; border-top: 1px solid #e2e8f0; margin-top: 14px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="vertical-align: top;">
                            <span style="font-size: 10.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">Volunteer Name:</span><br/>
                            <strong style="font-size: 14px; color: #0f172a;">${displayFullName}</strong>
                          </td>
                          <td align="right" style="vertical-align: top;">
                            <span style="font-size: 10.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">Contact Email:</span><br/>
                            <strong style="font-size: 12px; color: #334155;">${recipientEmail}</strong><br/>
                            <span style="font-size: 11px; color: #64748b;">Phone: ${displayPhone}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <div class="message-box">
                ${htmlMessage}
              </div>
            </div>

            <!-- FOOTER -->
            <div class="email-footer">
              <div class="footer-logo-text">FLARELAP GLOBAL FOUNDATION</div>
              <div class="footer-address">
                Global Headquarters • Sirsal (38) Kaithal, Haryana, India - 136026<br/>
                Helpline: +91 9729817600 | Email: contact@flarelap.org
              </div>

              <a href="${appUrl}" target="_blank" class="footer-btn">Visit Official Portal &rarr;</a>

              <div class="footer-disclaimer">
                This is an official notification sent to registered volunteers of Flarelap Global Foundation.<br/>
                © ${new Date().getFullYear()} Flarelap Global Foundation. All rights reserved.
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await transporter.sendMail({
        from: '"Flarelap Global Foundation" <flarelap.org@gmail.com>',
        to: recipientEmail,
        subject: subject,
        html: htmlContent,
      });
      sentCount++;
    } catch (error) {
      console.error(`Failed to send email to ${recipientEmail}:`, error);
    }
  }

  return { success: sentCount > 0, count: sentCount };
}
