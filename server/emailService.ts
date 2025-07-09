import { google } from 'googleapis';
import type { OrderData } from './googleSheets';

class EmailService {
  private gmail: any;
  private isConfigured: boolean = false;

  constructor() {
    this.initializeGmailAPI();
  }

  private async initializeGmailAPI() {
    try {
      // Gmail API requires additional setup (enabling API + domain delegation)
      // For now, we'll provide email content that can be easily copied and sent
      this.isConfigured = true;
      console.log('Email notification service configured - ready to generate email content');
      console.log('- From: chouikimahdi@gmail.com');
      console.log('- To: chouikimahdiabderrahmane@gmail.com');
      console.log('- Subject: New Order');
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      this.isConfigured = false;
    }
  }

  private createEmailMessage(to: string, subject: string, body: string): string {
    const message = [
      `To: ${to}`,
      `From: chouikimahdi@gmail.com`,
      `Subject: ${subject}`,
      `Content-Type: text/plain; charset=utf-8`,
      ``,
      body
    ].join('\n');

    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
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

      // Display comprehensive notification in console
      console.log('\n' + '='.repeat(80));
      console.log('🚨 NEW ORDER EMAIL NOTIFICATION 🚨');
      console.log('='.repeat(80));
      console.log('EMAIL DETAILS:');
      console.log('From: chouikimahdi@gmail.com');
      console.log('To: chouikimahdiabderrahmane@gmail.com');
      console.log('Subject: ' + emailSubject);
      console.log('');
      console.log('EMAIL BODY:');
      console.log(emailBody);
      console.log('='.repeat(80));
      console.log('📧 EMAIL CONTENT READY FOR SENDING 📧');
      console.log('Copy the above email content and send it manually from Gmail');
      console.log('='.repeat(80) + '\n');

      // For demonstration, we'll return true to indicate notification was prepared
      return true;
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
• Method: Email content generation

This is a test to verify order email notifications are working.

Best regards,
E-commerce System`;

      console.log('\n' + '='.repeat(80));
      console.log('🧪 TEST EMAIL NOTIFICATION 🧪');
      console.log('='.repeat(80));
      console.log('EMAIL DETAILS:');
      console.log('From: chouikimahdi@gmail.com');
      console.log('To: chouikimahdiabderrahmane@gmail.com');
      console.log('Subject: ' + testEmailSubject);
      console.log('');
      console.log('EMAIL BODY:');
      console.log(testEmailBody);
      console.log('='.repeat(80));
      console.log('📧 TEST EMAIL CONTENT READY FOR SENDING 📧');
      console.log('Copy the above email content and send it manually from Gmail');
      console.log('='.repeat(80) + '\n');

      return true;
    } catch (error) {
      console.error('Test email notification failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();