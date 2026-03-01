import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

import axios from "axios";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = typeof state === "string" ? atob(state) : "";

      if (!clientId || !clientSecret) {
        throw new Error("Missing Google OAuth Credentials in Environment");
      }

      // 1. Exchange code for Google Access Token
      const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      });

      const accessToken = tokenResponse.data.access_token;

      // 2. Fetch User Profile from Google
      const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const userInfo = userInfoResponse.data;

      if (!userInfo.id) {
        res.status(400).json({ error: "id missing from Google user info" });
        return;
      }

      // 3. Upsert into database
      await db.upsertUser({
        openId: userInfo.id,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: "google",
        lastSignedIn: new Date(),
      });

      // 4. Create local session
      const sessionToken = await sdk.createSessionToken(userInfo.id, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error: any) {
      console.error("[OAuth] Callback failed", error?.response?.data || error);
      res.status(500).json({
        error: "OAuth callback failed",
        message: error?.message || "Unknown error",
        details: error?.response?.data || error?.stack || "No additional details"
      });
    }
  });
}
