import { Handler } from '@netlify/functions';
import { storage } from '../../server/storage';
import { insertProductSchema } from '../../shared/schema';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const path = event.path.replace('/api/', '');
    const segments = path.split('/');
    const method = event.httpMethod;

    // GET /api/products
    if (method === 'GET' && segments[0] === 'products' && segments.length === 1) {
      const products = await storage.getProducts();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products),
      };
    }

    // GET /api/products/:id
    if (method === 'GET' && segments[0] === 'products' && segments[1]) {
      const id = parseInt(segments[1]);
      const product = await storage.getProduct(id);
      if (!product) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Product not found' }),
        };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(product),
      };
    }

    // POST /api/products
    if (method === 'POST' && segments[0] === 'products' && segments.length === 1) {
      const validatedData = insertProductSchema.parse(JSON.parse(event.body || '{}'));
      const product = await storage.createProduct(validatedData);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(product),
      };
    }

    // PUT /api/products/:id
    if (method === 'PUT' && segments[0] === 'products' && segments[1]) {
      const id = parseInt(segments[1]);
      const validatedData = insertProductSchema.partial().parse(JSON.parse(event.body || '{}'));
      const product = await storage.updateProduct(id, validatedData);
      if (!product) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Product not found' }),
        };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(product),
      };
    }

    // DELETE /api/products/:id
    if (method === 'DELETE' && segments[0] === 'products' && segments[1]) {
      const id = parseInt(segments[1]);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Product not found' }),
        };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Product deleted successfully' }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('Error in products function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};