import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper function to ensure bucket exists
export async function ensureBucketExists(bucketName: string = 'eshoptest'): Promise<boolean> {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }

    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create bucket
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 50 * 1024 * 1024 // 50MB
      });

      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }

      console.log(`Bucket '${bucketName}' created successfully`);
    }

    return true;
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    return false;
  }
}

// Helper function to upload image to Supabase Storage
export async function uploadImageToSupabase(
  imageData: string, 
  filename: string, 
  bucketName: string = 'eshoptest'
): Promise<{ publicUrl: string; error?: string }> {
  try {
    // Ensure bucket exists
    const bucketReady = await ensureBucketExists(bucketName);
    if (!bucketReady) {
      return { publicUrl: '', error: 'Failed to create or access bucket' };
    }

    // Convert base64 to buffer
    let buffer: Buffer;
    
    if (imageData.startsWith('data:')) {
      // Handle base64 data URLs
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
    } else if (imageData.startsWith('http')) {
      // Fetch from external URL
      const response = await fetch(imageData);
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      // Direct binary data
      buffer = Buffer.from(imageData, 'binary');
    }

    // Determine content type from filename or data
    let contentType = 'image/jpeg';
    if (filename.toLowerCase().includes('.png')) contentType = 'image/png';
    if (filename.toLowerCase().includes('.gif')) contentType = 'image/gif';
    if (filename.toLowerCase().includes('.webp')) contentType = 'image/webp';
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filename, buffer, {
        contentType: contentType,
        upsert: true // Replace if exists
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return { publicUrl: '', error: error.message };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filename);

    return { publicUrl: publicUrlData.publicUrl };
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    return { publicUrl: '', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Helper function to delete image from Supabase Storage
export async function deleteImageFromSupabase(
  filename: string, 
  bucketName: string = 'eshoptest'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filename]);

    if (error) {
      console.error('Supabase delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting from Supabase:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}