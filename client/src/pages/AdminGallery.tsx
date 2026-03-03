import { useState, useCallback, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { useAuth } from "../_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminGallery() {
    const { user, isAuthenticated } = useAuth();
    const [, navigate] = useLocation();
    const [photos, setPhotos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");

    // Redirigir si no es admin
    useEffect(() => {
        if (!isAuthenticated) navigate("/");
        if (user && user.role !== "admin") navigate("/galeria");
    }, [isAuthenticated, user, navigate]);

    const fetchPhotos = useCallback(async () => {
        try {
            // In a real app we'd pass JWT, here we rely on the session/cookie or simple param since it's an MVP
            const res = await fetch(`/api/photos/admin?userId=${user?.id}`);
            if (res.ok) {
                const data = await res.json();
                setPhotos(data);
            }
        } catch (err) {
            console.error("Error fetching admin photos", err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user?.role === 'admin') fetchPhotos();
    }, [fetchPhotos, user]);

    const handleStatusChange = async (photoId: number, status: "approved" | "rejected") => {
        try {
            const res = await fetch(`/api/photos/${photoId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, adminId: user?.id }),
            });
            if (res.ok) {
                toast.success(`Foto ${status === 'approved' ? 'aprobada' : 'rechazada'}.`);
                fetchPhotos(); // recargar
            } else {
                toast.error("Error al actualizar la foto.");
            }
        } catch (err) {
            toast.error("Error de conexión.");
        }
    };

    const filteredPhotos = photos.filter(p => p.status === filter);

    if (!isAuthenticated || user?.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-background pt-[80px] pb-24">
            <div className="container mx-auto px-4">

                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-primary mb-2">Moderación de Galería</h1>
                        <p className="text-muted-foreground font-sans">
                            Aprueba o rechaza las fotos que suben tus invitados.
                        </p>
                    </div>
                    <div className="flex gap-2 bg-muted p-1 rounded-lg">
                        <Button
                            variant={filter === "pending" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setFilter("pending")}
                        >
                            <Clock className="w-4 h-4 mr-2" /> Pendientes
                        </Button>
                        <Button
                            variant={filter === "approved" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setFilter("approved")}
                        >
                            <CheckCircle className="w-4 h-4 mr-2" /> Aprobadas
                        </Button>
                        <Button
                            variant={filter === "rejected" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setFilter("rejected")}
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Rechazadas
                        </Button>
                    </div>
                </header>

                {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Cargando fotos...</div>
                ) : filteredPhotos.length === 0 ? (
                    <div className="text-center py-24 text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border/50">
                        No hay fotos en la pestaña "{filter}".
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredPhotos.map((photo, i) => (
                            <motion.div
                                key={photo.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="group flex flex-col gap-2"
                            >
                                <div className="relative rounded-lg overflow-hidden shadow-sm aspect-square bg-muted">
                                    <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex justify-between items-center px-1">
                                    <span className="text-xs text-muted-foreground truncate" title={`Subida por usuario #${photo.uploadedBy || 'Desconocido'}`}>
                                        Usuario #{photo.uploadedBy || 'Anon'}
                                    </span>

                                    {filter === "pending" && (
                                        <div className="flex gap-1">
                                            <Button
                                                size="icon" variant="outline"
                                                className="w-7 h-7 bg-green-500/10 hover:bg-green-500 hover:text-white text-green-600 border-green-200 transition-colors"
                                                onClick={() => handleStatusChange(photo.id, "approved")}
                                                title="Aprobar Foto"
                                            >
                                                <CheckCircle size={14} />
                                            </Button>
                                            <Button
                                                size="icon" variant="outline"
                                                className="w-7 h-7 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 border-red-200 transition-colors"
                                                onClick={() => handleStatusChange(photo.id, "rejected")}
                                                title="Rechazar Foto"
                                            >
                                                <XCircle size={14} />
                                            </Button>
                                        </div>
                                    )}

                                    {filter === "rejected" && (
                                        <Button
                                            size="sm" variant="outline"
                                            className="h-7 text-xs bg-green-500/10 hover:bg-green-500 text-green-600"
                                            onClick={() => handleStatusChange(photo.id, "approved")}
                                        >
                                            Recuperar
                                        </Button>
                                    )}

                                    {filter === "approved" && (
                                        <Button
                                            size="sm" variant="outline"
                                            className="h-7 text-xs bg-red-500/10 hover:bg-red-500 text-red-600"
                                            onClick={() => handleStatusChange(photo.id, "rejected")}
                                        >
                                            Quitar
                                        </Button>
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
