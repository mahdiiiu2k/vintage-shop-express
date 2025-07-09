import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";
import path from "path";
import fs from "fs";
import { uploadImageToSupabase, deleteImageFromSupabase } from "./supabase";
import { googleSheetsService, type OrderData } from "./googleSheets";
import { emailService, type ContactMessageData } from "./emailService";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(400).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // File upload endpoint to receive images from admin interface - now using Supabase Storage
  app.post("/api/sync-image", async (req, res) => {
    try {
      const { filename, imageData, productId } = req.body;
      
      if (!filename || !imageData) {
        return res.status(400).json({ error: "Filename and imageData are required" });
      }

      // Generate unique filename to avoid conflicts
      const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}-${path.basename(filename)}`;
      
      // Upload to Supabase Storage
      const { publicUrl, error } = await uploadImageToSupabase(imageData, uniqueFilename);
      
      if (error) {
        console.error("Error uploading to Supabase:", error);
        return res.status(500).json({ error: `Failed to upload image: ${error}` });
      }

      console.log(`Image uploaded to Supabase successfully: ${uniqueFilename} for product ${productId || 'unknown'}`);
      
      res.json({ 
        success: true, 
        imagePath: publicUrl,
        publicUrl: publicUrl,
        message: "Image uploaded to Supabase Storage successfully"
      });
    } catch (error) {
      console.error("Error syncing image:", error);
      res.status(500).json({ error: "Failed to sync image" });
    }
  });

  // CORS-enabled file upload endpoint for admin interface
  app.post("/api/upload-image", (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    // Forward to sync endpoint
    req.url = '/api/sync-image';
    app._router.handle(req, res);
  });

  // Batch upload endpoint for multiple images
  app.post("/api/batch-upload-images", async (req, res) => {
    try {
      const { images } = req.body;
      
      if (!Array.isArray(images)) {
        return res.status(400).json({ error: "Images array is required" });
      }

      const results = [];
      
      for (const imageData of images) {
        const { filename, imageData: data, productId } = imageData;
        
        if (!filename || !data) {
          results.push({ 
            filename, 
            success: false, 
            error: "Filename and imageData are required" 
          });
          continue;
        }

        // Generate unique filename
        const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}-${path.basename(filename)}`;
        
        // Upload to Supabase Storage
        const { publicUrl, error } = await uploadImageToSupabase(data, uniqueFilename);
        
        if (error) {
          results.push({ 
            filename, 
            success: false, 
            error: error 
          });
        } else {
          results.push({ 
            filename, 
            success: true, 
            publicUrl: publicUrl,
            originalFilename: filename
          });
        }
      }

      res.json({ 
        success: true, 
        results: results,
        message: `Processed ${results.length} images`
      });
    } catch (error) {
      console.error("Error in batch upload:", error);
      res.status(500).json({ error: "Failed to process batch upload" });
    }
  });

  // Image proxy endpoint - now handles Supabase Storage URLs
  app.get("/api/image-proxy", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: "URL parameter is required" });
      }

      // If it's a Supabase Storage URL, return it directly (already public)
      if (url.includes('supabase.co/storage/v1/object/public/')) {
        return res.json({ imageUrl: url });
      }

      // Legacy: If it's a local upload path, serve from uploads directory (for backward compatibility)
      if (url.startsWith('/uploads/')) {
        const imagePath = path.join(process.cwd(), url);
        if (fs.existsSync(imagePath)) {
          return res.sendFile(imagePath);
        } else {
          return res.status(404).json({ error: "Image not found" });
        }
      }

      // For external URLs, just return the URL
      res.json({ imageUrl: url });
    } catch (error) {
      console.error("Error in image proxy:", error);
      res.status(500).json({ error: "Failed to serve image" });
    }
  });

  // Test endpoint to verify Supabase Storage connection
  app.get("/api/test-supabase", async (req, res) => {
    try {
      const { supabase } = await import("./supabase");
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        return res.status(500).json({ 
          error: "Supabase connection failed", 
          details: error.message 
        });
      }
      
      res.json({ 
        success: true, 
        message: "Supabase Storage connected successfully",
        buckets: data.map(bucket => ({ name: bucket.name, public: bucket.public }))
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Supabase connection failed", 
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Endpoint to create bucket if it doesn't exist
  app.post("/api/create-bucket", async (req, res) => {
    try {
      const { ensureBucketExists } = await import("./supabase");
      const { bucketName = 'eshoptest' } = req.body;
      
      const success = await ensureBucketExists(bucketName);
      
      if (success) {
        res.json({ 
          success: true, 
          message: `Bucket '${bucketName}' is ready`,
          bucketName 
        });
      } else {
        res.status(500).json({ 
          error: "Failed to create bucket", 
          details: "Check your Supabase permissions" 
        });
      }
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to create bucket", 
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Order submission schema
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

  // Order submission endpoint
  app.post("/api/submit-order", async (req, res) => {
    try {
      const validatedData = orderSubmissionSchema.parse(req.body);
      
      // Test Google Sheets connection first
      const connectionTest = await googleSheetsService.testConnection();
      if (!connectionTest) {
        return res.status(500).json({ 
          error: "Google Sheets connection failed",
          details: "Please check your Google Sheets configuration"
        });
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
        return res.status(500).json({
          error: "Some orders failed to process",
          results: results
        });
      }

      res.json({
        success: true,
        message: "Order submitted successfully",
        results: results
      });

    } catch (error) {
      console.error("Error submitting order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid order data",
          details: error.errors
        });
      }
      res.status(500).json({
        error: "Failed to submit order",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Test Google Sheets connection endpoint
  app.get("/api/test-google-sheets", async (req, res) => {
    try {
      console.log('Testing Google Sheets connection...');
      console.log('Service account email:', process.env.GOOGLE_SHEETS_CLIENT_EMAIL);
      console.log('Sheet ID:', process.env.GOOGLE_SHEETS_SHEET_ID);
      
      const connectionTest = await googleSheetsService.testConnection();
      if (connectionTest) {
        res.json({
          success: true,
          message: "Google Sheets connection successful",
          serviceAccountEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          sheetId: process.env.GOOGLE_SHEETS_SHEET_ID
        });
      } else {
        res.status(500).json({
          error: "Google Sheets connection failed",
          serviceAccountEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          sheetId: process.env.GOOGLE_SHEETS_SHEET_ID
        });
      }
    } catch (error) {
      console.error('Google Sheets test error:', error);
      res.status(500).json({
        error: "Google Sheets connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
        serviceAccountEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        sheetId: process.env.GOOGLE_SHEETS_SHEET_ID
      });
    }
  });

  // Contact message schema
  const contactMessageSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required").optional().or(z.literal("")),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(1, "Message is required")
  });

  // Contact message submission endpoint
  app.post("/api/contact-message", async (req, res) => {
    try {
      const validatedData = contactMessageSchema.parse(req.body);
      
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
        res.json({
          success: true,
          message: "Message sent successfully"
        });
      } else {
        res.status(500).json({
          error: "Failed to send message",
          details: "Email notification could not be sent"
        });
      }

    } catch (error) {
      console.error("Error processing contact message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid contact message data",
          details: error.errors
        });
      }
      res.status(500).json({
        error: "Failed to process contact message",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Test notification service endpoint
  app.get("/api/test-notifications", async (req, res) => {
    try {
      console.log('Testing email notification service...');
      console.log('Google service account configured:', !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL);
      
      const emailTest = await emailService.testEmailService();
      if (emailTest) {
        res.json({
          success: true,
          message: "Email notification service test successful - check your email at chouikimahdiabderrahmane@gmail.com",
          serviceAccount: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          emailConfigured: emailTest
        });
      } else {
        res.status(500).json({
          error: "Email notification service test failed",
          serviceAccount: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          emailConfigured: emailTest
        });
      }
    } catch (error) {
      console.error('Email notification service test error:', error);
      res.status(500).json({
        error: "Email notification service test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        serviceAccount: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        emailConfigured: false
      });
    }
  });

  // Static file serving for uploaded images (legacy support)
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const httpServer = createServer(app);

  return httpServer;
}
