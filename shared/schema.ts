import { pgTable, text, serial, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum('user_role', ['admin', 'editor', 'reader']);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default('reader'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  lastUpdated: timestamp("last_updated").defaultNow(),
  userId: integer("user_id").references(() => users.id),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['admin', 'editor', 'reader']).default('reader'),
}).omit({ 
  id: true,
  createdAt: true 
});

export const insertCategorySchema = createInsertSchema(categories);
export const insertDocumentSchema = createInsertSchema(documents).omit({ 
  lastUpdated: true,
  userId: true
});

export const documentSearchSchema = z.object({
  query: z.string().min(1),
});

export const aiSuggestSchema = z.object({
  content: z.string().min(1),
});

// Types
export type UserRole = 'admin' | 'editor' | 'reader';
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;