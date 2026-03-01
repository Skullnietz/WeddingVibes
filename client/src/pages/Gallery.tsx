import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, ChevronLeft, ChevronRight, Grid3X3, Maximize2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import CustomAudioPlayer from "@/components/CustomAudioPlayer";
import SongRequestBox from "@/components/SongRequestBox";

type ViewMode = "grid" | "slideshow";

export default function Gallery() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Fetch wedding photos
  const { data: weddingPhotos = [] } = trpc.photos.getWeddingPhotos.useQuery({
    category: selectedCategory,
  });

  // Redirect if not authenticated (temporarily disabled for testing)
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate("/");
  //   }
  // }, [isAuthenticated, navigate]);

  // Auto-advance slideshow
  useEffect(() => {
    // We check allPhotos.length later in rendering, but since hooks can't use derived state perfectly here without 
    // wrapping in useMemo, we'll just guard via simple checking.
    if (viewMode !== "slideshow" || !isPlaying) return;

    const interval = setInterval(() => {
      // Re-calculated from local length
      setCurrentSlideIndex((prev) => {
        // Dynamic calculation based on length to ensure we don't pass bounds
        const currentLength = PRE_WEDDING_PHOTOS.filter(p => !selectedCategory || p.category === selectedCategory).length + weddingPhotos.length;
        return currentLength === 0 ? 0 : (prev + 1) % currentLength;
      });
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(interval);
  }, [viewMode, isPlaying, weddingPhotos.length, selectedCategory]);

  // categories
  const categories = [
    { id: "pre-boda", label: "Pre-Boda" },
    { id: "ceremony", label: "Ceremonia" },
    { id: "reception", label: "Recepción" },
    { id: "dance", label: "Baile" },
    { id: "general", label: "General" },
  ];

  // Static pre-wedding photos
  const PRE_WEDDING_PHOTOS = [
    { id: "pre-1", category: "pre-boda", title: "Nuestra primer salida a bailar", imageUrl: "/gallery/Nuestra primer salida a bailar.jpeg" },
    { id: "pre-2", category: "pre-boda", title: "Esperando el año nuevo", imageUrl: "/gallery/Esperando el año nuevo.jpeg" },
    { id: "pre-3", category: "pre-boda", title: "En la boda de Tavito", imageUrl: "/gallery/En la boda de Tavito.jpeg" },
    { id: "pre-4", category: "pre-boda", title: "De paseo en la marquesa", imageUrl: "/gallery/De paseo en la marquesa.jpeg" },
    { id: "pre-5", category: "pre-boda", title: "Esperando navidad", imageUrl: "/gallery/Esperando navidad.jpeg" },
    { id: "pre-6", category: "pre-boda", title: "El cumple de Gonz", imageUrl: "/gallery/El cumple de Gonz.jpeg" },
    { id: "pre-7", category: "pre-boda", title: "Anillos de compromiso", imageUrl: "/gallery/Anillos de compromiso.jpeg" },
    { id: "pre-8", category: "pre-boda", title: "En el cantón", imageUrl: "/gallery/En el cantón.jpeg" },
    { id: "pre-9", category: "pre-boda", title: "En el cumple de Pepe", imageUrl: "/gallery/En el cumple de Pepe.jpeg" },
    { id: "pre-10", category: "pre-boda", title: "De paseo en galerías", imageUrl: "/gallery/De paseo en galerías.jpeg" },
    { id: "pre-11", category: "pre-boda", title: "En el cine", imageUrl: "/gallery/En el cine.jpeg" },
    { id: "pre-12", category: "pre-boda", title: "De fiesta con Reny", imageUrl: "/gallery/De fiesta con Reny.jpeg" },
    { id: "pre-13", category: "pre-boda", title: "De paseo en el zoológico", imageUrl: "/gallery/De paseo en el zoológico.jpeg" },
    { id: "pre-14", category: "pre-boda", title: "En la plaza comercial", imageUrl: "/gallery/En la plaza comercial.jpeg" },
    { id: "pre-15", category: "pre-boda", title: "En Querétaro en el cumple de Dany", imageUrl: "/gallery/En Querétaro en el cumple de Dany.jpeg" },
  ];

  // Combine fetched photos with static photos
  const allPhotos = [
    ...PRE_WEDDING_PHOTOS.filter(p => !selectedCategory || p.category === selectedCategory),
    ...weddingPhotos
  ];

  // The categories object is already declared above

  const handlePreviousSlide = () => {
    setCurrentSlideIndex((prev) =>
      prev === 0 ? allPhotos.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % allPhotos.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-sans font-semibold">Volver</span>
          </button>
          <h1 className="font-serif text-2xl font-bold text-primary">
            Galería de la Boda
          </h1>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="font-serif"
            >
              <Grid3X3 size={16} className="mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "slideshow" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("slideshow")}
              className="font-serif"
            >
              <Maximize2 size={16} className="mr-2" />
              Presentación
            </Button>
          </div>
        </div>
      </header>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="container py-12">
          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              onClick={() => setSelectedCategory(undefined)}
              className="font-serif"
            >
              Todos
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className="font-serif"
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative group overflow-hidden rounded-lg cursor-pointer max-h-64 bg-muted/20"
                onClick={() => {
                  setViewMode("slideshow");
                  setCurrentSlideIndex(index);
                }}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title ? photo.title : "Foto de la boda"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="text-white" size={32} fill="white" />
                </div>
                {photo.title ? (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-sans text-sm font-semibold">
                      {photo.title}
                    </p>
                  </div>
                ) : null}
              </motion.div>
            ))}
          </div>

          {allPhotos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No hay fotos disponibles en esta categoría
              </p>
            </div>
          )}

          {/* Song Request Box */}
          <div className="mt-16">
            <SongRequestBox />
          </div>
        </div>
      )}

      {/* Slideshow View */}
      {viewMode === "slideshow" && allPhotos.length > 0 && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden">
          {/* Close button */}
          <button
            onClick={() => setViewMode("grid")}
            className="absolute top-6 right-6 z-50 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md"
          >
            <span className="text-xl md:text-2xl">✕</span>
          </button>

          {/* Main image */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Blurred Background Image */}
                <img
                  src={allPhotos[currentSlideIndex]?.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-3xl scale-125 opacity-80"
                />
                <div className="absolute inset-0 bg-black/40" />

                {/* Main Foreground Image */}
                <img
                  src={allPhotos[currentSlideIndex]?.imageUrl}
                  alt={allPhotos[currentSlideIndex]?.title ? allPhotos[currentSlideIndex].title : "Foto de la boda"}
                  className="relative z-10 w-full h-[85vh] md:h-full object-contain p-4 md:p-12 pb-32 md:pb-40 drop-shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/50 z-20 pointer-events-none" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Description Overlay */}
          <div className="absolute bottom-[100px] left-0 right-0 z-40 text-center px-6 pointer-events-none">
            <motion.div
              key={currentSlideIndex + 'text'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <p className="text-xl md:text-3xl font-serif text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-2">
                {allPhotos[currentSlideIndex]?.title ? allPhotos[currentSlideIndex].title : "Nuestra Boda"}
              </p>
              {/* @ts-ignore - The database description type may vary slightly from the static object */}
              {allPhotos[currentSlideIndex]?.description ? (
                <p className="text-sm md:text-base text-gray-200 drop-shadow-md">
                  {/* @ts-ignore */}
                  {allPhotos[currentSlideIndex].description}
                </p>
              ) : null}
              <p className="text-xs text-white/50 mt-4 tracking-widest font-sans uppercase">
                {currentSlideIndex + 1} / {allPhotos.length}
              </p>
            </motion.div>
          </div>

          {/* Navigation Controls Overlay */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
            <button
              onClick={handlePreviousSlide}
              className="pointer-events-auto text-white/50 hover:text-white transition-all hover:scale-110 bg-black/20 hover:bg-black/40 p-3 rounded-full backdrop-blur-sm"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={handleNextSlide}
              className="pointer-events-auto text-white/50 hover:text-white transition-all hover:scale-110 bg-black/20 hover:bg-black/40 p-3 rounded-full backdrop-blur-sm"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Slideshow Play/Pause */}
          <div className="absolute top-6 left-6 z-40">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white/70 hover:text-white transition-colors flex items-center gap-2 bg-black/30 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-sm font-sans"
            >
              {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
              {isPlaying ? "Pausar Álbum" : "Reproducir Álbum"}
            </button>
          </div>

          {/* Custom Web Audio Player */}
          <CustomAudioPlayer />
        </div>
      )}
    </div>
  );
}
