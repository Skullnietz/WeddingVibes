import { eq, desc } from "drizzle-orm";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, rsvps, companions, weddingPhotos, preWeddingPhotos, invitations, songRequests, InsertRSVP, InsertCompanion, InsertWeddingPhoto, InsertPreWeddingPhoto, InsertSongRequest } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: mysql.Pool | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _pool = mysql.createPool(process.env.DATABASE_URL);
      _db = drizzle(_pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createRSVP(rsvpData: InsertRSVP) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(rsvps).values(rsvpData);
  return result;
}

export async function getRSVPByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(rsvps).where(eq(rsvps.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateRSVP(rsvpId: number, data: Partial<InsertRSVP>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(rsvps).set(data).where(eq(rsvps.id, rsvpId));
}

export async function createCompanion(companionData: InsertCompanion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(companions).values(companionData);
  return result;
}

export async function getCompanionsByRSVPId(rsvpId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(companions).where(eq(companions.rsvpId, rsvpId));
}

export async function getWeddingPhotos(category?: string) {
  const db = await getDb();
  if (!db) return [];
  if (category) {
    return await db.select().from(weddingPhotos).where(eq(weddingPhotos.category, category)).orderBy(desc(weddingPhotos.displayOrder));
  }
  return await db.select().from(weddingPhotos).orderBy(desc(weddingPhotos.displayOrder));
}

export async function createWeddingPhoto(photoData: InsertWeddingPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(weddingPhotos).values(photoData);
}

export async function getPreWeddingPhotos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(preWeddingPhotos).orderBy(desc(preWeddingPhotos.displayOrder));
}

export async function createPreWeddingPhoto(photoData: InsertPreWeddingPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(preWeddingPhotos).values(photoData);
}

export async function getInvitationBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(invitations).where(eq(invitations.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSongRequest(requestData: InsertSongRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(songRequests).values(requestData);
}

export async function getSongRequests() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(songRequests).orderBy(desc(songRequests.createdAt));
}
