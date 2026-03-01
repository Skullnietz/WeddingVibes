import { int, mysqlTable, varchar, text, boolean, timestamp } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  openId: varchar("openId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 50 }),
  role: varchar("role", { length: 20 }).$type<"user" | "admin">().default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * RSVP table for wedding guest confirmations
 */
export const rsvps = mysqlTable("rsvps", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  guestName: varchar("guestName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  isAttending: boolean("isAttending").notNull().default(false),
  numberOfCompanions: int("numberOfCompanions").default(0),
  dietaryRestrictions: text("dietaryRestrictions"),
  needsTransport: boolean("needsTransport").default(false),
  transportFrom: varchar("transportFrom", { length: 255 }),
  specialRequests: text("specialRequests"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RSVP = typeof rsvps.$inferSelect;
export type InsertRSVP = typeof rsvps.$inferInsert;

/**
 * Companions table for RSVP guests
 */
export const companions = mysqlTable("companions", {
  id: int("id").primaryKey().autoincrement(),
  rsvpId: int("rsvpId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  dietaryRestrictions: text("dietaryRestrictions"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
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
export const weddingPhotos = mysqlTable("weddingPhotos", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 1024 }).notNull(),
  category: varchar("category", { length: 100 }).default("general"),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WeddingPhoto = typeof weddingPhotos.$inferSelect;
export type InsertWeddingPhoto = typeof weddingPhotos.$inferInsert;

/**
 * Pre-wedding photos gallery
 */
export const preWeddingPhotos = mysqlTable("preWeddingPhotos", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 1024 }).notNull(),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PreWeddingPhoto = typeof preWeddingPhotos.$inferSelect;
export type InsertPreWeddingPhoto = typeof preWeddingPhotos.$inferInsert;

/**
 * Personalized Invitations
 */
export const invitations = mysqlTable("invitations", {
  id: int("id").primaryKey().autoincrement(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  guestName: varchar("guestName", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Invitation = typeof invitations.$inferSelect;
export type InsertInvitation = typeof invitations.$inferInsert;

/**
 * Spotify Song Requests
 */
export const songRequests = mysqlTable("songRequests", {
  id: int("id").primaryKey().autoincrement(),
  trackId: varchar("trackId", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }).notNull(),
  coverUrl: varchar("coverUrl", { length: 1024 }),
  requestedBy: varchar("requestedBy", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SongRequest = typeof songRequests.$inferSelect;
export type InsertSongRequest = typeof songRequests.$inferInsert;