import { google } from 'googleapis';
import type { OrderData } from './googleSheets';

class EmailService {
  private isConfigured: boolean = false;

  constructor() {
    // Simple notification service that logs to console
    this.isConfigured = true;
    console.log('Email notification service configured - notifications will be logged to console');
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

      // Create notification message
      const notificationMessage = `🛍️ NEW ORDER ALERT 🛍️
      
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

This order has been automatically saved to your Google Sheets.`;

      // Display prominent notification in console
      console.log('\n' + '='.repeat(80));
      console.log('🚨 NEW ORDER NOTIFICATION 🚨');
      console.log('='.repeat(80));
      console.log(notificationMessage);
      console.log('='.repeat(80));
      console.log('Check your Google Sheets for complete order details');
      console.log('='.repeat(80) + '\n');
      
      return true;
    } catch (error) {
      console.error('Failed to display order notification:', error);
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

      const testMessage = `🧪 TEST NOTIFICATION 🧪
      
Test Details:
• Date: ${testDate}
• Status: Notification system is working correctly
• Method: Console logging

This is a test to verify order notifications are working.`;

      console.log('\n' + '='.repeat(80));
      console.log('🧪 TEST NOTIFICATION 🧪');
      console.log('='.repeat(80));
      console.log(testMessage);
      console.log('='.repeat(80));
      console.log('Notification system is working correctly!');
      console.log('='.repeat(80) + '\n');

      return true;
    } catch (error) {
      console.error('Test notification failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();