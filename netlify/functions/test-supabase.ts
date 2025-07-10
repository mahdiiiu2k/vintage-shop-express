import { Handler } from '@netlify/functions';

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
    const { supabase } = await import('../../server/supabase');
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Supabase connection failed", 
          details: error.message 
        }),
      };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true, 
        message: "Supabase Storage connected successfully",
        buckets: data.map(bucket => ({ name: bucket.name, public: bucket.public }))
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Supabase connection failed", 
        details: error instanceof Error ? error.message : "Unknown error" 
      }),
    };
  }
};