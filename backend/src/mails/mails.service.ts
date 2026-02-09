import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class MailsService {
    private readonly logger = new Logger(MailsService.name);

    constructor(private readonly settingsService: SettingsService) { }

    private async getTransporter() {
        const settings = await this.settingsService.getSettings();

        return nodemailer.createTransport({
            host: settings.smtpHost || process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: Number(settings.smtpPort || process.env.SMTP_PORT || 587),
            secure: settings.smtpEncryption === 'ssl', // true for 465, false for other ports
            auth: {
                user: settings.smtpUser || process.env.SMTP_USER || 'mock_user',
                pass: settings.smtpPass || process.env.SMTP_PASS || 'mock_pass',
            },
            tls: {
                rejectUnauthorized: false // Often needed for custom SMTP
            }
        });
    }

    async sendMail(to: string, subject: string, html: string) {
        try {
            const settings = await this.settingsService.getSettings();
            const transporter = await this.getTransporter();

            const fromName = settings.smtpFromName || 'Kalsan Auto Parts';
            const fromEmail = settings.smtpFromEmail || 'noreply@kalsan.com';

            this.logger.log(`Sending email to ${to} with subject: ${subject}`);

            await transporter.sendMail({
                from: `"${fromName}" <${fromEmail}>`,
                to,
                subject,
                html
            });

            this.logger.log(`Email successfully sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${to}: ${error.message}`);
        }
    }

    // specific helper methods for the RFQ flow
    async sendQuoteReceivedNotification(customerEmail: string, quoteId: string) {
        const subject = `Quote Request Received - ${quoteId}`;
        const html = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h1 style="color: #1d428a;">Quote Request Received</h1>
                <p>Thank you for choosing Kalsan Auto Spare Parts.</p>
                <p>Your Quote Request <strong>${quoteId}</strong> has been received and is currently being reviewed by our team.</p>
                <p>We will get back to you with pricing as soon as possible.</p>
                <br/>
                <p>Best Regards,</p>
                <p><strong>Kalsan Support Team</strong></p>
            </div>
        `;
        await this.sendMail(customerEmail, subject, html);
    }

    async sendAdminNewQuoteAlert(quoteId: string) {
        const settings = await this.settingsService.getSettings();
        const adminEmail = settings.contactEmail || process.env.ADMIN_EMAIL || 'admin@kalsan.com';
        const subject = `[URGENT] New Quote Request # ${quoteId}`;
        const html = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #1d428a;">New Quote Inquiry</h2>
                <p>A new quote request has been submitted on the storefront.</p>
                <p><strong>Quote ID:</strong> ${quoteId}</p>
                <p>Please log in to the admin dashboard to process this request and provide pricing.</p>
                <a href="http://localhost:3000/admin/quotes" style="display: inline-block; padding: 10px 20px; background: #1d428a; color: #fff; text-decoration: none; border-radius: 5px;">View Inquiries</a>
            </div>
        `;
        await this.sendMail(adminEmail, subject, html);
    }

    async sendQuoteReadyNotification(customerEmail: string, quoteId: string, totalAmount: number) {
        const subject = `Your Quote is Ready! - ${quoteId}`;
        const html = `
            <div style="font-family: sans-serif; padding: 20px;">
                <h1 style="color: #22c55e;">Great News! Your Quote is Ready</h1>
                <p>Pricing for your request <strong>${quoteId}</strong> has been finalized.</p>
                <p><strong>Total Estimated Amount:</strong> $${totalAmount}</p>
                <p>Please visit your profile to view the formal quote and proceed to checkout.</p>
                <a href="http://localhost:3000/quote" style="display: inline-block; padding: 10px 20px; background: #22c55e; color: #fff; text-decoration: none; border-radius: 5px;">View Quote</a>
            </div>
        `;
        await this.sendMail(customerEmail, subject, html);
    }

    async sendOrderShipped(customerEmail: string, orderId: string, trackingNumber: string) {
        const subject = `Your Order has Shipped! - ${orderId}`;
        const html = `
            <div style="font-family: sans-serif; padding: 20px;">
                <h1 style="color: #1d428a;">Order Shipped</h1>
                <p>Good news! Your order <strong>${orderId}</strong> is on its way.</p>
                <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
                <p>You can track your package on our website.</p>
            </div>
        `;
        await this.sendMail(customerEmail, subject, html);
    }

    async sendOfflineChatEmail(data: { name: string; email: string; team: string; message: string }) {
        const settings = await this.settingsService.getSettings();
        let targetEmail = settings.contactEmail || process.env.ADMIN_EMAIL || 'admin@kalsan.com';

        // Team-specific routing
        if (data.team === 'Sales & Marketing') targetEmail = 'sales@kalsanspareparts.com';
        else if (data.team === 'Technical') targetEmail = 'technical@kalsanspareparts.com';
        else if (data.team === 'Support') targetEmail = 'support@kalsanspareparts.com';

        const subject = `[OFFLINE CHAT] ${data.team} Inquiry from ${data.name}`;
        const html = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #1d428a;">Offline Chat Inquiry</h2>
        <p>A user tried to chat while no agents were online.</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Team:</strong> ${data.team}</p>
        <p><strong>Message:</strong> ${data.message}</p>
        <br/>
        <p>Please respond to this user via email.</p>
      </div>
    `;
        await this.sendMail(targetEmail, subject, html);
    }
}
