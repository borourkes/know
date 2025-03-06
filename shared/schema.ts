import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
});

export const insertCategorySchema = createInsertSchema(categories);
export const insertDocumentSchema = createInsertSchema(documents).omit({ 
  lastUpdated: true 
});

export type Category = typeof categories.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export const documentSearchSchema = z.object({
  query: z.string().min(1),
});

export const aiSuggestSchema = z.object({
  content: z.string().min(1),
});
