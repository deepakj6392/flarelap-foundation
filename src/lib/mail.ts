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
