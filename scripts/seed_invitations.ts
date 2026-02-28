import { eq } from "drizzle-orm";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { invitations } from "../drizzle/schema";
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const guests = [
    { slug: "familia-pena-ordonez", guestName: "Familia Peña Ordoñez" },
    { slug: "carlos-guizar", guestName: "Carlos Guízar" },
    { slug: "familia-pena-quintero", guestName: "Familia Peña Quintero" },
    { slug: "familia-valdez-pena", guestName: "Familia Valdez Peña" },
    { slug: "guadalupe-ordonez", guestName: "Guadalupe Ordoñez" },
    { slug: "jose-raul-fragoso", guestName: "José Raúl Fragoso" },
    { slug: "manuel-fragoso", guestName: "Manuel Fragoso" },
    { slug: "mariela-perez-tafoya", guestName: "Mariela Pérez Tafoya" },
    { slug: "felipe-torrescano", guestName: "Felipe Torrescano" },
];

async function seed() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    console.log("Connecting to database at", dbUrl);
    const client = createClient({ url: dbUrl });
    const db = drizzle(client);

    console.log("Seeding invitations...");

    let inserted = 0;
    for (const guest of guests) {
        try {
            const existing = await db.select().from(invitations).where(eq(invitations.slug, guest.slug));

            if (existing.length === 0) {
                await db.insert(invitations).values(guest);
                console.log(`✅ Inserted: ${guest.guestName} (${guest.slug})`);
                inserted++;
            } else {
                console.log(`⚠️ Skipped (already exists): ${guest.guestName}`);
            }
        } catch (err) {
            console.error(`❌ Failed to insert ${guest.guestName}:`, err);
        }
    }

    console.log(`\nDone! Inserted ${inserted} new invitations.`);
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
