export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO = "https://placehold.co/128x128/6B4C9A/F5F1E8?text=M%26G";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const WEDDING_HASHTAG = "#MiriamGonzaloBoda2025";

export const getLoginUrl = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  if (!clientId) {
    console.error("No VITE_GOOGLE_CLIENT_ID configured for OAuth");
    return "/";
  }

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "consent");

  return url.toString();
};
