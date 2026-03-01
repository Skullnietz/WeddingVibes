import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createRSVP, getRSVPByUserId, updateRSVP, getWeddingPhotos, getPreWeddingPhotos, getInvitationBySlug, getSongRequests, createSongRequest } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  rsvp: router({
    create: protectedProcedure
      .input(z.object({
        guestName: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        isAttending: z.boolean(),
        numberOfCompanions: z.number().int().min(0).default(0),
        dietaryRestrictions: z.string().optional(),
        needsTransport: z.boolean().default(false),
        transportFrom: z.string().optional(),
        specialRequests: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await createRSVP({
          userId: ctx.user.id,
          ...input,
        });
      }),

    getByUser: protectedProcedure
      .query(async ({ ctx }) => {
        return await getRSVPByUserId(ctx.user.id);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        guestName: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        isAttending: z.boolean().optional(),
        numberOfCompanions: z.number().int().min(0).optional(),
        dietaryRestrictions: z.string().optional(),
        needsTransport: z.boolean().optional(),
        transportFrom: z.string().optional(),
        specialRequests: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const rsvp = await getRSVPByUserId(ctx.user.id);
        if (!rsvp || rsvp.id !== id) {
          throw new Error("Unauthorized");
        }
        await updateRSVP(id, data);
        return { success: true };
      }),
  }),

  photos: router({
    getWeddingPhotos: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await getWeddingPhotos(input?.category);
      }),

    getPreWeddingPhotos: publicProcedure
      .query(async () => {
        return await getPreWeddingPhotos();
      }),
  }),

  invitations: router({
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await getInvitationBySlug(input);
      }),
  }),

  spotify: router({
    search: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .mutation(async ({ input }) => {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          throw new Error("Missing Spotify credentials");
        }

        // 1. Get Access Token
        const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
          },
          body: new URLSearchParams({ grant_type: "client_credentials" }),
        });

        if (!tokenResponse.ok) {
          throw new Error("Failed to get Spotify token");
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 2. Search Tracks
        const searchResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(input.query)}&type=track&limit=5`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!searchResponse.ok) {
          throw new Error("Failed to search Spotify");
        }

        const searchData = await searchResponse.json();

        return searchData.tracks.items.map((track: any) => ({
          id: track.id,
          title: track.name,
          artist: track.artists.map((a: any) => a.name).join(", "),
          coverUrl: track.album.images[0]?.url || "",
          previewUrl: track.preview_url,
        }));
      }),

    requestSong: publicProcedure
      .input(z.object({
        trackId: z.string(),
        title: z.string(),
        artist: z.string(),
        coverUrl: z.string(),
        requestedBy: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createSongRequest(input);
        return { success: true };
      }),

    getRequestedSongs: publicProcedure
      .query(async () => {
        return await getSongRequests();
      })
  }),
});

export type AppRouter = typeof appRouter;
