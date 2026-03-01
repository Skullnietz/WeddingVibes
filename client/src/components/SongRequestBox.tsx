import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Search, Music, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SongRequestBox() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const searchMutation = trpc.spotify.search.useMutation();
    const requestMutation = trpc.spotify.requestSong.useMutation({
        onSuccess: () => {
            requestedSongsQuery.refetch();
        }
    });

    const requestedSongsQuery = trpc.spotify.getRequestedSongs.useQuery();

    useEffect(() => {
        if (debouncedQuery.trim().length > 1) {
            searchMutation.mutate({ query: debouncedQuery });
        }
    }, [debouncedQuery]);

    const handleRequest = (track: any) => {
        requestMutation.mutate({
            trackId: track.id,
            title: track.title,
            artist: track.artist,
            coverUrl: track.coverUrl,
            // requestedBy could be wired if we track guest login, else optional
        });
        // Clear search after request
        setSearchQuery("");
    };

    return (
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-primary/30 max-w-2xl mx-auto w-full my-12 shadow-[0_0_30px_rgba(235,195,123,0.1)]">
            <div className="text-center mb-8">
                <h2 className="font-serif text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
                    <Music className="w-6 h-6" />
                    Pide tu Canción
                    <Music className="w-6 h-6" />
                </h2>
                <p className="text-muted-foreground font-sans">
                    ¿Qué canción no puede faltar en la fiesta? Búscala en Spotify y recomiéndala.
                </p>
            </div>

            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 w-5 h-5" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Busca una canción o artista..."
                    className="w-full bg-black/40 border border-primary/30 rounded-full py-4 pl-12 pr-6 text-white font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
                />
                {searchMutation.isPending && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            <AnimatePresence>
                {searchQuery && searchMutation.data && searchMutation.data.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8"
                    >
                        <h3 className="text-sm font-sans text-primary/70 uppercase tracking-widest mb-4">Resultados</h3>
                        <div className="space-y-3">
                            {searchMutation.data.map((track: any) => (
                                <div key={track.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-4 flex-1 overflow-hidden">
                                        {track.coverUrl ? (
                                            <img src={track.coverUrl} className="w-12 h-12 rounded-md object-cover drop-shadow-md" alt={track.title} />
                                        ) : (
                                            <div className="w-12 h-12 rounded-md bg-zinc-800 flex items-center justify-center">
                                                <Music className="w-5 h-5 text-zinc-500" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-sans font-semibold text-white truncate">{track.title}</p>
                                            <p className="font-sans text-sm text-gray-400 truncate">{track.artist}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRequest(track)}
                                        disabled={requestMutation.isPending}
                                        className="ml-4 w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center justify-center hover:bg-primary hover:text-black transition-colors shrink-0"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="border-t border-primary/20 pt-6">
                <h3 className="text-sm font-sans text-primary/70 uppercase tracking-widest mb-4">Canciones ya pedidas</h3>
                {requestedSongsQuery.isLoading ? (
                    <p className="text-muted-foreground text-sm font-sans">Cargando...</p>
                ) : requestedSongsQuery.data && requestedSongsQuery.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {requestedSongsQuery.data.map((req) => (
                            <div key={req.id} className="flex items-center gap-3 bg-black/20 p-2 rounded-lg border border-white/5">
                                {req.coverUrl ? (
                                    <img src={req.coverUrl} className="w-10 h-10 rounded-sm object-cover opacity-80" alt={req.title} />
                                ) : (
                                    <div className="w-10 h-10 rounded-sm bg-zinc-800/50 flex items-center justify-center">
                                        <Music className="w-4 h-4 text-zinc-500" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-sans text-sm font-medium text-gray-200 truncate">{req.title}</p>
                                    <p className="font-sans text-xs text-gray-500 truncate">{req.artist}</p>
                                </div>
                                <Check className="w-4 h-4 text-primary shrink-0 mr-2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm font-sans italic">Aún no hay canciones pedidas. ¡Sé el primero!</p>
                )}
            </div>
        </div>
    );
}
