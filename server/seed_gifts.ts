import { getDb, createGift } from "./db";

const initialGifts = [
    "BATERIA DE COCINA",
    "EDREDON MATRIMONIAL",
    "SABANAS MATRIMONIALES",
    "JUEGO DE ALMOHADAS",
    "FREIDORA DE AIRE",
    "DISPENSADOR DE AGUA PARA GARRAFON",
    "VAJILLA",
    "JUEGO DE CUBIERTOS",
    "SARTENES",
    "JUEGO DE TOALLAS",
    "CAFETERA",
    "DESPENSA",
    "VELAS AROMATICAS",
    "JUEGO DE BAÑO",
    "ESQUINERO DE BAÑO",
    "ESTUFA ELECTRICA",
    "BOILER ELECTRICO",
    "JUEGO DE MALETAS",
    "LONCHERAS",
    "LICUADORA PORTATIL RECARGABLE",
    "COLCHON INFLABLE",
    "JUEGO DE CUCHILLOS",
    "KARCHER",
];

async function seed() {
    const db = await getDb();
    if (!db) {
        console.error("No database connection available.");
        return;
    }

    console.log("Seeding gifts...");
    for (const giftName of initialGifts) {
        try {
            await createGift({ name: giftName });
            console.log(`Added gift: ${giftName}`);
        } catch (e) {
            console.error(`Error adding gift ${giftName}:`, e);
        }
    }
    console.log("Seeding complete.");
    process.exit(0);
}

seed().catch(console.error);
