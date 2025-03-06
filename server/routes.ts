import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getContentSuggestions, chatWithAI } from "./openai";
import { 
  insertCategorySchema, 
  insertDocumentSchema, 
  documentSearchSchema,
  aiSuggestSchema
} from "@shared/schema";
import { z } from "zod";

const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  }))
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (_req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    const result = insertCategorySchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid category data" });
      return;
    }
    const category = await storage.createCategory(result.data);
    res.json(category);
  });

  // Documents
  app.get("/api/documents", async (req, res) => {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const documents = await storage.getDocuments(categoryId);
    res.json(documents);
  });

  app.get("/api/documents/:id", async (req, res) => {
    const document = await storage.getDocument(Number(req.params.id));
    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }
    res.json(document);
  });

  app.post("/api/documents", async (req, res) => {
    const result = insertDocumentSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid document data" });
      return;
    }
    const document = await storage.createDocument(result.data);
    res.json(document);
  });

  app.patch("/api/documents/:id", async (req, res) => {
    const result = insertDocumentSchema.partial().safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid document data" });
      return;
    }
    try {
      const document = await storage.updateDocument(Number(req.params.id), result.data);
      res.json(document);
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ message: err.message });
    }
  });

  app.post("/api/documents/search", async (req, res) => {
    const result = documentSearchSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid search query" });
      return;
    }
    const documents = await storage.searchDocuments(result.data.query);
    res.json(documents);
  });

  app.post("/api/ai/suggest", async (req, res) => {
    const result = aiSuggestSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid content" });
      return;
    }
    try {
      const suggestions = await getContentSuggestions(result.data.content);
      res.json(suggestions);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    const result = chatSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid chat messages" });
      return;
    }
    try {
      const response = await chatWithAI(result.data.messages);
      res.json({ message: response });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}