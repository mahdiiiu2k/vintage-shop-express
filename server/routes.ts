import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";
import path from "path";
import fs from "fs";

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

  // File upload endpoint to receive images from admin interface
  app.post("/api/sync-image", async (req, res) => {
    try {
      const { filename, imageData, productId } = req.body;
      
      if (!filename || !imageData) {
        return res.status(400).json({ error: "Filename and imageData are required" });
      }

      const imagePath = path.join(process.cwd(), 'uploads', path.basename(filename));
      
      // Handle base64 encoded image data
      if (imageData.startsWith('data:')) {
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(imagePath, Buffer.from(base64Data, 'base64'));
      } else if (imageData.startsWith('http')) {
        // Fetch from external URL and save locally
        const response = await fetch(imageData);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(imagePath, Buffer.from(buffer));
      } else {
        // Direct binary data
        fs.writeFileSync(imagePath, Buffer.from(imageData, 'binary'));
      }

      console.log(`Image synced successfully: ${filename} for product ${productId || 'unknown'}`);
      
      res.json({ 
        success: true, 
        imagePath: `/uploads/${path.basename(filename)}`,
        message: "Image synchronized to e-shop successfully"
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

  // Image proxy endpoint to handle images from admin interface
  app.get("/api/image-proxy", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: "URL parameter is required" });
      }

      // If it's a local upload path, serve from uploads directory
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

  const httpServer = createServer(app);

  return httpServer;
}
