import { useState, useEffect, useCallback } from "react";
import { Play, Pause, SkipForward, SkipBack, Music, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

// Add TypeScript definitions for the Spotify Web Playback SDK
declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: any;
    }
}

export default function SpotifyPlayer() {
    const [player, setPlayer] = useState<any>(null);
    const [isPaused, setIsPaused] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<any>(null);
    const [tokenError, setTokenError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Fallback track info when player is idle but connected
    const defaultTrack = {
        name: "Wedding Vibes",
        artists: [{ name: "DJ Premium" }],
        album: { images: [{ url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=200&auto=format&fit=crop" }] }
    };

    const displayTrack = currentTrack || defaultTrack;

    const fetchToken = async () => {
        try {
            const res = await fetch("/api/spotify/token");
            if (!res.ok) throw new Error("No token available");
            const data = await res.json();
            return data.token;
        } catch (err) {
            setTokenError(true);
            setIsLoading(false);
            return null;
        }
    };

    const startWeddingPlaylist = async (deviceId: string, token: string) => {
        try {
            // 1. Transfer playback to this device first and attempt to start playing
            await fetch('https://api.spotify.com/v1/me/player', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    device_ids: [deviceId],
                    play: true,
                }),
            });

            // 2. Give the transfer a tiny delay to register, then command it to play the specific playlist
            setTimeout(async () => {
                await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        context_uri: 'spotify:playlist:4bl2WwIx291W46C25nixgY'
                    }),
                });
            }, 500);

        } catch (err) {
            console.error("Failed to start wedding playlist:", err);
        }
    };

    const handlePlayClick = async () => {
        if (!deviceId || !token) return;

        // If it's already active/playing, just let the Web SDK toggle it natively
        if (isActive && !isPaused) {
            player?.pause();
            return;
        }

        // If paused or inactive, force the Wedding Playlist payload to ensure audio routes here
        await startWeddingPlaylist(deviceId, token);
        player?.resume();
    };

    useEffect(() => {
        // 1. Setup global callback for the SDK
        window.onSpotifyWebPlaybackSDKReady = async () => {
            const token = await fetchToken();
            if (!token) return;

            const spotifyPlayer = new window.Spotify.Player({
                name: 'Wedding Vibes Web Player',
                getOAuthToken: (cb: (token: string) => void) => { cb(token); },
                volume: 0.8
            });

            setPlayer(spotifyPlayer);

            // Ready
            spotifyPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
                setToken(token);
                setIsLoading(false);
                // Automatically transfer playback and start the wedding playlist
                startWeddingPlaylist(device_id, token);
            });

            // Not Ready
            spotifyPlayer.addListener('not_ready', ({ device_id }: { device_id: string }) => {
                console.log('Device ID has gone offline', device_id);
                setIsActive(false);
            });

            // State changes
            spotifyPlayer.addListener('player_state_changed', (state: any) => {
                if (!state) {
                    setIsActive(false);
                    return;
                }

                setIsActive(true);
                setCurrentTrack(state.track_window.current_track);
                setIsPaused(state.paused);
            });

            // Auth errors
            spotifyPlayer.addListener('authentication_error', ({ message }: { message: string }) => {
                console.error(message);
                setTokenError(true);
                setIsLoading(false);
            });

            // Connect to the player!
            spotifyPlayer.connect();
        };

        // 2. Dynamically load the Spotify SDK script into the DOM
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup
            if (player) player.disconnect();
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const initLogin = () => {
        window.location.href = "/api/spotify/login";
    };

    // State 1: Login Required
    if (tokenError) {
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border p-4 z-[60]">
                <div className="container max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1DB954]/20 flex items-center justify-center">
                            <Music className="w-5 h-5 text-[#1DB954]" />
                        </div>
                        <div>
                            <h3 className="font-serif font-semibold">Reproductor Oficial (Premium)</h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <HelpCircle className="w-3 h-3" /> Requiere cuenta Spotify Premium activa.
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={initLogin}
                        className="w-full sm:w-auto bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition-all shadow-[0_4px_14px_0_rgba(29,185,84,0.39)]"
                    >
                        Conectar Spotify
                    </Button>
                </div>
            </div>
        );
    }

    // State 2: Loading SDK Handshake
    if (isLoading) {
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border p-4 z-[60] flex items-center justify-center min-h-[80px]">
                <Loader2 className="w-6 h-6 text-[#1DB954] animate-spin mr-3" />
                <p className="text-sm font-serif text-muted-foreground animate-pulse">Sincronizando con Spotify...</p>
            </div>
        );
    }

    // State 3: Active Player Widget (Bottom Docked)
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-950/95 backdrop-blur-xl border-t border-white/10 p-3 sm:p-4 z-[60] shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">

            {/* Advertisement / Info Tab floating at the far bottom right of the screen */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2, duration: 1, type: "spring", bounce: 0.4 }}
                className="absolute bottom-full right-4 lg:right-8 mb-4 hidden md:flex items-center gap-4 bg-neutral-900/95 backdrop-blur-xl border border-primary/40 p-3 pr-4 rounded-t-2xl rounded-bl-2xl rounded-tr-sm shadow-[0_0_30px_rgba(212,175,55,0.1)] text-white"
            >
                <div className="flex flex-col items-end text-right">
                    <p className="text-primary font-serif text-lg lg:text-xl font-bold leading-tight flex items-center gap-2">
                        <span className="animate-pulse">📸</span> ¡Sube tus fotos!
                    </p>
                    <p className="text-white/70 font-sans text-xs max-w-[180px] mt-1">
                        Escanea este código o entra a la galería para compartir tus recuerdos.
                    </p>
                </div>
                <div className="bg-white p-1 rounded-xl shrink-0 shadow-inner group cursor-pointer hover:scale-105 transition-transform">
                    {/* We use api.qrserver.com to generate the QR on the fly nicely */}
                    <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://weddingvibes.com.mx/mi-galeria&margin=0"
                        alt="QR Galería"
                        className="w-20 h-20 lg:w-24 lg:h-24 object-contain"
                        crossOrigin="anonymous"
                    />
                </div>
            </motion.div>

            <div className="container max-w-4xl mx-auto flex items-center justify-between gap-4">

                {/* Track Info */}
                <div className="flex items-center gap-3 w-1/3 min-w-[200px]">
                    <motion.div
                        className="w-12 h-12 rounded shadow-md overflow-hidden flex-shrink-0 relative group"
                        animate={{ scale: isPaused ? 1 : 1.05 }}
                    >
                        <img
                            src={displayTrack?.album?.images[0]?.url}
                            alt="Album art"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Music className="w-4 h-4 text-[#1DB954]" />
                        </div>
                    </motion.div>

                    <div className="flex flex-col overflow-hidden">
                        <span className="font-semibold text-sm truncate text-white">
                            {displayTrack?.name}
                        </span>
                        <span className="text-xs text-white/60 truncate">
                            {displayTrack?.artists.map((a: any) => a.name).join(", ")}
                        </span>
                    </div>
                </div>

                {/* Playback Controls (Center) */}
                <div className="flex flex-col items-center flex-1">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost" size="icon"
                            onClick={() => player?.previousTrack()}
                            className="text-white/50 hover:text-white hover:bg-white/10 h-8 w-8"
                        >
                            <SkipBack className="w-4 h-4 fill-current" />
                        </Button>

                        <Button
                            onClick={handlePlayClick}
                            className="w-10 h-10 rounded-full bg-primary text-black hover:scale-105 transition-all shadow-md flex items-center justify-center p-0"
                        >
                            {isPaused ? <Play className="w-5 h-5 fill-black ml-1" /> : <Pause className="w-5 h-5 fill-black" />}
                        </Button>

                        <Button
                            variant="ghost" size="icon"
                            onClick={() => player?.nextTrack()}
                            className="text-white/50 hover:text-white hover:bg-white/10 h-8 w-8"
                        >
                            <SkipForward className="w-4 h-4 fill-current" />
                        </Button>
                    </div>
                </div>

                {/* Right side status / soundbars */}
                <div className="hidden md:flex items-center justify-end w-1/3 gap-3">
                    {!isActive && (
                        <span className="text-[10px] text-[#1DB954] bg-[#1DB954]/10 px-2 py-1 rounded-full animate-pulse border border-[#1DB954]/20">
                            Selecciona "Wedding Vibes Web Player" en tu App
                        </span>
                    )}
                    <div className="flex items-end gap-[2px] h-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1 bg-[#1DB954] rounded-t-sm origin-bottom"
                                animate={{ scaleY: isPaused ? 0.2 : [0.3, 1, 0.4, 0.8, 0.2] }}
                                transition={{ duration: 0.8, repeat: isPaused ? 0 : Infinity, repeatType: "mirror", delay: i * 0.1 }}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
