import { 
  type Category, 
  type Document, 
  type User,
  type InsertCategory, 
  type InsertDocument,
  type InsertUser,
  categories,
  documents,
  users
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  updateUserRole(id: number, role: string): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Documents
  getDocuments(categoryId?: number): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocument(id: number, doc: Partial<InsertDocument>): Promise<Document>;
  deleteDocument(id: number): Promise<void>;
  searchDocuments(query: string): Promise<Document[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values(user)
      .returning();
    return newUser;
  }

  async getUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(users.username);
  }

  async updateUserRole(id: number, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

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

  async updateCategory(id: number, cat: Partial<InsertCategory>): Promise<Category> {
    const [category] = await db
      .update(categories)
      .set(cat)
      .where(eq(categories.id, id))
      .returning();

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    const [category] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    if (!category) {
      throw new Error('Category not found');
    }
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

  async deleteDocument(id: number): Promise<void> {
    const [document] = await db
      .delete(documents)
      .where(eq(documents.id, id))
      .returning();

    if (!document) {
      throw new Error('Document not found');
    }
  }

  async searchDocuments(query: string): Promise<Document[]> {
    const searchQuery = query.trim();
    if (!searchQuery) {
      return [];
    }

    try {
      // First try exact phrase matching with partial word support
      const exactMatches = await db
        .select()
        .from(documents)
        .where(sql`
          to_tsvector('english', title || ' ' || content) @@ 
          websearch_to_tsquery('english', ${searchQuery})
        `)
        .orderBy(desc(documents.lastUpdated));

      if (exactMatches.length > 0) {
        return exactMatches;
      }

      // If no exact matches, try more flexible matching including partial words
      return await db
        .select()
        .from(documents)
        .where(sql`
          title ILIKE ${'%' + searchQuery + '%'} OR
          content ILIKE ${'%' + searchQuery + '%'} OR
          to_tsvector('english', title || ' ' || content) @@ 
          to_tsquery('english', ${searchQuery + ':*'})
        `)
        .orderBy(desc(documents.lastUpdated));
    } catch (error) {
      console.error('Search error:', error);
      // Return empty array instead of throwing to maintain smooth UX
      return [];
    }
  }
}

export const storage = new DatabaseStorage();