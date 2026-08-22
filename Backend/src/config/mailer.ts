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
 * Send Welcome & Email Verification with Login ID
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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #ced0d4; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0064e0; margin: 0; font-size: 28px;">Dayflow HRMS</h1>
        <p style="color: #4b4c4f; font-size: 14px; margin-top: 4px;">Every workday, perfectly aligned.</p>
      </div>

      <p style="font-size: 16px; color: #1c1e21;">Hello <strong>${name}</strong>,</p>
      <p style="font-size: 15px; color: #444950; line-height: 1.5;">
        Welcome to Dayflow! Your employee account has been created. Below is your official Login ID:
      </p>

      <div style="background-color: #f1f4f7; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <span style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #5d6c7b; display: block; margin-bottom: 4px;">Your Permanent Login ID</span>
        <span style="font-size: 24px; font-weight: bold; color: #000000; letter-spacing: 2px;">${loginId}</span>
      </div>

      <p style="font-size: 14px; color: #444950;">
        To activate your access, please click the button below to verify your email address:
      </p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${verifyUrl}" style="background-color: #0064e0; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">
          Verify Email Address
        </a>
      </div>

      <p style="font-size: 12px; color: #8595a4; margin-top: 24px; line-height: 1.4;">
        If you did not register for Dayflow, please ignore this email or contact your HR administrator.
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
 * Send Leave Status Decision Email (Approved / Rejected)
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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #ced0d4; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0064e0; margin: 0; font-size: 26px;">Dayflow HRMS</h1>
        <p style="color: #4b4c4f; font-size: 14px; margin-top: 4px;">Leave Request Update</p>
      </div>

      <p style="font-size: 16px; color: #1c1e21;">Hello <strong>${name}</strong>,</p>
      <p style="font-size: 15px; color: #444950; line-height: 1.5;">
        Your leave application has been reviewed by the HR administration.
      </p>

      <div style="border-left: 4px solid ${badgeColor}; padding: 12px 16px; background-color: #f1f4f7; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Leave Type:</strong> ${leaveType}</p>
        <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Dates:</strong> ${startDate} to ${endDate}</p>
        <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Status:</strong> <span style="color: ${badgeColor}; font-weight: bold;">${statusLabel}</span></p>
        ${adminComment ? `<p style="margin: 6px 0 0 0; font-size: 13px; color: #5d6c7b;"><strong>Remarks:</strong> ${adminComment}</p>` : ''}
      </div>

      <p style="font-size: 14px; color: #444950;">
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
