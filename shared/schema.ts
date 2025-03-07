import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Role enum definition
export const UserRole = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  READER: 'reader'
} as const;

export const userRoleEnum = z.enum(['admin', 'editor', 'reader']);
export type UserRole = z.infer<typeof userRoleEnum>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default(UserRole.READER),
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
  role: userRoleEnum.default(UserRole.READER),
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
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

// Role-based Permission Schemas
export const hasRole = (allowedRoles: UserRole[]) => {
  return (user: User | null) => {
    if (!user) return false;
    return allowedRoles.includes(user.role as UserRole);
  };
};

export const canManageUsers = hasRole([UserRole.ADMIN]);
export const canManageCategories = hasRole([UserRole.ADMIN, UserRole.EDITOR]);
export const canEditDocuments = hasRole([UserRole.ADMIN, UserRole.EDITOR]);
export const canReadDocuments = hasRole([UserRole.ADMIN, UserRole.EDITOR, UserRole.READER]);