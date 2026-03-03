import { useState, useCallback, useEffect } from "react";
import { Upload, Image as ImageIcon, CheckCircle, Clock, Gift } from "lucide-react";
import { useAuth } from "../_core/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "../lib/trpc";

export default function MyGallery() {
    const { user, isAuthenticated } = useAuth();
    const [, navigate] = useLocation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [myPhotos, setMyPhotos] = useState<any[]>([]);

    const utils = trpc.useUtils();
    const { data: gifts = [], isLoading: loadingGifts } = trpc.gifts.getGifts.useQuery(undefined, {
        enabled: isAuthenticated
    });

    const claimGiftMutation = trpc.gifts.claim.useMutation({
        onSuccess: () => {
            toast.success("¡Regalo reservado con éxito! Gracias.");
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
        if (!isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate]);

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

    return (
        <div className="min-h-screen bg-background pt-[80px] pb-24">
            <div className="container max-w-4xl mx-auto px-4">

                <header className="mb-8 flex justify-between items-center">
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

                {/* Gift Registry Section */}
                <h2 className="font-serif text-2xl font-bold text-primary mb-2 flex items-center gap-2">
                    <Gift className="text-primary" /> Lista de Regalos Sugeridos
                </h2>
                <p className="text-muted-foreground font-sans mb-6">
                    Si deseas hacernos un obsequio, aquí te compartimos algunas sugerencias. Puedes elegir un regalo de la lista para evitar repeticiones. ¡Muchas gracias!
                </p>

                {loadingGifts ? (
                    <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg mb-12">
                        Cargando lista de regalos...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                        <AnimatePresence>
                            {gifts.map((gift: any, i: number) => {
                                const isClaimed = gift.claimedByUserId !== null;
                                const isClaimedByMe = gift.claimedByUserId === user?.id;

                                return (
                                    <motion.div
                                        key={gift.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: i * 0.05 }}
                                    >
                                        <Card className={`h-full border ${isClaimedByMe ? 'border-primary bg-primary/5' : isClaimed ? 'border-muted bg-muted/20 opacity-70' : 'border-primary/20 hover:border-primary/50'} transition-all`}>
                                            <CardContent className="p-5 flex flex-col justify-between h-full">
                                                <div>
                                                    <h3 className={`font-serif text-lg font-bold mb-2 ${isClaimed && !isClaimedByMe ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                                        {gift.name}
                                                    </h3>
                                                </div>
                                                <div className="mt-4">
                                                    {isClaimedByMe ? (
                                                        <Button
                                                            variant="outline"
                                                            className="w-full border-primary/50 text-primary hover:bg-primary/10"
                                                            onClick={() => unclaimGiftMutation.mutate({ giftId: gift.id })}
                                                            disabled={unclaimGiftMutation.isPending}
                                                        >
                                                            Cancelar Reserva
                                                        </Button>
                                                    ) : isClaimed ? (
                                                        <Button
                                                            variant="secondary"
                                                            className="w-full bg-muted text-muted-foreground cursor-not-allowed"
                                                            disabled
                                                        >
                                                            Reservado
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                                                            onClick={() => claimGiftMutation.mutate({ giftId: gift.id })}
                                                            disabled={claimGiftMutation.isPending}
                                                        >
                                                            Elegir Regalo
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* My Uploads Grid */}
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
        </div>
    );
}
