# Netlify Deployment Guide for VintageStyle E-commerce

## Quick Setup

### 1. Netlify Configuration (Already Done)
✅ `netlify.toml` - Netlify configuration file  
✅ `netlify/functions/` - Serverless functions for your backend  
✅ `netlify/_headers` - CORS headers configuration  

### 2. Environment Variables (YOU NEED TO ADD THESE)

In your Netlify dashboard, go to **Site settings > Environment variables** and add:

#### Database Configuration
```
DATABASE_URL=your_postgresql_connection_string
```

#### Supabase Configuration (for image uploads)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Google Sheets Configuration (for order management)
```
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
GOOGLE_SHEETS_PRIVATE_KEY=your_private_key_with_newlines
GOOGLE_SHEETS_SHEET_ID=your_google_sheet_id
```

#### Email Configuration (for notifications)
```
GMAIL_USER=chouikimahdi@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
```

### 3. Deployment Settings

Use these exact settings in Netlify:

- **Build command**: `vite build`
- **Publish directory**: `dist/public`
- **Functions directory**: `netlify/functions`
- **Base directory**: Leave empty

### 4. What's Been Converted

Your Express.js backend has been converted to Netlify Functions:

- `POST /api/submit-order` → Netlify Function for orders
- `GET/POST /api/products` → Netlify Function for product management  
- `POST /api/contact-message` → Netlify Function for contact forms
- `POST /api/sync-image` → Netlify Function for image uploads
- `GET /api/test-*` → Netlify Functions for testing connections

### 5. Benefits of This Setup

✅ **No "sleeping" issues** - Netlify Functions wake up instantly  
✅ **Free tier available** - 100,000 function invocations per month  
✅ **Global CDN** - Fast loading worldwide  
✅ **Automatic HTTPS** - Secure by default  
✅ **No health check failures** - Functions are stateless  

### 6. Test Your Deployment

After deployment, test these URLs:
- `https://your-site.netlify.app/api/products` - Should show your products
- `https://your-site.netlify.app/api/test-supabase` - Should confirm Supabase connection
- `https://your-site.netlify.app/api/test-google-sheets` - Should confirm Google Sheets

## Important Notes

1. **Database**: Your PostgreSQL database will work exactly the same
2. **Images**: Supabase Storage will handle all image uploads
3. **Orders**: Google Sheets integration will work exactly the same
4. **Emails**: Gmail notifications will work exactly the same

The main difference is that your backend now runs as serverless functions instead of a continuous Express server, which actually makes it more reliable and faster!