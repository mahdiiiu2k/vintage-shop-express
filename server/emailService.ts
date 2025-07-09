import nodemailer from 'nodemailer';
import type { OrderData } from './googleSheets';

class EmailService {
  private transporter: nodemailer.Transporter;
  private isConfigured: boolean = false;

  constructor() {
    this.initializeEmailService();
  }

  private async initializeEmailService() {
    try {
      // Configure SMTP with Gmail App Password
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'chouikimahdi@gmail.com',
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      // Test the connection
      await this.transporter.verify();
      
      this.isConfigured = true;
      console.log('Gmail SMTP configured successfully for automatic email sending');
      console.log('- From: chouikimahdi@gmail.com');
      console.log('- To: chouikimahdiabderrahmane@gmail.com');
      console.log('- Subject: New Order');
    } catch (error) {
      console.error('Failed to initialize Gmail SMTP:', error);
      this.isConfigured = false;
    }
  }



  async sendOrderNotification(orderData: OrderData): Promise<boolean> {
    try {
      const formattedDate = new Date(orderData.orderDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Create email content
      const emailSubject = 'New Order';
      const emailBody = `New Order Alert!

Order Details:
• Date: ${formattedDate}
• Product: ${orderData.productName}
• Size: ${orderData.size}
• Color: ${orderData.color}
• Quantity: ${orderData.quantity}
• Price: ${orderData.price}

Customer Information:
• Name: ${orderData.customerName}
• Phone: ${orderData.phone}
• Email: ${orderData.email}
• Wilaya: ${orderData.wilaya}
• City: ${orderData.city}
• Address: ${orderData.streetAddress}
${orderData.orderNotes ? `• Notes: ${orderData.orderNotes}` : ''}

This order has been automatically saved to your Google Sheets.

Best regards,
E-commerce System`;

      // Display notification in console
      console.log('\n' + '='.repeat(80));
      console.log('🚨 NEW ORDER EMAIL NOTIFICATION 🚨');
      console.log('='.repeat(80));
      console.log('Sending email automatically...');
      console.log('From: chouikimahdi@gmail.com');
      console.log('To: chouikimahdiabderrahmane@gmail.com');
      console.log('Subject: ' + emailSubject);
      console.log('='.repeat(80));

      // Send email automatically through Gmail SMTP
      if (this.isConfigured) {
        try {
          const mailOptions = {
            from: 'chouikimahdi@gmail.com',
            to: 'chouikimahdiabderrahmane@gmail.com',
            subject: emailSubject,
            text: emailBody
          };

          const info = await this.transporter.sendMail(mailOptions);

          console.log('✅ Email sent successfully via Gmail SMTP!');
          console.log('Message ID:', info.messageId);
          console.log('='.repeat(80) + '\n');
          return true;
        } catch (emailError) {
          console.error('❌ Failed to send email via Gmail SMTP:', emailError);
          console.log('Email content:');
          console.log(emailBody);
          console.log('='.repeat(80) + '\n');
          return false;
        }
      } else {
        console.log('❌ Gmail SMTP not configured - email not sent');
        console.log('='.repeat(80) + '\n');
        return false;
      }
    } catch (error) {
      console.error('Failed to prepare order notification:', error);
      return false;
    }
  }

  async testEmailService(): Promise<boolean> {
    try {
      const testDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const testEmailSubject = 'Test Email - New Order System';
      const testEmailBody = `Test Email Notification

Test Details:
• Date: ${testDate}
• Status: Email notification system is working correctly
• Method: Gmail SMTP automatic sending

This is a test to verify order email notifications are working.

Best regards,
E-commerce System`;

      console.log('\n' + '='.repeat(80));
      console.log('🧪 TEST EMAIL NOTIFICATION 🧪');
      console.log('='.repeat(80));
      console.log('Sending test email automatically...');
      console.log('From: chouikimahdi@gmail.com');
      console.log('To: chouikimahdiabderrahmane@gmail.com');
      console.log('Subject: ' + testEmailSubject);
      console.log('='.repeat(80));

      // Send test email automatically through Gmail SMTP
      if (this.isConfigured) {
        try {
          const mailOptions = {
            from: 'chouikimahdi@gmail.com',
            to: 'chouikimahdiabderrahmane@gmail.com',
            subject: testEmailSubject,
            text: testEmailBody
          };

          const info = await this.transporter.sendMail(mailOptions);

          console.log('✅ Test email sent successfully via Gmail SMTP!');
          console.log('Message ID:', info.messageId);
          console.log('='.repeat(80) + '\n');
          return true;
        } catch (emailError) {
          console.error('❌ Failed to send test email via Gmail SMTP:', emailError);
          console.log('Email content:');
          console.log(testEmailBody);
          console.log('='.repeat(80) + '\n');
          return false;
        }
      } else {
        console.log('❌ Gmail SMTP not configured - test email not sent');
        console.log('='.repeat(80) + '\n');
        return false;
      }
    } catch (error) {
      console.error('Test email notification failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();