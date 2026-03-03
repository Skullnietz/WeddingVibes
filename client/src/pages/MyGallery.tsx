import { useState, useCallback, useEffect, useRef } from "react";
import { Heart, Gift, Upload, Camera, Copy, Check, ChevronRight, ChevronLeft, X, Info, Lock, Clock, CheckCircle, HelpCircle, Play, Pause, FastForward, SkipBack, CalendarCheck, ShoppingCart } from "lucide-react";
import { useAuth } from "../_core/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "../lib/trpc";

export default function MyGallery() {
    const { user, isAuthenticated, loading } = useAuth();
    const [, navigate] = useLocation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [myPhotos, setMyPhotos] = useState<any[]>([]);
    const [isChangingGift, setIsChangingGift] = useState(false);
    const [showPurchaseLinks, setShowPurchaseLinks] = useState(false);

    // Tour State
    const [tourStep, setTourStep] = useState(0); // 0 means closed, 1, 2, 3 are the steps
    const giftSectionRef = useRef<HTMLDivElement>(null);
    const uploadSectionRef = useRef<HTMLDivElement>(null);
    const gallerySectionRef = useRef<HTMLDivElement>(null);

    const utils = trpc.useUtils();
    const { data: rsvp, isLoading: loadingRsvp } = trpc.rsvp.getByUser.useQuery(undefined, {
        enabled: isAuthenticated
    });
    const hasRsvped = !!rsvp;
    const isAttending = rsvp?.isAttending === true;

    const { data: gifts = [], isLoading: loadingGifts } = trpc.gifts.getGifts.useQuery(undefined, {
        enabled: isAuthenticated && isAttending
    });

    const claimGiftMutation = trpc.gifts.claim.useMutation({
        onSuccess: () => {
            toast.success("¡Regalo reservado con éxito! Gracias.");
            setIsChangingGift(false);
            utils.gifts.getGifts.invalidate();
        },
        onError: (err) => {
            toast.error(err.message || "No se pudo reservar el regalo.");
        }
    });

    const unclaimGiftMutation = trpc.gifts.unclaim.useMutation({
        onSuccess: () => {
            toast.success("Reservación cancelada.");
            utils.gifts.getGifts.invalidate();
        },
        onError: (err) => {
            toast.error(err.message || "No se pudo cancelar la reservación.");
        }
    });

    // Redirigir si no ha iniciado sesión
    useEffect(() => {
        if (!loading && !isAuthenticated) navigate("/");
    }, [loading, isAuthenticated, navigate]);

    // Initialize Tour
    useEffect(() => {
        if (isAuthenticated && isAttending && !loadingRsvp) {
            const hasSeenTour = localStorage.getItem("hasSeenGalleryTour");
            if (!hasSeenTour) {
                // Give the page a moment to render
                setTimeout(() => {
                    setTourStep(1);
                    // Scroll to appropriate section once rendered
                    setTimeout(() => {
                        giftSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                }, 1000);
            }
        }
    }, [isAuthenticated, isAttending, loadingRsvp]);

    const closeTour = () => {
        setTourStep(0);
        localStorage.setItem("hasSeenGalleryTour", "true");
    };

    const nextTourStep = () => {
        if (tourStep === 3) {
            closeTour();
        } else {
            setTourStep(s => s + 1);
        }

        // Scroll to appropriate section
        setTimeout(() => {
            if (tourStep === 0) giftSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (tourStep === 1) uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (tourStep === 2) gallerySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const prevTourStep = () => {
        setTourStep(s => Math.max(1, s - 1));

        // Scroll to appropriate section
        setTimeout(() => {
            if (tourStep === 2) giftSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (tourStep === 3) uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const fetchMyPhotos = useCallback(async () => {
        if (!user) return;
        try {
            const res = await fetch(`/api/photos/mine?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setMyPhotos(data);
            }
        } catch (err) {
            console.error("Error fetching photos", err);
        }
    }, [user]);

    useEffect(() => {
        fetchMyPhotos();
    }, [fetchMyPhotos]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Por favor, selecciona una imagen.");
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setPreview(null);
    };

    const handleUpload = async () => {
        if (!selectedFile || !user) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append("photo", selectedFile);
        formData.append("userId", user.id.toString());
        formData.append("title", "Recuerdo de la Boda");

        try {
            const res = await fetch("/api/photos/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Foto subida con éxito.");
                clearSelection();
                fetchMyPhotos(); // Refresh grid
            } else {
                toast.error(data.error || "Hubo un error al subir la foto.");
            }
        } catch (err) {
            toast.error("Error de conexión al servidor.");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isAuthenticated) return null;

    if (loadingRsvp) {
        return (
            <div className="min-h-screen bg-background pt-[80px] pb-24 flex items-center justify-center">
                <div className="text-muted-foreground animate-pulse">Cargando...</div>
            </div>
        );
    }

    if (!hasRsvped || !isAttending) {
        return (
            <div className="min-h-screen bg-background pt-[80px] pb-24 relative flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center bg-white/80 backdrop-blur-md shadow-xl border-primary/20">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="text-primary w-8 h-8" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-primary mb-4">
                        {hasRsvped && !isAttending ? "Galería No Disponible" : "Sección Protegida"}
                    </h2>
                    <p className="text-muted-foreground font-sans mb-8">
                        {hasRsvped && !isAttending
                            ? "Como nos indicaste que no podrás acompañarnos en la boda, la galería privada y mesa de regalos están deshabilitadas. Si cambias de opinión, puedes actualizar tu confirmación."
                            : "Para poder acceder a tu Galería Privada y a la Mesa de Regalos interactiva, primero debes confirmar tu asistencia a la boda. ¡Nos encantaría contar contigo!"}
                    </p>
                    <Button
                        size="lg"
                        onClick={() => {
                            navigate("/");
                            setTimeout(() => {
                                document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
                            }, 500); // 500ms allows the Next page to load before scrolling
                        }}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md font-serif text-lg py-6"
                    >
                        <CalendarCheck className="mr-3" size={20} />
                        {hasRsvped && !isAttending ? "Actualizar Asistencia" : "Confirmar Asistencia"}
                    </Button>
                </Card>
            </div>
        );
    }

    const myClaimedGift = gifts.find((g: any) => g.claimedByUserId === user?.id);
    const showExclusiveView = !!myClaimedGift && !isChangingGift;
    const showGridView = !myClaimedGift || isChangingGift;

    const getGiftImage = (name: string) => {
        const n = name.toUpperCase();
        if (n.includes("BATERIA")) return "/gifts/bateria_cocina.png";
        if (n.includes("EDREDON")) return "/gifts/edredon_matrimonial.png";
        if (n.includes("SABANAS")) return "/gifts/sabanas_matrimoniales.png";
        if (n.includes("ALMOHADA")) return "/gifts/juego_almohadas.png";
        if (n.includes("FREIDORA")) return "/gifts/freidora_aire.png";
        if (n.includes("DISPENSADOR")) return "/gifts/dispensador_agua.png";
        if (n.includes("VAJILLA")) return "/gifts/vajilla.png";
        if (n.includes("CUBIERTOS")) return "/gifts/juego_cubiertos.png";
        if (n.includes("SARTEN")) return "/gifts/sartenes.png";
        if (n.includes("TOALLA")) return "/gifts/juego_toallas.png";
        if (n.includes("CAFETERA")) return "/gifts/cafetera.png";
        if (n.includes("DESPENSA")) return "/gifts/despensa.png";
        if (n.includes("VELAS")) return "/gifts/velas_aromaticas.png";
        if (n.includes("ESQUINERO")) return "/gifts/esquinero_bano.png";
        if (n.includes("BAÑO")) return "/gifts/juego_bano.png";
        if (n.includes("ESTUFA")) return "/gifts/estufa_electrica.png";
        if (n.includes("BOILER")) return "/gifts/boiler_electrico.png";
        if (n.includes("MALETAS")) return "/gifts/juego_maletas.png";
        if (n.includes("LONCHERA")) return "/gifts/loncheras.png";
        if (n.includes("LICUADORA")) return "/gifts/licuadora_portatil.png";
        if (n.includes("COLCHON")) return "/gifts/colchon_inflable.png";
        if (n.includes("CUCHILLOS")) return "/gifts/juego_cuchillos.png";
        if (n.includes("KARCHER")) return "/gifts/karcher.png";
        return "/gifts/bateria_cocina.png"; // Fallback
    };

    return (
        <div className="min-h-screen bg-background pt-[80px] pb-24 relative">
            {/* Custom Interactive Tour Overlay */}
            <AnimatePresence>
                {tourStep > 0 && (
                    <>
                        {/* Dark Backdrop (z-50) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 pointer-events-none bg-black/60 backdrop-blur-sm"
                        />

                        {/* Dialog (z-60) fixed at the bottom to avoid hiding the highlighted element */}
                        <motion.div
                            initial={{ opacity: 0, y: 50, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, x: "-50%" }}
                            exit={{ opacity: 0, y: 50, x: "-50%" }}
                            className="fixed bottom-6 sm:bottom-12 left-1/2 z-[60] bg-white/95 dark:bg-zinc-900/95 border border-primary/20 p-6 sm:p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-sm sm:max-w-md w-[calc(100%-2rem)] pointer-events-auto"
                        >
                            <button onClick={closeTour} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                                <X size={20} />
                            </button>

                            <div className="mb-6">
                                <h3 className="font-serif text-2xl font-bold text-primary mb-3 pr-6">
                                    {tourStep === 1 && "Mesa de Regalos"}
                                    {tourStep === 2 && "Compartir Fotografías"}
                                    {tourStep === 3 && "Tus Colecciones"}
                                </h3>
                                <p className="text-muted-foreground text-[15px] leading-relaxed">
                                    {tourStep === 1 && "¡Hola! Si lo deseas, puedes elegir uno de los obsequios de nuestra mesa de regalos. Es totalmente opcional, pero agradecemos muchísimo cualquier lindo detalle."}
                                    {tourStep === 2 && "¡Queremos ver la boda desde tus ojos! En esta sección podrás subir todas las increíbles fotografías que captures durante nuestro evento."}
                                    {tourStep === 3 && "Aquí aparecerán todas las fotos que hayas subido. Podrás ver y revisar el estado de cada una, ya sea que han sido 'aprobadas' o 'pendientes'."}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex gap-2">
                                    <div className={`h-2.5 w-2.5 rounded-full transition-colors ${tourStep === 1 ? 'bg-primary' : 'bg-primary/20'} `} />
                                    <div className={`h-2.5 w-2.5 rounded-full transition-colors ${tourStep === 2 ? 'bg-primary' : 'bg-primary/20'} `} />
                                    <div className={`h-2.5 w-2.5 rounded-full transition-colors ${tourStep === 3 ? 'bg-primary' : 'bg-primary/20'} `} />
                                </div>

                                <div className="flex gap-2">
                                    {tourStep > 1 && (
                                        <Button variant="outline" size="sm" onClick={prevTourStep} className="font-serif">
                                            <ChevronLeft size={16} className="mr-1" /> Atrás
                                        </Button>
                                    )}
                                    <Button size="sm" onClick={nextTourStep} className="font-serif shadow-md">
                                        {tourStep === 3 ? "¡Entendido!" : "Siguiente"} {tourStep !== 3 && <ChevronRight size={16} className="ml-1" />}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="container max-w-4xl mx-auto px-4">

                {/* Gift Registry Section (Grid View) - AT THE VERY TOP */}
                {showGridView && (
                    <div className={`mb-12 mt-4 transition-all duration-500 rounded-2xl ${tourStep === 1 ? 'z-[51] relative ring-4 ring-primary ring-offset-8 ring-offset-background bg-background p-4' : 'p-0'} `} ref={giftSectionRef}>
                        <h2 className="font-serif text-3xl font-bold text-primary mb-2 flex items-center gap-2">
                            <Gift className="text-primary" /> Mesa de Regalos
                        </h2>
                        <p className="text-muted-foreground font-sans mb-6 text-lg">
                            Si deseas hacernos un obsequio, aquí te compartimos algunas sugerencias.
                        </p>

                        {loadingGifts ? (
                            <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg">
                                Cargando lista de regalos...
                            </div>
                        ) : (
                            <div>

                                {isChangingGift && (
                                    <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg mb-6 flex justify-between items-center">
                                        <p className="font-serif text-primary text-sm sm:text-base">Estás buscando un nuevo obsequio. Al elegir uno, el anterior se liberará.</p>
                                        <Button variant="ghost" onClick={() => setIsChangingGift(false)} className="text-primary hover:bg-primary/20 whitespace-nowrap ml-4">
                                            Cancelar Cambio
                                        </Button>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <AnimatePresence>
                                        {gifts.map((gift: any, i: number) => {
                                            const isClaimed = gift.claimedByUserId !== null;
                                            const isClaimedByMe = gift.claimedByUserId === user?.id;

                                            // Handle edge case: if changing gift, hide the one that's currently ours
                                            if (isClaimedByMe && isChangingGift) return null;

                                            const imageUrl = getGiftImage(gift.name);

                                            return (
                                                <motion.div
                                                    key={gift.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                                    className="h-full"
                                                >
                                                    <Card className={`relative overflow-hidden h-64 sm:h-72 border-0 group transition-all duration-500 rounded-xl shadow-md hover:shadow-xl ${isClaimed && !isClaimedByMe ? 'opacity-70 grayscale-[30%]' : ''} `}>
                                                        {/* Background Image */}
                                                        <div
                                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                                            style={{ backgroundImage: `url(${imageUrl})` }}
                                                        />
                                                        {/* Gradient Overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-300 group-hover:from-black/95" />

                                                        {/* Claimant info pill if claimed by someone else */}
                                                        {isClaimed && !isClaimedByMe && gift.claimerName && (
                                                            <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md rounded-full py-1.5 px-3 flex items-center gap-2 border border-white/10 shadow-lg">
                                                                <div className="w-5 h-5 rounded-full bg-primary/80 flex items-center justify-center text-[10px] text-white overflow-hidden">
                                                                    {gift.claimerAvatar ? (
                                                                        <img src={gift.claimerAvatar} alt={gift.claimerName} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        gift.claimerName.charAt(0).toUpperCase()
                                                                    )}
                                                                </div>
                                                                <span className="text-white/90 text-xs font-medium truncate max-w-[100px]">
                                                                    {gift.claimerName.split(' ')[0]}
                                                                </span>
                                                            </div>
                                                        )}

                                                        <CardContent className="relative h-full p-6 flex flex-col justify-end z-10">
                                                            <div className="transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                                                                <h3 className={`font-serif text-2xl leading-tight font-bold text-white mb-4 drop-shadow-md`}>
                                                                    {gift.name}
                                                                </h3>

                                                                <div className="mt-4">
                                                                    {isClaimed && !isClaimedByMe ? (
                                                                        <Button
                                                                            variant="secondary"
                                                                            className="w-full bg-black/40 backdrop-blur-sm text-white/50 border border-white/10 cursor-not-allowed font-serif pointer-events-none"
                                                                            disabled
                                                                        >
                                                                            No disponible
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            className="w-full bg-primary/90 backdrop-blur-sm hover:bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,255,255,0.2)] font-serif tracking-wide transition-all"
                                                                            onClick={() => claimGiftMutation.mutate({ giftId: gift.id })}
                                                                            disabled={claimGiftMutation.isPending || isClaimedByMe}
                                                                        >
                                                                            {isClaimedByMe ? "Seleccionado" : "Elegir Regalo"}
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>

                                {/* Bank Transfer Option */}
                                <Card className="p-6 mt-12 mb-4 border-primary/20 bg-primary/5 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Heart size={80} className="text-primary" />
                                    </div>
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="bg-white p-3 rounded-full shadow-sm shrink-0">
                                            <Heart className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="w-full">
                                            <h3 className="font-serif text-xl font-bold text-primary mb-2">Transferencia Bancaria</h3>
                                            <p className="text-muted-foreground font-sans mb-4">Si prefieres hacernos un obsequio en efectivo, aquí tienes nuestros datos bancarios:</p>
                                            <div className="bg-white p-4 rounded-lg shadow-inner space-y-3 relative">
                                                <div className="flex items-center justify-between gap-4">
                                                    <p className="font-sans text-sm flex-1"><span className="font-semibold text-foreground">Banco:</span> BBVA</p>
                                                </div>
                                                <div className="flex items-center justify-between gap-4">
                                                    <p className="font-sans text-sm flex-1"><span className="font-semibold text-foreground">Cuenta:</span> 123456789</p>
                                                    <Button variant="ghost" size="sm" className="h-8 shadow-sm border border-border/50 text-xs px-2 shrink-0" onClick={() => { navigator.clipboard.writeText("123456789"); toast.success("Cuenta copiada al portapapeles"); }}>
                                                        <Copy size={14} className="mr-1" /> Copiar
                                                    </Button>
                                                </div>
                                                <div className="flex items-center justify-between gap-4">
                                                    <p className="font-sans text-sm flex-1"><span className="font-semibold text-foreground">CLABE:</span> 002180000000123456789</p>
                                                    <Button variant="ghost" size="sm" className="h-8 shadow-sm border border-border/50 text-xs px-2 shrink-0" onClick={() => { navigator.clipboard.writeText("002180000000123456789"); toast.success("CLABE copiada al portapapeles"); }}>
                                                        <Copy size={14} className="mr-1" /> Copiar
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                )}

                <header className="mb-8 mt-12 flex justify-between items-center border-t border-primary/20 pt-8" ref={uploadSectionRef}>
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-primary mb-2">Mi Galería</h1>
                        <p className="text-muted-foreground font-sans">
                            Sube tus fotos de la boda. Una vez aprobadas, aparecerán en la galería oficial.
                        </p>
                    </div>
                    {user?.role === 'admin' && (
                        <Button onClick={() => navigate("/admin/galeria")} variant="outline" className="font-serif">
                            Panel Admin
                        </Button>
                    )}
                </header>

                {/* Upload Zone */}
                <div className={`transition-all duration-500 rounded-2xl ${tourStep === 2 ? 'z-[51] relative ring-4 ring-primary ring-offset-8 ring-offset-background bg-background' : ''} `}>
                    <Card className="mb-12 border-dashed border-2 bg-muted/20">
                        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                            {preview ? (
                                <div className="w-full max-w-md mx-auto relative group">
                                    <img src={preview} alt="Vista previa" className="w-full h-auto rounded-lg shadow-md mb-4" />
                                    <div className="flex gap-4 justify-center">
                                        <Button variant="outline" onClick={clearSelection} disabled={isUploading}>
                                            Cancelar
                                        </Button>
                                        <Button onClick={handleUpload} disabled={isUploading} className="bg-primary group-hover:bg-primary/90">
                                            {isUploading ? "Subiendo..." : "Subir Foto"}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <label className="cursor-pointer w-full flex flex-col items-center p-12 overflow-hidden">
                                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110">
                                        <Upload size={32} />
                                    </div>
                                    <h3 className="font-serif text-xl font-semibold mb-2">Toca para subir una foto</h3>
                                    <p className="text-sm text-muted-foreground max-w-sm">
                                        Formatos soportados: JPG, PNG. Tamaño máximo 20MB.
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* My Uploads Grid */}
                <div className={`transition-all duration-500 rounded-2xl ${tourStep === 3 ? 'z-[51] relative ring-4 ring-primary ring-offset-8 ring-offset-background bg-background p-4' : 'p-0'} `} ref={gallerySectionRef}>
                    <h2 className="font-serif text-2xl font-bold text-primary mb-6">Mis Fotos ({myPhotos.length})</h2>
                    {myPhotos.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg">
                            Aún no has subido ninguna foto. ¡Sé el primero en compartir!
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {myPhotos.map((photo, i) => (
                                <motion.div
                                    key={photo.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    className="relative rounded-lg overflow-hidden shadow-sm aspect-square bg-muted group"
                                >
                                    <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />

                                    {/* Status Overlay */}
                                    <div className="absolute top-2 right-2 z-10">
                                        {photo.status === 'approved' ? (
                                            <div className="bg-green-500/90 text-white backdrop-blur-sm px-2 py-1 flex items-center gap-1 rounded-full text-[10px] font-bold shadow-md">
                                                <CheckCircle size={12} /> Aprobada
                                            </div>
                                        ) : photo.status === 'rejected' ? (
                                            <div className="bg-red-500/90 text-white backdrop-blur-sm px-2 py-1 flex items-center gap-1 rounded-full text-[10px] font-bold shadow-md">
                                                Rechazada
                                            </div>
                                        ) : (
                                            <div className="bg-orange-500/90 text-white backdrop-blur-sm px-2 py-1 flex items-center gap-1 rounded-full text-[10px] font-bold shadow-md">
                                                <Clock size={12} /> Pendiente
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Exclusive Gift Section (Chosen Gift) - After My Photos */}
                {showExclusiveView && myClaimedGift && (
                    <div className={`mt - 20 pt - 16 border-t border-primary/20 transition-all duration-500 rounded-2xl ${tourStep === 1 ? 'z-[51] relative ring-4 ring-primary ring-offset-8 ring-offset-background bg-background p-4' : 'p-0'} `} ref={giftSectionRef}>
                        <h2 className="font-serif text-3xl font-bold text-primary mb-6 flex items-center justify-center gap-3 text-center">
                            <Gift className="text-primary" size={32} /> Mi Aportación
                        </h2>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-2xl mx-auto"
                        >
                            <div className="text-center mb-8">
                                <h3 className="font-serif text-2xl text-foreground mb-2">¡Elegiste este increíble obsequio!</h3>
                                <p className="text-muted-foreground text-lg">Muchas gracias por tu generosidad. Apreciamos enormemente este detalle que formará parte de nuestro nuevo hogar.</p>
                            </div>
                            <Card className={`relative overflow-hidden transition-all duration-500 border border-primary/20 shadow-2xl rounded-2xl group mx-auto ${showPurchaseLinks ? 'h-[550px] sm:h-[500px]' : 'h-80 sm:h-[450px]'}`}>
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${getGiftImage(myClaimedGift.name)})` }}
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

                                {/* Extra Dark Overlay for purchase links */}
                                <div className={`absolute inset-0 bg-black/70 transition-opacity duration-500 pointer-events-none z-0 ${showPurchaseLinks ? 'opacity-100' : 'opacity-0'}`} />

                                <Button
                                    variant="outline"
                                    size="icon"
                                    className={`absolute top-4 right-4 z-20 transition-all duration-300 rounded-full backdrop-blur-md border-white/30 shadow-lg ${showPurchaseLinks ? 'bg-white text-black hover:scale-110' : 'bg-black/40 text-white hover:bg-black/60 hover:scale-110'}`}
                                    onClick={() => setShowPurchaseLinks(!showPurchaseLinks)}
                                    title="Opciones de compra"
                                >
                                    <HelpCircle size={24} />
                                </Button>

                                <CardContent className="relative h-full p-8 sm:p-12 flex flex-col justify-end z-10 text-center transition-all duration-500">
                                    <h3 className={`font-serif text-3xl sm:text-5xl leading-tight font-bold text-white drop-shadow-xl transition-all duration-500 ${showPurchaseLinks ? 'mb-4' : 'mb-8'}`}>
                                        {myClaimedGift.name}
                                    </h3>

                                    <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-center transition-all duration-500">
                                        <Button
                                            className="bg-white/95 hover:bg-white text-black shadow-xl font-serif text-lg py-6 px-8 rounded-xl transition-all hover:scale-105"
                                            onClick={() => setIsChangingGift(true)}
                                        >
                                            Cambiar de Regalo
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="bg-black/30 backdrop-blur-md border-white/30 text-white hover:bg-black/50 hover:text-white transition-all shadow-xl font-serif text-lg py-6 px-8 rounded-xl"
                                            onClick={() => unclaimGiftMutation.mutate({ giftId: myClaimedGift.id })}
                                            disabled={unclaimGiftMutation.isPending}
                                        >
                                            Liberar Regalo
                                        </Button>
                                    </div>

                                    <AnimatePresence>
                                        {showPurchaseLinks && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                className="overflow-hidden flex flex-col sm:flex-row gap-3 justify-center items-center w-full"
                                            >
                                                <a href={`https://www.amazon.com.mx/s?k=${encodeURIComponent(myClaimedGift.name)}`} target="_blank" rel="noreferrer" className="flex-1 w-full sm:w-auto">
                                                    <Button className="w-full bg-[#FF9900] hover:bg-[#e88a00] text-black font-bold shadow-lg flex items-center justify-center gap-2 py-6 rounded-xl text-md transition-all hover:scale-105">
                                                        <ShoppingCart size={20} /> Amazon
                                                    </Button>
                                                </a>
                                                <a href={`https://listado.mercadolibre.com.mx/${encodeURIComponent(myClaimedGift.name)}`} target="_blank" rel="noreferrer" className="flex-1 w-full sm:w-auto">
                                                    <Button className="w-full bg-[#FFE600] hover:bg-[#e6d000] text-[#2D3277] font-bold shadow-lg flex items-center justify-center gap-2 py-6 rounded-xl text-md transition-all hover:scale-105">
                                                        <ShoppingCart size={20} /> MercadoLibre
                                                    </Button>
                                                </a>
                                                <a href={`https://www.liverpool.com.mx/tienda?s=${encodeURIComponent(myClaimedGift.name)}`} target="_blank" rel="noreferrer" className="flex-1 w-full sm:w-auto">
                                                    <Button className="w-full bg-[#E10098] hover:bg-[#c40084] text-white font-bold shadow-lg flex items-center justify-center gap-2 py-6 rounded-xl text-md transition-all hover:scale-105">
                                                        <ShoppingCart size={20} /> Liverpool
                                                    </Button>
                                                </a>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                )}

            </div>

            {/* Floating Help Button */}
            {tourStep === 0 && (
                <motion.div
                    className="fixed bottom-6 right-6 z-40"
                    initial={{ y: 0 }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.3)] bg-primary text-primary-foreground hover:bg-primary/90 transition-all sm:hover:scale-110"
                        onClick={() => {
                            setTourStep(1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        <HelpCircle size={28} />
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
