import { Handler } from '@netlify/functions';
import { uploadImageToSupabase } from '../../server/supabase';
import path from 'path';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { filename, imageData, productId } = JSON.parse(event.body || '{}');
    
    if (!filename || !imageData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Filename and imageData are required" }),
      };
    }

    // Generate unique filename to avoid conflicts
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}-${path.basename(filename)}`;
    
    // Upload to Supabase Storage
    const { publicUrl, error } = await uploadImageToSupabase(imageData, uniqueFilename);
    
    if (error) {
      console.error("Error uploading to Supabase:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: `Failed to upload image: ${error}` }),
      };
    }

    console.log(`Image uploaded to Supabase successfully: ${uniqueFilename} for product ${productId || 'unknown'}`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true, 
        imagePath: publicUrl,
        publicUrl: publicUrl,
        message: "Image uploaded to Supabase Storage successfully"
      }),
    };
  } catch (error) {
    console.error("Error syncing image:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to sync image" }),
    };
  }
};