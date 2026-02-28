import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

const WEDDING_PLAYLIST = [
    { id: 1, title: "Antes Que al Mío", artist: "Los Ángeles Azules, Los Claxons" },
    { id: 2, title: "Me Hace Tanto Bien", artist: "Yuridia, Eden Muñoz" },
    { id: 3, title: "¿Y Qué Tal Si Funciona?", artist: "Yuridia, Banda MS" },
    { id: 4, title: "Baby, I Love Your Way", artist: "Big Mountain" },
    { id: 5, title: "Eres", artist: "José María Napoleón" },
    { id: 6, title: "Patadas de Ahogado", artist: "LATIN MAFIA, HUMBE" },
    { id: 7, title: "Una Lady Como Tú", artist: "Manuel Turizo" },
    { id: 8, title: "Quiéreme Mientras Se Pueda", artist: "Manuel Turizo" },
    { id: 9, title: "De Repente", artist: "Soraya" },
    { id: 10, title: "ADMV", artist: "Maluma" },
    { id: 11, title: "Amor del Bueno", artist: "Reyli Barba" },
    { id: 12, title: "Again", artist: "Lenny Kravitz" },
    { id: 13, title: "Con Tu Amor", artist: "Juan Gabriel" },
    { id: 14, title: "Antes Que al Mío", artist: "Los Claxons" },
    { id: 15, title: "Que bonito", artist: "Grecia Vallejo" },
    { id: 16, title: "A Dios Le Pido", artist: "Juanes" },
    { id: 17, title: "Ya No Vivo Por Vivir", artist: "Juan Gabriel, Natalia Lafourcade" },
    { id: 18, title: "El Rey Azul", artist: "Emmanuel" },
    { id: 19, title: "Creep", artist: "Radiohead" },
    { id: 20, title: "Crazy Little Thing Called Love", artist: "Queen" },
    { id: 21, title: "Bonito", artist: "Jarabe De Palo" },
    { id: 22, title: "Optimista", artist: "Caloncho" },
    { id: 23, title: "Día De Suerte", artist: "Alejandra Guzman" },
    { id: 24, title: "Afuera Del Planeta", artist: "Manuel Medrano" },
    { id: 25, title: "Amor Bonito", artist: "Leoni Torres, Descemer Bueno" },
    { id: 26, title: "Tu", artist: "Carín León" },
    { id: 27, title: "Bésame", artist: "Ricardo Montaner" },
    { id: 28, title: "Mon Amour - Remix", artist: "zzoilo, Aitana" },
    { id: 29, title: "For the First Time", artist: "Rod Stewart" },
    { id: 30, title: "I Don't Want to Miss a Thing", artist: "Aerosmith" },
    { id: 31, title: "Lejos Conmigo", artist: "Greeicy, Alejandro Sanz" },
    { id: 32, title: "I Say a Little Prayer", artist: "Aretha Franklin" },
    { id: 33, title: "No Importa Que el Sol Se Muera", artist: "Moenia, María José" },
    { id: 34, title: "Si Nos Dejan", artist: "Luis Miguel" },
    { id: 35, title: "No Sé Tú", artist: "Luis Miguel" },
    { id: 36, title: "Estar Contigo", artist: "Alex, Jorge Y Lena" },
    { id: 37, title: "Dormir contigo", artist: "Luis Miguel" },
    { id: 38, title: "Y Si Te Quedas, ¿Qué?", artist: "Santiago Cruz" },
    { id: 39, title: "Entra en Mi Vida", artist: "Sin Bandera" },
    { id: 40, title: "Te Vi Venir", artist: "Sin Bandera" },
    { id: 41, title: "Contigo Quiero", artist: "Reyli Barba" },
    { id: 42, title: "Entrégate", artist: "Luis Miguel" },
    { id: 43, title: "Mundo Paralelo", artist: "Monsieur Periné, Pedro Capó" },
    { id: 44, title: "La Pareja Ideal", artist: "Marisela" },
    { id: 45, title: "Suave", artist: "Luis Miguel" },
    { id: 46, title: "Quien Te Dio Permiso", artist: "Raúl Ornelas" },
    { id: 47, title: "Perro Fiel", artist: "Shakira, Nicky Jam" },
    { id: 48, title: "Un te amo", artist: "Luis Miguel" },
    { id: 49, title: "Si Quieres", artist: "Juan Gabriel" },
    { id: 50, title: "Con los Años Que Me Quedan", artist: "Gloria Estefan" },
    { id: 51, title: "Abrázame Muy Fuerte", artist: "Juan Gabriel" },
    { id: 52, title: "Guapa", artist: "Diego Torres" },
    { id: 53, title: "El Uno Para El Otro", artist: "Tercer Cielo" },
    { id: 54, title: "Que Me Alcance la Vida", artist: "Sin Bandera" }
];

export default function CustomAudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errorStatus, setErrorStatus] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const currentTrack = WEDDING_PLAYLIST[currentIndex];

    // Provide guidance for missing assets
    const trackAudioUrl = `/music/${currentTrack.id}.mp3`;
    const trackCoverUrl = `/covers/${currentTrack.id}.jpg`;

    const togglePlay = () => {
        if (!audioRef.current) return;

        // Reset error state on deliberate play attempt
        setErrorStatus(null);

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => {
                console.warn("Audio playback failed:", e);
                setErrorStatus(`Falta archivo en /music/${currentTrack.id}.mp3`);
            });
        }
    };

    const playNext = () => {
        setCurrentIndex((prev) => (prev + 1) % WEDDING_PLAYLIST.length);
    };

    const playPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : WEDDING_PLAYLIST.length - 1));
    };

    // Autoplay handler when track index changes
    useEffect(() => {
        setErrorStatus(null); // Clear errors
        if (audioRef.current) {
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch(e => {
                    console.warn("Audio autoplay blocked or file missing", e);
                    setErrorStatus(`Falta archivo en /music/${currentTrack.id}.mp3`);
                    setIsPlaying(false);
                });
            }
        }
    }, [currentIndex]); // Only re-run if track changes natively

    // HTML5 Audio Event Handlers
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => playNext();
    const handleError = () => {
        setIsPlaying(false);
        setErrorStatus(`Falta el archivo mp3`);
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-primary/30 p-2 sm:p-4 z-[60] text-white">
            {/* Hidden audio element driving playback */}
            <audio
                ref={audioRef}
                src={trackAudioUrl}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onError={handleError}
            />

            <div className="container max-w-5xl mx-auto flex items-center justify-between gap-4">

                {/* Left Side: Artwork & Track Info block mimicking native players */}
                <div className="flex items-center gap-3 w-1/3 min-w-0">
                    {/* Custom Album Art / Vinyl Disc */}
                    <motion.div
                        animate={{ rotate: isPlaying ? 360 : 0 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-primary/50 relative shadow-[0_0_15px_oklch(var(--color-primary)/0.4)] flex-shrink-0 bg-neutral-900"
                    >
                        <img
                            src={trackCoverUrl}
                            alt="Track Cover"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback if cover image is missing
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                const fallbackSvg = document.createElement('div');
                                // We simulate the golden vinyl if no image exists
                                fallbackSvg.innerHTML = `<svg viewBox="0 0 24 24" fill="oklch(var(--color-primary))" class="w-8 h-8 mx-auto -mt-4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>`;
                                e.currentTarget.parentElement?.appendChild(fallbackSvg.firstChild as Node);
                            }}
                        />
                        {/* Center vinyl hole overlay */}
                        <div className="absolute inset-0 m-auto w-3 h-3 md:w-4 md:h-4 rounded-full bg-black border border-white/20 z-10" />
                    </motion.div>

                    {/* Title & Artist */}
                    <div className="flex flex-col min-w-0">
                        <p className="text-white font-sans text-sm md:text-base font-semibold truncate max-w-[120px] sm:max-w-[200px]">
                            {currentTrack.title}
                        </p>
                        <p className="text-primary text-xs md:text-sm truncate max-w-[120px] sm:max-w-[150px]">
                            {currentTrack.artist}
                        </p>
                        {errorStatus && (
                            <p className="text-red-400 text-[10px] hidden md:block">
                                {errorStatus}
                            </p>
                        )}
                    </div>
                </div>

                {/* Center: Playback Controls */}
                <div className="flex flex-col items-center justify-center gap-1 w-1/3">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <button onClick={playPrevious} className="text-white/60 hover:text-white transition-colors">
                            <SkipBack size={24} />
                        </button>
                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
                        >
                            {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
                        </button>
                        <button onClick={playNext} className="text-white/60 hover:text-white transition-colors">
                            <SkipForward size={24} />
                        </button>
                    </div>
                    {errorStatus && (
                        <p className="text-red-400 text-[10px] text-center md:hidden leading-tight">
                            {errorStatus}
                        </p>
                    )}
                </div>

                {/* Right side: Golden Soundbars */}
                <div className="flex items-center justify-end gap-4 w-1/3 relative">
                    <div className="hidden sm:block text-right mr-4 divide-y divide-white/10">
                        <p className="text-white text-xs font-serif uppercase tracking-[0.2em] font-medium pb-1">Ultra Premium</p>
                        <p className="text-primary text-[10px] uppercase tracking-wider pt-1">{currentTrack.id} / {WEDDING_PLAYLIST.length}</p>
                    </div>

                    <div className="flex items-end gap-[3px] h-8 flex-shrink-0">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1 sm:w-1.5 bg-primary rounded-t-sm origin-bottom"
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
