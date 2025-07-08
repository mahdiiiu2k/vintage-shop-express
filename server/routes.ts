import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";
import path from "path";
import fs from "fs";
import { uploadImageToSupabase, deleteImageFromSupabase } from "./supabase";

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

  // Static file serving for uploaded images (legacy support)
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const httpServer = createServer(app);

  return httpServer;
}
