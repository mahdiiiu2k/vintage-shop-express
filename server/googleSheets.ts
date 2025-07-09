import { google } from 'googleapis';

interface OrderData {
  customerName: string;
  wilaya: string;
  city: string;
  streetAddress: string;
  phone: string;
  email: string;
  productName: string;
  size: string;
  color: string;
  price: string;
  quantity: number;
  orderNotes?: string;
  orderDate: string;
}

class GoogleSheetsService {
  private sheets: any;
  private sheetId: string;

  constructor() {
    this.sheetId = process.env.GOOGLE_SHEETS_SHEET_ID || '';
    
    if (!this.sheetId) {
      throw new Error('GOOGLE_SHEETS_SHEET_ID is required');
    }

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async initializeSheet() {
    try {
      // Check if sheet exists and has headers
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'A1:M1',
      });

      const headers = response.data.values?.[0];
      const expectedHeaders = [
        'Order Date',
        'Customer Name',
        'Wilaya',
        'City',
        'Street Address',
        'Phone',
        'Email',
        'Product Name',
        'Size',
        'Color',
        'Price',
        'Quantity',
        'Order Notes'
      ];

      // If no headers or headers don't match, add them
      if (!headers || headers.length !== expectedHeaders.length) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.sheetId,
          range: 'A1:M1',
          valueInputOption: 'RAW',
          requestBody: {
            values: [expectedHeaders],
          },
        });
      }
    } catch (error) {
      console.error('Error initializing Google Sheet:', error);
      throw error;
    }
  }

  async addOrder(orderData: OrderData): Promise<void> {
    try {
      // Ensure sheet is initialized
      await this.initializeSheet();

      const values = [
        orderData.orderDate,
        orderData.customerName,
        orderData.wilaya,
        orderData.city,
        orderData.streetAddress,
        orderData.phone,
        orderData.email,
        orderData.productName,
        orderData.size,
        orderData.color,
        orderData.price,
        orderData.quantity.toString(),
        orderData.orderNotes || ''
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        range: 'A:M',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [values],
        },
      });

      console.log('Order added to Google Sheets successfully');
    } catch (error) {
      console.error('Error adding order to Google Sheets:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.sheetId,
      });
      return !!response.data;
    } catch (error) {
      console.error('Google Sheets connection test failed:', error);
      return false;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
export type { OrderData };