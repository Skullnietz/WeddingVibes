import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role").$type<"user" | "admin">().default("user").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * RSVP table for wedding guest confirmations
 */
export const rsvps = sqliteTable("rsvps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  guestName: text("guestName").notNull(),
  email: text("email"),
  phone: text("phone"),
  isAttending: integer("isAttending", { mode: 'boolean' }).notNull().default(false),
  numberOfCompanions: integer("numberOfCompanions").default(0),
  dietaryRestrictions: text("dietaryRestrictions"),
  needsTransport: integer("needsTransport", { mode: 'boolean' }).default(false),
  transportFrom: text("transportFrom"),
  specialRequests: text("specialRequests"),
  createdAt: integer("createdAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type RSVP = typeof rsvps.$inferSelect;
export type InsertRSVP = typeof rsvps.$inferInsert;

/**
 * Companions table for RSVP guests
 */
export const companions = sqliteTable("companions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  rsvpId: integer("rsvpId").notNull(),
  name: text("name").notNull(),
  dietaryRestrictions: text("dietaryRestrictions"),
  createdAt: integer("createdAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type Companion = typeof companions.$inferSelect;
export type InsertCompanion = typeof companions.$inferInsert;

/**
 * Relations
 */
export const rsvpsRelations = relations(rsvps, ({ many }) => ({
  companions: many(companions),
}));

export const companionsRelations = relations(companions, ({ one }) => ({
  rsvp: one(rsvps, {
    fields: [companions.rsvpId],
    references: [rsvps.id],
  }),
}));

/**
 * Wedding photos gallery
 */
export const weddingPhotos = sqliteTable("weddingPhotos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  category: text("category").default("general"),
  displayOrder: integer("displayOrder").default(0),
  createdAt: integer("createdAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type WeddingPhoto = typeof weddingPhotos.$inferSelect;
export type InsertWeddingPhoto = typeof weddingPhotos.$inferInsert;

/**
 * Pre-wedding photos gallery
 */
export const preWeddingPhotos = sqliteTable("preWeddingPhotos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  displayOrder: integer("displayOrder").default(0),
  createdAt: integer("createdAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type PreWeddingPhoto = typeof preWeddingPhotos.$inferSelect;
export type InsertPreWeddingPhoto = typeof preWeddingPhotos.$inferInsert;

/**
 * Personalized Invitations
 */
export const invitations = sqliteTable("invitations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  guestName: text("guestName").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type Invitation = typeof invitations.$inferSelect;
export type InsertInvitation = typeof invitations.$inferInsert;