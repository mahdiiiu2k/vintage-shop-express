import { Handler } from '@netlify/functions';
import { googleSheetsService, type OrderData } from '../../server/googleSheets';
import { emailService } from '../../server/emailService';
import { z } from 'zod';

const orderSubmissionSchema = z.object({
  billingDetails: z.object({
    name: z.string().min(1, "Name is required"),
    wilaya: z.string().min(1, "Wilaya is required"),
    city: z.string().min(1, "City is required"),
    streetAddress: z.string().min(1, "Street address is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.string().email("Valid email is required"),
    orderNotes: z.string().optional()
  }),
  items: z.array(z.object({
    product: z.object({
      id: z.number(),
      name: z.string(),
      price: z.string(),
      category: z.string().optional(),
      description: z.string().optional()
    }),
    selectedSize: z.string().min(1, "Size is required"),
    selectedColor: z.string().min(1, "Color is required"),
    quantity: z.number().min(1, "Quantity must be at least 1")
  }))
});

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
    const validatedData = orderSubmissionSchema.parse(JSON.parse(event.body || '{}'));
    
    // Test Google Sheets connection first
    const connectionTest = await googleSheetsService.testConnection();
    if (!connectionTest) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Google Sheets connection failed",
          details: "Please check your Google Sheets configuration"
        }),
      };
    }

    // Process each item in the order
    const results = [];
    for (const item of validatedData.items) {
      const orderData: OrderData = {
        customerName: validatedData.billingDetails.name,
        wilaya: validatedData.billingDetails.wilaya,
        city: validatedData.billingDetails.city,
        streetAddress: validatedData.billingDetails.streetAddress,
        phone: validatedData.billingDetails.phone,
        email: validatedData.billingDetails.email,
        productName: item.product.name,
        size: item.selectedSize,
        color: item.selectedColor,
        price: item.product.price,
        quantity: item.quantity,
        orderNotes: validatedData.billingDetails.orderNotes || '',
        orderDate: new Date().toISOString()
      };

      try {
        // Add order to Google Sheets
        await googleSheetsService.addOrder(orderData);
        
        // Send email notification
        const emailSent = await emailService.sendOrderNotification(orderData);
        
        results.push({ 
          success: true, 
          productName: item.product.name,
          message: "Order added to Google Sheets successfully",
          emailSent: emailSent
        });
      } catch (error) {
        console.error("Error processing order:", error);
        results.push({ 
          success: false, 
          productName: item.product.name,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    // Check if any orders failed
    const failedOrders = results.filter(r => !r.success);
    if (failedOrders.length > 0) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Some orders failed to process",
          results: results
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Order submitted successfully",
        results: results
      }),
    };

  } catch (error) {
    console.error("Error submitting order:", error);
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Invalid order data",
          details: error.errors
        }),
      };
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to submit order",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
    };
  }
};