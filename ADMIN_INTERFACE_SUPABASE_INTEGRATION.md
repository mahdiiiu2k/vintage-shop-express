# Admin Interface - Supabase Storage Integration

## What This Does
Your admin interface will now upload images directly to Supabase Storage instead of local files. This ensures images are shared between your admin interface and e-shop properly.

## Implementation Steps

### 1. Add Supabase Client to Your Admin Interface

First, add the Supabase client to your admin interface:

```bash
npm install @supabase/supabase-js
```

### 2. Configure Supabase Client

Add this to your admin interface JavaScript:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

const supabase = createClient(supabaseUrl, supabaseKey)
```

### 3. Image Upload Function

Replace your existing image upload logic with this:

```javascript
async function uploadProductImage(imageFile, productId) {
    try {
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2);
        const fileExtension = imageFile.name.split('.').pop();
        const uniqueFilename = `${timestamp}-${randomString}-${imageFile.name}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(uniqueFilename, imageFile, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(uniqueFilename);

        const publicUrl = publicUrlData.publicUrl;

        console.log('Image uploaded successfully:', publicUrl);
        return {
            success: true,
            publicUrl: publicUrl,
            filename: uniqueFilename
        };

    } catch (error) {
        console.error('Error uploading image:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
```

### 4. Update Your Product Creation/Edit Forms

When creating or editing products, use the upload function and store the public URL:

```javascript
// Example: When user selects image and submits form
async function handleProductSubmit(productData, imageFile) {
    try {
        let imageUrl = '';
        
        if (imageFile) {
            const uploadResult = await uploadProductImage(imageFile, productData.id);
            if (uploadResult.success) {
                imageUrl = uploadResult.publicUrl;
            } else {
                alert('Error uploading image: ' + uploadResult.error);
                return;
            }
        }

        // Include the image URL in your product data
        const productToSave = {
            ...productData,
            image_url: imageUrl
        };

        // Save to database (your existing logic)
        await saveProductToDatabase(productToSave);
        
        console.log('Product saved with image URL:', imageUrl);
        
    } catch (error) {
        console.error('Error saving product:', error);
    }
}
```

### 5. Alternative: Direct API Integration

If you prefer to use the e-shop's API directly (without Supabase client in admin):

```javascript
async function uploadImageViaAPI(imageFile, productId) {
    try {
        // Convert image to base64
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });

        // Send to e-shop API
        const response = await fetch('https://your-eshop-url.replit.app/api/sync-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: imageFile.name,
                imageData: base64,
                productId: productId
            })
        });

        const result = await response.json();
        
        if (result.success) {
            return {
                success: true,
                publicUrl: result.publicUrl
            };
        } else {
            throw new Error(result.error);
        }

    } catch (error) {
        console.error('Error uploading via API:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
```

## Important Setup Steps

### 1. Create Supabase Storage Bucket

In your Supabase dashboard:
1. Go to Storage
2. Create a new bucket called `product-images`
3. Make it public by setting:
   - Public bucket: `true`
   - File size limit: `50MB` (or your preference)
   - Allowed MIME types: `image/jpeg,image/png,image/gif,image/webp`

### 2. Set Bucket Policies

Add these policies to your `product-images` bucket:

```sql
-- Allow public read access
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'product-images');

-- Allow public read access to images
CREATE POLICY "Allow public read access to images" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'product-images');
```

### 3. Update Your Database Schema

Make sure your products table has an `image_url` column:

```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
```

## Testing

1. Upload an image through your admin interface
2. Check that the image appears in your Supabase Storage bucket
3. Verify the image displays correctly in your e-shop
4. Test that the public URL works in a browser

## Benefits of This Approach

✅ **Shared Storage**: Both admin and e-shop access the same images
✅ **Reliable URLs**: Images have permanent public URLs
✅ **Scalable**: Supabase handles CDN and global distribution
✅ **Cost-effective**: Pay only for storage used
✅ **Backup**: Images are safely stored in Supabase cloud

## Troubleshooting

**Images not appearing in e-shop?**
- Check that bucket is public
- Verify the image_url in your database contains the full Supabase URL
- Test the URL directly in browser

**Upload fails?**
- Check your Supabase credentials
- Verify bucket name matches exactly
- Check file size limits
- Ensure proper MIME types are allowed

**CORS errors?**
- Add your admin interface domain to Supabase CORS settings
- Use the API method instead of direct Supabase client

## Next Steps

Once implemented, you can:
1. Upload images in your admin interface
2. They'll automatically appear in your e-shop
3. Images will have permanent, reliable URLs
4. Multiple images per product (just store multiple URLs)