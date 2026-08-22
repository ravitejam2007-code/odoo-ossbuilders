import nodemailer from 'nodemailer';
import { env } from './env';

// Create Nodemailer Transporter pointing to Brevo Custom SMTP
export const mailTransporter = nodemailer.createTransport({
  host: env.BREVO_SMTP_HOST,
  port: env.BREVO_SMTP_PORT,
  secure: false, // TLS on port 587
  auth: {
    user: env.BREVO_USERNAME,
    pass: env.BREVO_SMTP_KEY,
  },
});

export const isMailerConfigured = (): boolean => {
  return !!(env.BREVO_USERNAME && env.BREVO_SMTP_KEY);
};

/**
 * 1. Send Welcome & Email Verification with Login ID
 */
export async function sendVerificationEmail(
  to: string,
  name: string,
  loginId: string,
  verificationToken: string
) {
  if (!isMailerConfigured()) {
    console.warn(`[Mailer] Brevo SMTP credentials not set. Simulated sending verification email to ${to} (Login ID: ${loginId}, Token: ${verificationToken})`);
    return { simulated: true };
  }

  const verifyUrl = `${env.FRONTEND_URL[0]}/verify-email?token=${verificationToken}&loginId=${loginId}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #ced0d4; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 28px;">
        <h1 style="color: #0064e0; margin: 0; font-size: 28px; font-weight: 700;">Dayflow HRMS</h1>
        <p style="color: #4b4c4f; font-size: 14px; margin-top: 4px;">Every workday, perfectly aligned.</p>
      </div>

      <p style="font-size: 16px; color: #1c1e21;">Hello <strong>${name}</strong>,</p>
      <p style="font-size: 15px; color: #444950; line-height: 1.6;">
        Welcome to Dayflow! Your employee account has been created. Below is your official permanent Login ID:
      </p>

      <div style="background-color: #f1f4f7; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0; border: 1px solid #dee3e9;">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #5d6c7b; display: block; margin-bottom: 6px; font-weight: 600;">Your Permanent Login ID</span>
        <span style="font-size: 26px; font-weight: 800; color: #0064e0; letter-spacing: 3px; font-family: monospace;">${loginId}</span>
      </div>

      <p style="font-size: 15px; color: #444950; line-height: 1.6;">
        To activate your access and proceed to the employee portal, please verify your email address by clicking the button below:
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${verifyUrl}" style="background-color: #0064e0; color: #ffffff; padding: 14px 36px; text-decoration: none; border-radius: 100px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 100, 224, 0.25);">
          Verify Email Address
        </a>
      </div>

      <p style="font-size: 13px; color: #8595a4; margin-top: 28px; line-height: 1.5;">
        You can sign into Dayflow using either your email (<code>${to}</code>) or your Login ID (<code>${loginId}</code>).<br>
        If you did not register for Dayflow, please contact your HR administrator.
      </p>
    </div>
  `;

  return mailTransporter.sendMail({
    from: `"${env.BREVO_FROM_NAME}" <${env.BREVO_FROM_EMAIL}>`,
    to,
    subject: `Welcome to Dayflow — Verify Your Account (Login ID: ${loginId})`,
    html,
  });
}

/**
 * 2. Send Leave Status Decision Email (Approved / Rejected)
 */
export async function sendLeaveDecisionEmail(
  to: string,
  name: string,
  leaveType: string,
  status: 'approved' | 'rejected',
  startDate: string,
  endDate: string,
  adminComment?: string
) {
  if (!isMailerConfigured()) {
    console.warn(`[Mailer] Brevo SMTP credentials not set. Simulated sending leave decision (${status}) to ${to}`);
    return { simulated: true };
  }

  const isApproved = status === 'approved';
  const badgeColor = isApproved ? '#31a24c' : '#e41e3f';
  const statusLabel = isApproved ? 'APPROVED' : 'REJECTED';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #ced0d4; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0064e0; margin: 0; font-size: 26px; font-weight: 700;">Dayflow HRMS</h1>
        <p style="color: #4b4c4f; font-size: 14px; margin-top: 4px;">Leave Request Update</p>
      </div>

      <p style="font-size: 16px; color: #1c1e21;">Hello <strong>${name}</strong>,</p>
      <p style="font-size: 15px; color: #444950; line-height: 1.6;">
        Your leave application has been reviewed by the HR administration.
      </p>

      <div style="border-left: 4px solid ${badgeColor}; padding: 16px; background-color: #f1f4f7; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 14px; color: #1c1e21;"><strong>Leave Type:</strong> ${leaveType}</p>
        <p style="margin: 0 0 6px 0; font-size: 14px; color: #1c1e21;"><strong>Dates:</strong> ${startDate} to ${endDate}</p>
        <p style="margin: 0 0 6px 0; font-size: 14px; color: #1c1e21;"><strong>Status:</strong> <span style="color: ${badgeColor}; font-weight: 700;">${statusLabel}</span></p>
        ${adminComment ? `<p style="margin: 6px 0 0 0; font-size: 13px; color: #5d6c7b;"><strong>Remarks:</strong> ${adminComment}</p>` : ''}
      </div>

      <p style="font-size: 14px; color: #444950; line-height: 1.5;">
        You can check your updated attendance log and remaining leave quota anytime in your Dayflow portal.
      </p>
    </div>
  `;

  return mailTransporter.sendMail({
    from: `"${env.BREVO_FROM_NAME}" <${env.BREVO_FROM_EMAIL}>`,
    to,
    subject: `Leave Request ${statusLabel}: ${leaveType} (${startDate} to ${endDate})`,
    html,
  });
}

/**
 * 3. Send Password Reset Email
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetToken: string
) {
  if (!isMailerConfigured()) {
    console.warn(`[Mailer] Brevo SMTP credentials not set. Simulated sending password reset to ${to} (Token: ${resetToken})`);
    return { simulated: true };
  }

  const resetUrl = `${env.FRONTEND_URL[0]}/reset-password?token=${resetToken}&email=${encodeURIComponent(to)}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #ced0d4; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0064e0; margin: 0; font-size: 26px; font-weight: 700;">Dayflow HRMS</h1>
        <p style="color: #4b4c4f; font-size: 14px; margin-top: 4px;">Password Reset Request</p>
      </div>

      <p style="font-size: 16px; color: #1c1e21;">Hello <strong>${name}</strong>,</p>
      <p style="font-size: 15px; color: #444950; line-height: 1.6;">
        We received a request to reset the password for your Dayflow account. Click the button below to choose a new password:
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="background-color: #0064e0; color: #ffffff; padding: 14px 36px; text-decoration: none; border-radius: 100px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 100, 224, 0.25);">
          Reset Password
        </a>
      </div>

      <p style="font-size: 13px; color: #8595a4; margin-top: 24px; line-height: 1.5;">
        This link is valid for 1 hour. If you did not request a password reset, you can safely ignore this email.
      </p>
    </div>
  `;

  return mailTransporter.sendMail({
    from: `"${env.BREVO_FROM_NAME}" <${env.BREVO_FROM_EMAIL}>`,
    to,
    subject: `Dayflow HRMS — Reset Your Password`,
    html,
  });
}
