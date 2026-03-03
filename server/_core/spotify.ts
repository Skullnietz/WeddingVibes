import { Request, Response, Router } from "express";

const spotifyRouter = Router();

// Track active tokens in memory for this session
// In a full production app you would attach this to the user session,
// but since the playlist is global for the wedding, we just need the host's token.
let currentSpotifyToken: {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
} = {
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
};

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Helper to determine the redirect URI based on environment
const getRedirectUri = (req: Request) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers.host;
    return `${protocol}://${host}/api/spotify/callback`;
};

// 1. Kickoff OAuth Flow
spotifyRouter.get("/login", (req, res) => {
    if (!SPOTIFY_CLIENT_ID) {
        return res.status(500).json({ error: "Missing SPOTIFY_CLIENT_ID in .env" });
    }

    const scope = "streaming user-read-email user-read-private user-library-read user-modify-playback-state";
    const redirectUri = getRedirectUri(req);

    const authQueryParameters = new URLSearchParams({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: redirectUri,
    });

    res.redirect(`https://accounts.spotify.com/authorize/?${authQueryParameters.toString()}`);
});

// 2. Handle Callback from Spotify
spotifyRouter.get("/callback", async (req, res) => {
    const code = req.query.code as string;
    const error = req.query.error;
    const redirectUri = getRedirectUri(req);

    if (error) {
        console.error("Spotify Auth Error:", error);
        return res.redirect("/?spotify_error=access_denied");
    }

    if (!code || !SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
        return res.redirect("/?spotify_error=missing_credentials");
    }

    try {
        const authHeader = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${authHeader}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectUri,
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Spotify token exchange failed:", errText);
            throw new Error(`Spotify token exchange failed: ${response.status}`);
        }

        const data = await response.json();

        // Store tokens securely in memory
        currentSpotifyToken = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: Date.now() + (data.expires_in * 1000),
        };

        console.log("[Spotify] Successfully acquired Web Playback token.");

        // Redirect back to the gallery
        res.redirect("/#galeria");
    } catch (err) {
        console.error("Error during Spotify callback:", err);
        res.redirect("/?spotify_error=token_failed");
    }
});

// 3. Endpoint for the frontend Web Playback SDK to retrieve the active token
spotifyRouter.get("/token", async (req, res) => {
    if (!currentSpotifyToken.accessToken) {
        return res.status(401).json({ error: "No Spotify token available. Host needs to connect." });
    }

    // Check if token is expired, refresh if necessary
    if (currentSpotifyToken.expiresAt && Date.now() > currentSpotifyToken.expiresAt - 60000) {
        try {
            if (!currentSpotifyToken.refreshToken || !SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
                throw new Error("Missing credentials for refresh");
            }

            console.log("[Spotify] Refreshing expired access token...");
            const authHeader = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${authHeader}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: currentSpotifyToken.refreshToken,
                }),
            });

            if (!response.ok) throw new Error("Failed to refresh token");

            const data = await response.json();
            currentSpotifyToken.accessToken = data.access_token;
            currentSpotifyToken.expiresAt = Date.now() + (data.expires_in * 1000);

            // Some refresh requests return a new refresh token, some don't
            if (data.refresh_token) {
                currentSpotifyToken.refreshToken = data.refresh_token;
            }
        } catch (err) {
            console.error("Spotify token refresh failed:", err);
            currentSpotifyToken = { accessToken: null, refreshToken: null, expiresAt: null };
            return res.status(401).json({ error: "Token refresh failed" });
        }
    }

    res.json({ token: currentSpotifyToken.accessToken });
});

export function registerSpotifyRoutes(app: import("express").Express) {
    app.use("/api/spotify", spotifyRouter);
}
