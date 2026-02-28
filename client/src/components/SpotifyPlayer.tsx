import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function SpotifyPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initIframe = (IFrameAPI: any) => {
            if (!containerRef.current) return;

            // If already initialized inside this container, return
            if (containerRef.current.querySelector('iframe')) return;

            // Clear any previous nodes inside to be safe
            containerRef.current.innerHTML = '';

            // Create a fresh DOM node for the API to replace
            const element = document.createElement('div');
            containerRef.current.appendChild(element);

            const options = {
                uri: 'spotify:playlist:4bl2WwIx291W46C25nixgY', // Playlist requested
                width: '100%',
                height: '80', // the IFrame needs to render for the API to connect correctly
                theme: '0'
            };

            const callback = (EmbedController: any) => {
                EmbedController.addListener('playback_update', (e: any) => {
                    setIsPlaying(!e.data.isPaused);
                });
            };

            IFrameAPI.createController(element, options, callback);
        };

        if ((window as any).SpotifyIframeAPIObj) {
            // API already loaded
            initIframe((window as any).SpotifyIframeAPIObj);
        } else {
            (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
                (window as any).SpotifyIframeAPIObj = IFrameAPI;
                initIframe(IFrameAPI);
            };

            if (!document.getElementById('spotify-iframe-api')) {
                const script = document.createElement("script");
                script.id = 'spotify-iframe-api';
                script.src = "https://open.spotify.com/embed/iframe-api/v1";
                script.async = true;
                document.body.appendChild(script);
            }
        }
    }, []);

    return (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-xl border-t border-primary/30 p-2 sm:p-4 z-[60]">
            <div className="container max-w-4xl mx-auto flex flex-col gap-1 sm:gap-2">
                <p className="text-center text-[10px] sm:text-xs text-primary/80 font-sans tracking-wide">
                    Inicia sesión de lado derecho para escuchar la playlist libremente
                </p>

                <div className="flex items-center justify-between gap-4 w-full">
                    {/* Center: The actual Spotify Iframe visible to show cover, title, artist, native controls */}
                    <div className="flex-1 w-full rounded-md overflow-hidden bg-transparent" ref={containerRef}>
                        {/* The specific div to be replaced by the iframe is injected here dynamically */}
                    </div>

                    {/* Right side: Golden Soundbars */}
                    <div className="hidden md:flex items-end gap-[3px] h-8 ml-2 flex-shrink-0">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 bg-primary rounded-t-sm origin-bottom"
                                animate={{
                                    scaleY: isPlaying ? [0.3, 1, 0.4, 0.8, 0.2] : 0.2,
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: isPlaying ? Infinity : 0,
                                    repeatType: "mirror",
                                    delay: i * 0.1,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
