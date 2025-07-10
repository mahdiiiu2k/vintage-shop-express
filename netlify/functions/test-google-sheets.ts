import { Handler } from '@netlify/functions';
import { googleSheetsService } from '../../server/googleSheets';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('Testing Google Sheets connection...');
    console.log('Service account email:', process.env.GOOGLE_SHEETS_CLIENT_EMAIL);
    console.log('Sheet ID:', process.env.GOOGLE_SHEETS_SHEET_ID);
    
    const connectionTest = await googleSheetsService.testConnection();
    if (connectionTest) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Google Sheets connection successful",
          serviceAccountEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          sheetId: process.env.GOOGLE_SHEETS_SHEET_ID
        }),
      };
    } else {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Google Sheets connection failed",
          serviceAccountEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          sheetId: process.env.GOOGLE_SHEETS_SHEET_ID
        }),
      };
    }
  } catch (error) {
    console.error('Google Sheets test error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Google Sheets connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
        serviceAccountEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        sheetId: process.env.GOOGLE_SHEETS_SHEET_ID
      }),
    };
  }
};