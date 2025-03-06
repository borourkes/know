import { 
  type Category, 
  type Document, 
  type InsertCategory, 
  type InsertDocument 
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Documents
  getDocuments(categoryId?: number): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocument(id: number, doc: Partial<InsertDocument>): Promise<Document>;
  searchDocuments(query: string): Promise<Document[]>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private documents: Map<number, Document>;
  private categoryId: number;
  private documentId: number;

  constructor() {
    this.categories = new Map();
    this.documents = new Map();
    this.categoryId = 1;
    this.documentId = 1;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(cat: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category = { ...cat, id };
    this.categories.set(id, category);
    return category;
  }

  async getDocuments(categoryId?: number): Promise<Document[]> {
    const docs = Array.from(this.documents.values());
    if (categoryId) {
      return docs.filter(d => d.categoryId === categoryId);
    }
    return docs;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const id = this.documentId++;
    const document = { 
      ...doc, 
      id,
      lastUpdated: new Date()
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, doc: Partial<InsertDocument>): Promise<Document> {
    const existing = await this.getDocument(id);
    if (!existing) {
      throw new Error('Document not found');
    }
    const updated = {
      ...existing,
      ...doc,
      lastUpdated: new Date()
    };
    this.documents.set(id, updated);
    return updated;
  }

  async searchDocuments(query: string): Promise<Document[]> {
    const docs = Array.from(this.documents.values());
    const lowercaseQuery = query.toLowerCase();
    return docs.filter(doc => 
      doc.title.toLowerCase().includes(lowercaseQuery) ||
      doc.content.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const storage = new MemStorage();
