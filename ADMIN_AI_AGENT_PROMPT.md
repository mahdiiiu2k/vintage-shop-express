# 🤖 AI Agent Prompt for Admin Interface - Supabase Storage Integration

Copy and paste this prompt to your admin interface AI agent to implement image upload with Supabase Storage:

---

## PROMPT FOR ADMIN INTERFACE AI AGENT:

I need you to update my admin interface to use Supabase Storage for product images. Here's what needs to be implemented:

### Current Setup:
- I have a Supabase project with these credentials:
  - SUPABASE_URL: [Your Supabase URL]
  - SUPABASE_ANON_KEY: [Your Supabase Anon Key]
  - SUPABASE_SERVICE_KEY: [Your Supabase Service Key]
- I have a storage bucket called "eshoptest" 
- My e-shop is running at: [Your E-shop URL]

### What I Need You To Do:

1. **Install Supabase Client:**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Create Supabase Configuration:**
   Create a file called `supabase.js` with:
   ```javascript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = 'YOUR_SUPABASE_URL'
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

3. **Update Image Upload Function:**
   Replace my existing image upload logic with this function:
   ```javascript
   async function uploadProductImage(imageFile, productId) {
       try {
           // Generate unique filename
           const timestamp = Date.now();
           const randomString = Math.random().toString(36).substring(2);
           const fileExtension = imageFile.name.split('.').pop();
           const uniqueFilename = `product-${productId}-${timestamp}-${randomString}.${fileExtension}`;
           
           // Upload to Supabase Storage
           const { data, error } = await supabase.storage
               .from('eshoptest')
               .upload(uniqueFilename, imageFile, {
                   cacheControl: '3600',
                   upsert: true
               });

           if (error) {
               throw error;
           }

           // Get public URL
           const { data: publicUrlData } = supabase.storage
               .from('eshoptest')
               .getPublicUrl(uniqueFilename);

           return {
               success: true,
               publicUrl: publicUrlData.publicUrl,
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

4. **Update Product Form Handler:**
   In my product creation/editing form, update the submit handler to:
   ```javascript
   async function handleProductSubmit(event) {
       event.preventDefault();
       
       // Get form data
       const formData = new FormData(event.target);
       const productData = Object.fromEntries(formData);
       const imageFile = event.target.querySelector('input[type="file"]').files[0];
       
       try {
           let imageUrl = '';
           
           if (imageFile) {
               const uploadResult = await uploadProductImage(imageFile, productData.id || 'new');
               if (uploadResult.success) {
                   imageUrl = uploadResult.publicUrl;
               } else {
                   alert('Error uploading image: ' + uploadResult.error);
                   return;
               }
           }

           // Include the image URL in product data
           const productToSave = {
               ...productData,
               image_url: imageUrl
           };

           // Save to database (your existing save logic)
           await saveProductToDatabase(productToSave);
           
           alert('Product saved successfully!');
           
       } catch (error) {
           console.error('Error saving product:', error);
           alert('Error saving product: ' + error.message);
       }
   }
   ```

5. **Add Image Preview:**
   Add this function to show image previews:
   ```javascript
   function handleImagePreview(event) {
       const file = event.target.files[0];
       if (file) {
           const reader = new FileReader();
           reader.onload = function(e) {
               const preview = document.getElementById('image-preview');
               if (preview) {
                   preview.src = e.target.result;
                   preview.style.display = 'block';
               }
           };
           reader.readAsDataURL(file);
       }
   }
   ```

6. **Update HTML Form:**
   Make sure your product form includes:
   ```html
   <form onsubmit="handleProductSubmit(event)">
       <input type="text" name="name" placeholder="Product Name" required>
       <input type="number" name="price" placeholder="Price" step="0.01" required>
       <textarea name="description" placeholder="Description"></textarea>
       <input type="text" name="category" placeholder="Category">
       <input type="file" accept="image/*" onchange="handleImagePreview(event)">
       <img id="image-preview" style="display: none; max-width: 200px; margin: 10px 0;">
       <button type="submit">Save Product</button>
   </form>
   ```

### Requirements:
- Images should be uploaded to the "eshoptest" bucket
- Each image should have a unique filename
- Store the full Supabase public URL in the database
- Add error handling for failed uploads
- Show image previews before upload
- Test that images appear correctly in the e-shop

### Testing:
After implementation:
1. Upload an image through the admin interface
2. Check that it appears in Supabase Storage bucket "eshoptest"
3. Verify the image displays in the e-shop
4. Test that the URL works directly in browser

### Important Notes:
- The bucket name is "eshoptest" (not "product-images")
- Use the full public URL from Supabase (starts with your-project.supabase.co/storage/v1/object/public/)
- Images should be accessible without authentication
- Handle file size limits (max 50MB)
- Support common image formats: JPEG, PNG, GIF, WebP

Make sure to test thoroughly and confirm images appear in both the admin interface and the e-shop.

---

## ADDITIONAL CONTEXT FOR AI AGENT:

The e-shop expects the `image_url` field in the database to contain the full public URL from Supabase Storage. When you save a product, make sure the `image_url` field contains something like:
`https://your-project.supabase.co/storage/v1/object/public/eshoptest/product-123-1234567890-abc123.jpg`

This will ensure images display correctly in the e-shop without any additional configuration needed.