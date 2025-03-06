import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role", { enum: ["admin", "editor", "viewer"] }).notNull().default("viewer"),
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
  authorId: integer("author_id").references(() => users.id),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true 
});

export const insertCategorySchema = createInsertSchema(categories);
export const insertDocumentSchema = createInsertSchema(documents).omit({ 
  lastUpdated: true 
});

// Search schemas
export const documentSearchSchema = z.object({
  query: z.string().min(1),
});

export const aiSuggestSchema = z.object({
  content: z.string().min(1),
});

// Types
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Document = typeof documents.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;