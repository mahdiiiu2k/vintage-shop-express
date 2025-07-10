import { Handler } from '@netlify/functions';
import { emailService } from '../../server/emailService';
import { z } from 'zod';

const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required")
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
    const validatedData = contactMessageSchema.parse(JSON.parse(event.body || '{}'));
    
    // Prepare contact message data
    const contactData = {
      name: validatedData.name,
      email: validatedData.email || '',
      phone: validatedData.phone || '',
      subject: validatedData.subject || '',
      message: validatedData.message,
      timestamp: new Date().toISOString()
    };

    // Send email notification
    const emailSent = await emailService.sendContactMessage(contactData);
    
    if (emailSent) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Message sent successfully"
        }),
      };
    } else {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Failed to send message",
          details: "Email notification could not be sent"
        }),
      };
    }

  } catch (error) {
    console.error("Error processing contact message:", error);
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Invalid contact message data",
          details: error.errors
        }),
      };
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to process contact message",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
    };
  }
};