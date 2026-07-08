import nodemailer from "nodemailer";
import { EmailTemplate } from "./email.templates";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Email Service for sending emails via Nodemailer
 */
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize Nodemailer transporter
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Send email
   */
  async send(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        ...options,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${options.to}`);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error}`);
    }
  }

  /**
   * Send job alert notification email
   */
  async sendJobAlertEmail(
    userEmail: string,
    alertName: string,
    jobs: any[]
  ): Promise<void> {
    const html = EmailTemplate.jobAlert(alertName, jobs);
    const subject = `${alertName} - New Job Opportunities`;

    await this.send({
      to: userEmail,
      subject,
      html,
    });
  }

  /**
   * Send subscription confirmation email
   */
  async sendSubscriptionConfirmationEmail(
    userEmail: string,
    planName: string,
    price: number,
    billingCycle: string
  ): Promise<void> {
    const html = EmailTemplate.subscriptionConfirmation(
      planName,
      price,
      billingCycle
    );
    const subject = `Subscription Confirmed - ${planName}`;

    await this.send({
      to: userEmail,
      subject,
      html,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    userEmail: string,
    resetLink: string
  ): Promise<void> {
    const html = EmailTemplate.passwordReset(resetLink);
    const subject = "Reset Your Password";

    await this.send({
      to: userEmail,
      subject,
      html,
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(userName: string, userEmail: string): Promise<void> {
    const html = EmailTemplate.welcome(userName);
    const subject = "Welcome to Job Board";

    await this.send({
      to: userEmail,
      subject,
      html,
    });
  }

  /**
   * Send company application notification
   */
  async sendApplicationNotificationEmail(
    companyEmail: string,
    applicantName: string,
    jobTitle: string,
    applicantEmail: string
  ): Promise<void> {
    const html = EmailTemplate.applicationNotification(
      applicantName,
      jobTitle,
      applicantEmail
    );
    const subject = `New Application for ${jobTitle}`;

    await this.send({
      to: companyEmail,
      subject,
      html,
    });
  }

  /**
   * Verify transporter connection
   */
  async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log("Email transporter verified successfully");
    } catch (error) {
      console.error("Email transporter verification failed:", error);
      throw error;
    }
  }
}

export default new EmailService();
