import { google } from 'googleapis';

async function testGoogleSheets() {
    console.log('=== Google Sheets Debug Test ===');
    console.log('Service Account Email:', process.env.GOOGLE_SHEETS_CLIENT_EMAIL);
    console.log('Sheet ID:', process.env.GOOGLE_SHEETS_SHEET_ID);
    
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        
        console.log('\n1. Testing basic connection...');
        const response = await sheets.spreadsheets.get({
            spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
        });
        
        console.log('✅ Connection successful!');
        console.log('Sheet title:', response.data.properties.title);
        
        console.log('\n2. Testing read access...');
        const readResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
            range: 'A1:A1',
        });
        
        console.log('✅ Read access successful!');
        
        console.log('\n3. Testing write access...');
        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
            range: 'A1',
            valueInputOption: 'RAW',
            requestBody: {
                values: [['Test Connection']],
            },
        });
        
        console.log('✅ Write access successful!');
        console.log('\n🎉 All tests passed! Google Sheets integration is working correctly.');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.code === 403) {
            console.error('\n📝 To fix this:');
            console.error('1. Open your Google Sheet');
            console.error('2. Click "Share" button');
            console.error('3. Add this email as Editor:', process.env.GOOGLE_SHEETS_CLIENT_EMAIL);
            console.error('4. Save the sharing settings');
        }
    }
}

testGoogleSheets();