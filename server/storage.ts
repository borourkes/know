import { 
  type Category, 
  type Document, 
  type InsertCategory, 
  type InsertDocument,
  categories,
  documents
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return category;
  }

  async createCategory(cat: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(cat)
      .returning();
    return category;
  }

  async getDocuments(categoryId?: number): Promise<Document[]> {
    let query = db
      .select()
      .from(documents)
      .orderBy(desc(documents.lastUpdated));

    if (categoryId) {
      query = query.where(eq(documents.categoryId, categoryId));
    }

    return await query;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));
    return document;
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [document] = await db
      .insert(documents)
      .values({
        ...doc,
        lastUpdated: new Date()
      })
      .returning();
    return document;
  }

  async updateDocument(id: number, doc: Partial<InsertDocument>): Promise<Document> {
    const [document] = await db
      .update(documents)
      .set({
        ...doc,
        lastUpdated: new Date()
      })
      .where(eq(documents.id, id))
      .returning();

    if (!document) {
      throw new Error('Document not found');
    }

    return document;
  }

  async searchDocuments(query: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(sql`
        to_tsvector('english', ${documents.title} || ' ' || ${documents.content}) @@ 
        plainto_tsquery('english', ${query})
      `)
      .orderBy(desc(documents.lastUpdated));
  }
}

export const storage = new DatabaseStorage();