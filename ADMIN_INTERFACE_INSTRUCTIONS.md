# Admin Interface Integration Instructions

## Problem
Your admin interface and e-shop run in separate environments. When you upload images in the admin interface, they aren't automatically available to the e-shop.

## Solution: Add Image Sync to Your Admin Interface

Add this code to your admin interface to automatically sync images to the e-shop when products are created or updated:

### 1. Add this function to your admin interface JavaScript:

```javascript
// Add this to your admin interface code
async function syncImageToEshop(imageFile, filename, productId) {
    try {
        // Convert image file to base64
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = async function(e) {
                const base64Data = e.target.result;
                
                try {
                    const response = await fetch('https://your-eshop-url.replit.app/api/sync-image', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            filename: filename,
                            imageData: base64Data,
                            productId: productId
                        })
                    });
                    
                    const result = await response.json();
                    console.log('Image synced to e-shop:', result);
                    resolve(result);
                } catch (error) {
                    console.error('Failed to sync image to e-shop:', error);
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });
    } catch (error) {
        console.error('Error syncing image:', error);
    }
}
```

### 2. Modify your product creation/update code:

```javascript
// When creating or updating a product with an image:
async function createProduct(productData, imageFile) {
    try {
        // 1. First create/update the product in your database
        const product = await saveProductToDatabase(productData);
        
        // 2. If there's an image, sync it to the e-shop
        if (imageFile) {
            const filename = `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${imageFile.name.split('.').pop()}`;
            
            // Update the product with the correct image path
            product.image_url = `/uploads/${filename}`;
            await updateProductInDatabase(product.id, { image_url: product.image_url });
            
            // Sync the actual image file to e-shop
            await syncImageToEshop(imageFile, filename, product.id);
        }
        
        return product;
    } catch (error) {
        console.error('Error creating product:', error);
    }
}
```

### 3. Replace "your-eshop-url.replit.app" with your actual e-shop URL

Find this line in the code above:
```javascript
const response = await fetch('https://your-eshop-url.replit.app/api/sync-image', {
```

Replace `your-eshop-url.replit.app` with your actual e-shop Replit URL.

### 4. Test the integration:

1. Upload a new product with an image in your admin interface
2. Check that the image appears correctly in your e-shop
3. The console should show "Image synced to e-shop" messages

## Alternative: Manual Image Sync

If you can't modify the admin interface code, you can manually sync existing images by:

1. Getting the image file from your admin interface
2. Converting it to base64
3. Making a POST request to your e-shop's `/api/sync-image` endpoint

## Current Status

Your e-shop is ready to receive synced images. The infrastructure is in place - you just need to implement the sync mechanism in your admin interface.