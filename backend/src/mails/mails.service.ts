import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class MailsService {
    private readonly logger = new Logger(MailsService.name);

    constructor(private readonly settingsService: SettingsService) { }

    private async getTransporter() {
        const settings = await this.settingsService.getSettings();
        let transporter;

        try {
            transporter = nodemailer.createTransport({
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

            // DEBUG: Log effective settings
            const fs = require('fs');
            const host = settings.smtpHost || process.env.SMTP_HOST || 'smtp.ethereal.email';
            const user = settings.smtpUser || process.env.SMTP_USER || 'mock_user';
            const logMessage = `${new Date().toISOString()} - INFO - SMTP Config: Host=${host}, User=${user}, Port=${settings.smtpPort}\n`;
            fs.appendFileSync('smtp_debug.log', logMessage);
        } catch (e) {
            console.error('Failed to initialize transporter or write log', e);
        }

        return transporter;
    }

    async sendMail(to: string, subject: string, html: string) {
        try {
            const settings = await this.settingsService.getSettings();
            const transporter = await this.getTransporter();
            if (!transporter) {
                this.logger.error('Transporter is not initialized. Cannot send email.');
                return;
            }

            const smtpUser = settings.smtpUser || process.env.SMTP_USER || 'mock_user';
            const fromName = settings.smtpFromName || 'Kalsan Auto Parts';
            // FORCE: Use authenticated user as sender to satisfy strict SMTP rules (553 error)
            const fromEmail = smtpUser;

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
            // DEBUG: Write error to file
            try {
                const fs = require('fs');
                const logMessage = `${new Date().toISOString()} - ERROR - Failed to send to ${to}: ${error.message}\n`;
                fs.appendFileSync('smtp_debug.log', logMessage);
            } catch (e) { console.error('Failed to write to log file', e); }
        }
    }

    // specific helper methods for the RFQ flow
    async sendQuoteReceivedNotification(customerEmail: string, quoteId: string) {
        const transporter = await this.getTransporter();
        if (!transporter) return;

        const subject = `Quote Request Received - ${quoteId}`;
        const content = `
            <div style="text-align: center;">
                <div style="display: inline-block; width: 64px; height: 64px; background-color: #eff6ff; border-radius: 50%; line-height: 64px; color: #3b82f6; font-size: 32px; margin-bottom: 20px;">&#128203;</div>
                <h2 style="margin: 0 0 10px; color: #1e293b; font-size: 24px; font-weight: bold;">We've Received Your Request</h2>
                <p style="margin: 0; color: #64748b; font-size: 16px; line-height: 1.5;">Thank you for choosing Kalsan Auto Spare Parts. We've successfully received your inquiry and our inventory specialists are checking the latest availability and pricing for you.</p>
                <div style="margin-top: 20px; display: inline-block; background-color: #f1f5f9; padding: 8px 16px; border-radius: 20px; font-family: monospace; color: #475569; font-weight: bold;">QUOTE ID: #${quoteId}</div>
            </div>
            <div style="margin-top: 30px; background-color: #f8fafc; padding: 20px; border-radius: 8px;">
                <h3 style="margin: 0 0 10px; color: #1e293b; font-size: 16px;">What Happens Next?</h3>
                <ol style="margin: 0; padding-left: 20px; color: #64748b; font-size: 14px; line-height: 1.6;">
                    <li>Our technicians review your vehicle specs to ensure 100% part compatibility.</li>
                    <li>You'll receive an email with a personalized price offer and shipping options.</li>
                </ol>
            </div>
        `;
        const html = await this.wrapEmailTemplate('Quote Request Received', content);
        await this.sendMail(customerEmail, subject, html);
    }

    async sendAdminNewQuoteAlert(quoteId: string) {
        const settings = await this.settingsService.getSettings();
        const adminEmail = settings.contactEmail || process.env.ADMIN_EMAIL || 'admin@kalsan.com';
        const subject = `[URGENT] New Quote Request # ${quoteId}`;
        const content = `
            <div style="text-align: center;">
                <h2 style="margin: 0 0 10px; color: #1e293b; font-size: 24px; font-weight: bold;">New Quote Inquiry</h2>
                <p style="margin: 0; color: #64748b; font-size: 16px; line-height: 1.5;">A new quote request has been submitted on the storefront.</p>
                <div style="margin: 20px 0; font-size: 18px; font-weight: bold; color: #1d4ed8;">ID: #${quoteId}</div>
                <p style="margin-bottom: 20px; color: #64748b;">Please log in to the admin dashboard to process this request and provide pricing.</p>
                <a href="http://localhost:3000/admin/quotes" style="display: inline-block; padding: 12px 24px; background: #1d428a; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">View Inquiries</a>
            </div>
        `;
        const html = await this.wrapEmailTemplate('New Quote Inquiry', content);
        await this.sendMail(adminEmail, subject, html);
    }

    async sendQuoteReadyNotification(quote: any) {
        const { id, items, total_amount, discount, admin_notes, user, guest_email } = quote;
        const recipientEmail = (user && user.email) || guest_email || 'customer@example.com';
        const subject = `Your Quote is Ready! - ${id}`;

        // Calculate subtotal
        const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.unit_price) * item.quantity), 0);
        const discountAmount = subtotal * (discount / 100);

        // Generate Items Rows
        const itemsHtml = items.map((item: any) => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.product?.name || 'Part'}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${Number(item.unit_price).toFixed(2)}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$${(Number(item.unit_price) * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        // Smart Redirect Link: Login -> Profile Quotes
        const actionLink = `${frontendUrl}/auth/login?redirect=/profile/quotes`;

        const content = `
            <div style="text-align: center; padding-bottom: 20px;">
                <div style="display: inline-block; width: 64px; height: 64px; background-color: #eff6ff; border-radius: 50%; line-height: 64px; color: #3b82f6; font-size: 32px; margin-bottom: 20px;">âœ“</div>
                <h2 style="margin: 0 0 10px; color: #1e293b; font-size: 24px; font-weight: bold;">Your Quote is Ready</h2>
                <p style="margin: 0; color: #64748b; font-size: 16px; line-height: 1.5;">We've processed your request. Please review the pricing details below to proceed with your order.</p>
                <div style="margin-top: 20px; display: inline-block; background-color: #f1f5f9; padding: 8px 16px; border-radius: 20px; font-family: monospace; color: #475569; font-weight: bold;">QUOTE ID: #${id}</div>
            </div>

            <!-- Items Table -->
            <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 20px;">
                <thead>
                    <tr style="background-color: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                        <th style="padding: 12px; text-align: left; font-weight: bold; border-radius: 6px 0 0 6px;">Part Description</th>
                        <th style="padding: 12px; text-align: center; font-weight: bold;">Qty</th>
                        <th style="padding: 12px; text-align: right; font-weight: bold;">Unit Price</th>
                        <th style="padding: 12px; text-align: right; font-weight: bold; border-radius: 0 6px 6px 0;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <!-- Totals -->
            <div style="margin-top: 20px; padding: 0 10px;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 100%;">
                            <table role="presentation" style="width: 100%; max-width: 250px; margin-left: auto; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 5px 0; color: #64748b; font-size: 14px;">Subtotal:</td>
                                    <td style="padding: 5px 0; text-align: right; color: #1e293b; font-weight: bold;">$${subtotal.toFixed(2)}</td>
                                </tr>
                                ${discount > 0 ? `
                                <tr>
                                    <td style="padding: 5px 0; color: #ef4444; font-size: 14px;">Discount (${discount}%):</td>
                                    <td style="padding: 5px 0; text-align: right; color: #ef4444; font-weight: bold;">-$${discountAmount.toFixed(2)}</td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td style="padding: 15px 0 5px; color: #1e293b; font-size: 16px; font-weight: bold; border-top: 1px solid #e2e8f0;">Final Total Amount:</td>
                                    <td style="padding: 15px 0 5px; text-align: right; color: #2563eb; font-size: 18px; font-weight: bold; border-top: 1px solid #e2e8f0;">$${Number(total_amount).toFixed(2)}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Admin Note -->
            ${admin_notes ? `
            <div style="margin-top: 30px; background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 0 8px 8px 0;">
                <h3 style="margin: 0 0 10px; color: #1d4ed8; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Note from our team</h3>
                <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6; font-style: italic;">"${admin_notes}"</p>
            </div>
            ` : ''}

            <!-- GTA -->
            <div style="margin-top: 40px; text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; transition: background-color 0.2s;">View Quote in My Profile </a>
                <p style="margin: 15px 0 0; color: #94a3b8; font-size: 12px;">Clicking the button will direct you to login and view your quotes.</p>
            </div>
        `;

        const html = await this.wrapEmailTemplate('Quote Ready', content);
        await this.sendMail(recipientEmail, subject, html);
    }

    async sendOrderShipped(customerEmail: string, orderId: string, trackingNumber: string) {
        const subject = `Your Order has Shipped! - ${orderId}`;
        const content = `
            <div style="text-align: center;">
                <div style="display: inline-block; width: 64px; height: 64px; background-color: #f0fdf4; border-radius: 50%; line-height: 64px; color: #16a34a; font-size: 32px; margin-bottom: 20px;">ðŸšš</div>
                <h2 style="margin: 0 0 10px; color: #1e293b; font-size: 24px; font-weight: bold;">Order Shipped</h2>
                <p style="margin: 0; color: #64748b; font-size: 16px; line-height: 1.5;">Good news! Your order <strong>${orderId}</strong> is on its way.</p>
                <div style="margin-top: 20px; background-color: #f8fafc; padding: 15px; border-radius: 6px; display: inline-block;">
                    <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Tracking Number</div>
                    <div style="font-size: 18px; font-weight: bold; color: #1e293b; margin-top: 5px;">${trackingNumber}</div>
                </div>
                <p style="margin-top: 20px; color: #64748b;">You can track your package on our website.</p>
                <a href="http://localhost:3000/orders/${orderId}" style="display: inline-block; padding: 12px 24px; background: #16a34a; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Track Order</a>
            </div>
        `;
        const html = await this.wrapEmailTemplate('Order Shipped', content);
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
        const content = `
            <div style="text-align: center;">
                <h2 style="margin: 0 0 10px; color: #1e293b; font-size: 24px; font-weight: bold;">Offline Chat Inquiry</h2>
                <p style="margin: 0; color: #64748b; font-size: 16px; line-height: 1.5;">A user tried to chat while no agents were online.</p>
            </div>
            <div style="margin-top: 30px; background-color: #f8fafc; padding: 20px; border-radius: 8px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Name</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; text-align: right;">${data.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Email</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; text-align: right;">${data.email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Team</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; text-align: right;">${data.team}</td>
                    </tr>
                </table>
                <div style="margin-top: 20px;">
                    <div style="font-weight: bold; color: #475569; margin-bottom: 5px;">Message:</div>
                    <div style="background-color: #fff; padding: 15px; border: 1px solid #e2e8f0; border-radius: 4px; color: #334155; line-height: 1.6;">${data.message}</div>
                </div>
                <div style="margin-top: 20px; text-align: center;">
                     <a href="mailto:${data.email}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Reply via Email</a>
                </div>
            </div>
        `;
        const html = await this.wrapEmailTemplate('Offline Chat Inquiry', content);
        await this.sendMail(targetEmail, subject, html);
    }

    private async wrapEmailTemplate(title: string, content: string): Promise<string> {
        const settings = await this.settingsService.getSettings();
        const year = new Date().getFullYear();

        const siteTitle = settings.siteTitle || 'Kalsan Auto Spare Parts';
        const contactEmail = settings.contactEmail || 'sales@kalsanauto.com';
        const contactPhone = settings.contactPhone || '+252 61 5000000'; // Default fallback
        const contactAddress = settings.contactAddress || 'Mogadishu, Somalia';
        const workingHours = settings.workingHours || 'Sat - Thu: 8:00 AM - 6:00 PM';

        // Normalize Logo URL
        let logoUrl = settings.logoDark;
        if (logoUrl && !logoUrl.startsWith('http')) {
            const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
            logoUrl = `${baseUrl}${logoUrl}`;
        }

        const headerContent = logoUrl
            ? `<img src="${logoUrl}" alt="${siteTitle}" style="max-height: 50px; border: 0; outline: none;" />`
            : `<h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">${siteTitle}</h1>`;

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; color: #333;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 0;">
                            <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-top: 20px; margin-bottom: 20px;">
                                <!-- Header -->
                                <tr>
                                    <td style="background-color: #0f172a; padding: 30px 40px; text-align: center;">
                                        ${headerContent}
                                        <p style="margin: 10px 0 0; color: #94a3b8; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">${title}</p>
                                    </td>
                                </tr>

                                <!-- Body Content -->
                                <tr>
                                    <td style="padding: 40px;">
                                        ${content}
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f8fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
                                        <table role="presentation" style="width: 100%;">
                                            <tr>
                                                <td style="width: 50%; vertical-align: top; padding-right: 20px;">
                                                    <h4 style="margin: 0 0 10px; color: #0f172a; font-size: 12px; text-transform: uppercase; font-weight: bold;">Contact Support</h4>
                                                    <p style="margin: 0 0 5px; color: #3b82f6; font-size: 13px;">
                                                        <a href="mailto:${contactEmail}" style="color: #3b82f6; text-decoration: none;">${contactEmail}</a>
                                                    </p>
                                                    <p style="margin: 0; color: #64748b; font-size: 13px;">${contactPhone}</p>
                                                    <p style="margin: 5px 0 0; color: #94a3b8; font-size: 11px;">${contactAddress}</p>
                                                </td>
                                                <td style="width: 50%; vertical-align: top;">
                                                    <h4 style="margin: 0 0 10px; color: #0f172a; font-size: 12px; text-transform: uppercase; font-weight: bold;">Operating Hours</h4>
                                                    <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">${workingHours.replace(/\n/g, '<br>')}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding-top: 30px; text-align: center; color: #94a3b8; font-size: 11px;">
                                                    <p style="margin: 0;">Â© ${year} ${siteTitle}. All rights reserved.</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;
    }
}

