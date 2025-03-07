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
import { isAuthenticated, checkRole } from "./auth";

const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  }))
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories - Admin only
  app.get("/api/categories", isAuthenticated, async (_req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post("/api/categories", isAuthenticated, checkRole(['admin']), async (req, res) => {
    const result = insertCategorySchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid category data" });
      return;
    }
    const category = await storage.createCategory(result.data);
    res.json(category);
  });

  app.patch("/api/categories/:id", isAuthenticated, checkRole(['admin']), async (req, res) => {
    const result = insertCategorySchema.partial().safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid category data" });
      return;
    }
    try {
      const category = await storage.updateCategory(Number(req.params.id), result.data);
      res.json(category);
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ message: err.message });
    }
  });

  app.delete("/api/categories/:id", isAuthenticated, checkRole(['admin']), async (req, res) => {
    try {
      await storage.deleteCategory(Number(req.params.id));
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ message: err.message });
    }
  });

  // Documents - Editors can create/edit, Readers can only view
  app.get("/api/documents", isAuthenticated, async (req, res) => {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const documents = await storage.getDocuments(categoryId);
    res.json(documents);
  });

  app.get("/api/documents/:id", isAuthenticated, async (req, res) => {
    const document = await storage.getDocument(Number(req.params.id));
    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }
    res.json(document);
  });

  app.post("/api/documents", isAuthenticated, checkRole(['admin', 'editor']), async (req, res) => {
    const result = insertDocumentSchema.safeParse({
      ...req.body,
      userId: req.user?.id
    });
    if (!result.success) {
      res.status(400).json({ message: "Invalid document data" });
      return;
    }
    const document = await storage.createDocument(result.data);
    res.json(document);
  });

  app.patch("/api/documents/:id", isAuthenticated, checkRole(['admin', 'editor']), async (req, res) => {
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

  app.delete("/api/documents/:id", isAuthenticated, checkRole(['admin', 'editor']), async (req, res) => {
    try {
      await storage.deleteDocument(Number(req.params.id));
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ message: err.message });
    }
  });

  app.post("/api/documents/search", isAuthenticated, async (req, res) => {
    const result = documentSearchSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid search query" });
      return;
    }
    const documents = await storage.searchDocuments(result.data.query);
    res.json(documents);
  });

  // AI features - Available to editors and admins
  app.post("/api/ai/suggest", isAuthenticated, checkRole(['admin', 'editor']), async (req, res) => {
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

  app.post("/api/ai/chat", isAuthenticated, checkRole(['admin', 'editor']), async (req, res) => {
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