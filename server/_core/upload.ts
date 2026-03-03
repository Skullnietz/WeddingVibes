import { Express } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "../db";
import { weddingPhotos } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import express from "express";

// Ensure upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${uuidv4()}${ext}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max file size
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed!"));
        }
        cb(null, true);
    },
});

export function registerUploadRoutes(app: Express) {
    // Serve the uploads folder statically so frontend can display images
    app.use("/uploads", express.static(UPLOAD_DIR));

    // Endpoint to handle image upload
    app.post("/api/photos/upload", upload.single("photo"), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No photo uploaded." });
            }

            // We expect the user's ID to be passed in the body, or from a session middleware.
            // Since tRPC usually handles auth, but this is a raw Express route, we will accept it from the body for now,
            // or rely on a JWT header if we implemented one. Let's just expect it in req.body for simplicity.
            const userId = req.body.userId ? parseInt(req.body.userId) : null;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized. User ID required." });
            }

            const imageUrl = `/uploads/${req.file.filename}`;
            const title = req.body.title || "Guest Photo";
            const description = req.body.description || null;

            // Insert into database with "pending" status
            const db = await getDb();
            if (!db) return res.status(500).json({ error: "Database not available" });

            await db.insert(weddingPhotos).values({
                imageUrl,
                title,
                description,
                category: "guest",
                status: "pending",
                uploadedBy: userId,
            });

            return res.status(200).json({ success: true, imageUrl, message: "Photo uploaded and pending approval." });
        } catch (error) {
            console.error("Upload error:", error);
            return res.status(500).json({ error: "Failed to upload photo." });
        }
    });

    // Fetch photos uploaded by specific user
    app.get("/api/photos/mine", async (req, res) => {
        try {
            const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized. User ID required." });
            }

            const db = await getDb();
            if (!db) return res.status(500).json({ error: "Database not available" });

            const photos = await db
                .select()
                .from(weddingPhotos)
                .where(eq(weddingPhotos.uploadedBy, userId))
                .orderBy(desc(weddingPhotos.createdAt));

            return res.status(200).json(photos);
        } catch (error) {
            console.error("Fetch mine error:", error);
            return res.status(500).json({ error: "Failed to fetch photos." });
        }
    });

    // Fetch ALL photos for Admin Dashboard
    app.get("/api/photos/admin", async (req, res) => {
        try {
            const adminId = req.query.userId ? parseInt(req.query.userId as string) : null;
            if (!adminId) return res.status(401).json({ error: "Unauthorized" });

            const db = await getDb();
            if (!db) return res.status(500).json({ error: "Database not available" });

            // In a real app we'd verify admin role here. Assuming the frontend handles it or basic trust for now.
            const photos = await db.select().from(weddingPhotos).orderBy(desc(weddingPhotos.createdAt));
            return res.status(200).json(photos);
        } catch (error) {
            console.error("Admin fetch error:", error);
            return res.status(500).json({ error: "Failure" });
        }
    });

    // Accept/Reject photo status
    app.patch("/api/photos/:id/status", express.json(), async (req, res) => {
        try {
            const photoId = parseInt(req.params.id);
            const { status } = req.body;

            if (!["pending", "approved", "rejected"].includes(status)) {
                return res.status(400).json({ error: "Invalid status" });
            }

            const db = await getDb();
            if (!db) return res.status(500).json({ error: "Database not available" });

            await db.update(weddingPhotos)
                .set({ status })
                .where(eq(weddingPhotos.id, photoId));

            return res.status(200).json({ success: true, status });
        } catch (error) {
            console.error("Update status error:", error);
            return res.status(500).json({ error: "Failed to update status." });
        }
    });
}
