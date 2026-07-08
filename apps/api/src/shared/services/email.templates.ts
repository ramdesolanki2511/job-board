/**
 * Email Templates
 * Provides HTML templates for various email types
 */

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  url?: string;
}

export class EmailTemplate {
  /**
   * Job Alert Email Template
   */
  static jobAlert(alertName: string, jobs: Job[]): string {
    const jobsList = jobs
      .map(
        (job) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 16px; text-align: left;">
          <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #1f2937;">
            ${job.title}
          </h3>
          <p style="margin: 0 0 4px; color: #6b7280; font-size: 14px;">
            <strong>${job.company}</strong>
          </p>
          <p style="margin: 0 0 8px; color: #9ca3af; font-size: 13px;">
            📍 ${job.location}
          </p>
          ${job.salary ? `<p style="margin: 0; color: #059669; font-weight: 600; font-size: 14px;">💰 ${job.salary}</p>` : ""}
          ${job.url ? `<a href="${job.url}" style="display: inline-block; margin-top: 8px; padding: 8px 16px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600;">View Job</a>` : ""}
        </td>
      </tr>
    `
      )
      .join("");

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; color: #1f2937; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 8px 0 0; opacity: 0.9; }
          .content { background: white; padding: 24px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 16px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          a { color: #3b82f6; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 ${alertName}</h1>
            <p>New job opportunities matching your alert</p>
          </div>
          <div class="content">
            <p>Hi there!</p>
            <p>We found <strong>${jobs.length}</strong> new job${jobs.length !== 1 ? "s" : ""} matching your alert "${alertName}".</p>
            <table>
              <tbody>
                ${jobsList}
              </tbody>
            </table>
            <p style="margin-top: 24px; text-align: center;">
              <a href="${process.env.FRONTEND_URL}/alerts" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Manage Your Alerts</a>
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0;">© 2024 Job Board. All rights reserved. | <a href="${process.env.FRONTEND_URL}/settings/notifications">Notification Preferences</a></p>
          </div>
        </div>
      </body>
    </html>
    `;
  }

  /**
   * Subscription Confirmation Email Template
   */
  static subscriptionConfirmation(
    planName: string,
    price: number,
    billingCycle: string
  ): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; color: #1f2937; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: white; padding: 24px; border: 1px solid #e5e7eb; }
          .planCard { background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0; }
          .planCard h3 { margin: 0 0 8px; color: #065f46; }
          .price { font-size: 32px; font-weight: 700; color: #059669; }
          .period { font-size: 14px; color: #6b7280; }
          .footer { background: #f9fafb; padding: 16px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280; text-align: center; }
          a { color: #059669; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Subscription Confirmed!</h1>
          </div>
          <div class="content">
            <p>Thank you for upgrading to the <strong>${planName}</strong> plan!</p>
            <div class="planCard">
              <h3>${planName} Plan</h3>
              <div>
                <span class="price">$${price}</span>
                <span class="period">/${billingCycle}</span>
              </div>
              <p style="margin: 12px 0 0; color: #059669;">✓ Premium features unlocked</p>
            </div>
            <p>Your subscription is now active and you can start enjoying all premium features immediately.</p>
            <p style="text-align: center; margin-top: 24px;">
              <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 10px 20px; background: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Go to Dashboard</a>
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0;">© 2024 Job Board. All rights reserved. | <a href="${process.env.FRONTEND_URL}/help">Help Center</a></p>
          </div>
        </div>
      </body>
    </html>
    `;
  }

  /**
   * Password Reset Email Template
   */
  static passwordReset(resetLink: string): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; color: #1f2937; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 24px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 16px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280; text-align: center; }
          .cta-button { display: inline-block; padding: 12px 24px; background: #f59e0b; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
          .code-box { background: #f3f4f6; border: 1px solid #e5e7eb; padding: 16px; border-radius: 6px; font-family: monospace; word-break: break-all; margin: 16px 0; }
          a { color: #f59e0b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${resetLink}" class="cta-button">Reset Password</a>
            </div>
            <p>Or copy this link:</p>
            <div class="code-box">${resetLink}</div>
            <p style="color: #6b7280; font-size: 14px;">This link will expire in 24 hours.</p>
            <p style="color: #dc2626; font-size: 14px; margin-top: 20px;"><strong>⚠️ If you didn't request this, please ignore this email and your password will remain unchanged.</strong></p>
          </div>
          <div class="footer">
            <p style="margin: 0;">© 2024 Job Board. All rights reserved. | <a href="${process.env.FRONTEND_URL}/help">Help Center</a></p>
          </div>
        </div>
      </body>
    </html>
    `;
  }

  /**
   * Welcome Email Template
   */
  static welcome(userName: string): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; color: #1f2937; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: white; padding: 24px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 16px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280; text-align: center; }
          .feature-list { list-style: none; padding: 0; margin: 16px 0; }
          .feature-list li { padding: 8px 0; padding-left: 24px; position: relative; }
          .feature-list li:before { content: "✓"; position: absolute; left: 0; color: #3b82f6; font-weight: bold; }
          a { color: #3b82f6; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👋 Welcome to Job Board!</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Welcome to Job Board! We're excited to have you on board. Here's what you can do:</p>
            <ul class="feature-list">
              <li>Browse thousands of job listings</li>
              <li>Create custom job alerts to match your criteria</li>
              <li>Save jobs for later review</li>
              <li>Subscribe to premium plans for exclusive features</li>
              <li>Apply directly to positions</li>
            </ul>
            <p style="text-align: center; margin-top: 24px;">
              <a href="${process.env.FRONTEND_URL}/jobs" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Start Browsing Jobs</a>
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">Have questions? Check out our <a href="${process.env.FRONTEND_URL}/help">help center</a> or <a href="mailto:support@jobboard.com">contact support</a>.</p>
          </div>
          <div class="footer">
            <p style="margin: 0;">© 2024 Job Board. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `;
  }

  /**
   * Application Notification Email Template
   */
  static applicationNotification(
    applicantName: string,
    jobTitle: string,
    applicantEmail: string
  ): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; color: #1f2937; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 24px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 16px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280; text-align: center; }
          .applicantCard { background: #f3f4f6; border-left: 4px solid #8b5cf6; padding: 16px; margin: 16px 0; border-radius: 4px; }
          a { color: #8b5cf6; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Application Received!</h1>
          </div>
          <div class="content">
            <p>You have a new application for the position of <strong>${jobTitle}</strong>.</p>
            <div class="applicantCard">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Applicant Information</p>
              <p style="margin: 0 0 4px; font-size: 16px; font-weight: 600;">📝 ${applicantName}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">📧 ${applicantEmail}</p>
            </div>
            <p style="text-align: center; margin-top: 24px;">
              <a href="${process.env.FRONTEND_URL}/dashboard/applications" style="display: inline-block; padding: 10px 20px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Review Application</a>
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0;">© 2024 Job Board. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `;
  }
}

export default EmailTemplate;
