import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Menu, X, LogOut, Music, CalendarCheck, User as UserIcon, Gift } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";

// We extract WEDDING_DATA here or import it if it's centralized. Quick inline for now:
const WEDDING_DATA = {
    groom: "Gonzalo",
    bride: "Miriam",
    date: new Date("2026-04-11T14:30:00"),
};

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [location, navigate] = useLocation();
    const { user, isAuthenticated, logout } = useAuth();

    const { data: rsvp } = trpc.rsvp.getByUser.useQuery(undefined, {
        enabled: isAuthenticated
    });
    const hasRsvped = !!rsvp;
    const isAttending = rsvp?.isAttending === true;

    const { data: gifts = [] } = trpc.gifts.getGifts.useQuery(undefined, {
        enabled: isAuthenticated && isAttending
    });
    const hasClaimedGift = gifts.some((g: any) => g.claimedByUserId === user?.id);

    const getInitials = (name?: string | null) => {
        if (!name) return "U";
        return name.charAt(0).toUpperCase();
    };

    const sections = [
        { id: "inicio", label: "Inicio" },
        { id: "detalles", label: "Detalles" },
        { id: "galeria", label: "Galería" },
        { id: "rsvp", label: "Asistencia" },
        { id: "regalos", label: "Regalos" },
        { id: "faq", label: "FAQ" },
    ];

    const scrollToSection = (sectionId: string) => {
        setIsOpen(false);
        if (location !== "/") {
            navigate("/");
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
            }, 500);
            return;
        }

        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-[200] bg-white/95 backdrop-blur-md border-b border-border">
            <div className="container flex justify-between items-center py-4">
                <motion.div
                    className="font-serif text-xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => navigate("/")}
                >
                    {WEDDING_DATA.bride} & {WEDDING_DATA.groom}
                </motion.div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => section.id === "galeria" ? navigate("/galeria") : scrollToSection(section.id)}
                            className="text-sm font-sans text-foreground hover:text-primary transition-colors"
                        >
                            {section.label}
                        </button>
                    ))}
                    {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <AvatarFallback className="bg-primary/10 text-primary font-serif">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 z-[100] bg-white">
                                <DropdownMenuLabel className="font-sans flex flex-col space-y-1">
                                    <span className="font-bold text-foreground leading-none">{user.name || "Invitado"}</span>
                                    <span className="text-xs text-muted-foreground leading-none mt-1">{user.email}</span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate("/mi-galeria")} className="cursor-pointer">
                                    {hasClaimedGift ? (
                                        <>
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            <span>Mi Galería</span>
                                        </>
                                    ) : (
                                        <>
                                            <Gift className="mr-2 h-4 w-4" />
                                            <span>Mesa de Regalos</span>
                                        </>
                                    )}
                                </DropdownMenuItem>
                                {!hasRsvped && (
                                    <DropdownMenuItem onClick={() => scrollToSection("rsvp")} className="cursor-pointer">
                                        <CalendarCheck className="mr-2 h-4 w-4" />
                                        <span>Confirmar Asistencia</span>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => window.location.href = "/api/spotify/login"} className="cursor-pointer">
                                    <Music className="mr-2 h-4 w-4" />
                                    <span>Conectar Spotify</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar Sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <button
                            onClick={() => window.location.href = getLoginUrl()}
                            className="text-sm font-sans text-primary font-semibold hover:text-primary/80 transition-colors"
                        >
                            Iniciar Sesión
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        className="absolute top-full left-0 right-0 bg-white border-b border-border md:hidden"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="container py-4 flex flex-col gap-4 shadow-lg">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => {
                                        if (section.id === "galeria") {
                                            navigate("/galeria");
                                        } else {
                                            scrollToSection(section.id);
                                        }
                                        setIsOpen(false);
                                    }}
                                    className="text-sm font-sans text-foreground hover:text-primary transition-colors text-left"
                                >
                                    {section.label}
                                </button>
                            ))}
                            {isAuthenticated && user ? (
                                <div className="border-t border-border pt-4 flex flex-col gap-4">
                                    <div className="flex items-center gap-3 px-2">
                                        <Avatar className="h-10 w-10 border border-primary/20">
                                            <AvatarFallback className="bg-primary/10 text-primary font-serif">{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">{user.name || "Invitado"}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => { navigate("/mi-galeria"); setIsOpen(false); }}
                                        className="text-sm font-sans flex items-center gap-2 text-foreground hover:text-primary transition-colors text-left px-2"
                                    >
                                        {hasClaimedGift ? (
                                            <>
                                                <UserIcon className="h-4 w-4" /> Mi Galería
                                            </>
                                        ) : (
                                            <>
                                                <Gift className="h-4 w-4" /> Mesa de Regalos
                                            </>
                                        )}
                                    </button>
                                    {!hasRsvped && (
                                        <button
                                            onClick={() => { scrollToSection("rsvp"); setIsOpen(false); }}
                                            className="text-sm font-sans flex items-center gap-2 text-foreground hover:text-primary transition-colors text-left px-2"
                                        >
                                            <CalendarCheck className="h-4 w-4" /> Confirmar Asistencia
                                        </button>
                                    )}
                                    <button
                                        onClick={() => window.location.href = "/api/spotify/login"}
                                        className="text-sm font-sans flex items-center gap-2 text-foreground hover:text-primary transition-colors text-left px-2"
                                    >
                                        <Music className="h-4 w-4" /> Conectar Spotify
                                    </button>
                                    <button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        className="text-sm font-sans flex items-center gap-2 text-destructive hover:text-destructive/80 font-semibold text-left transition-colors px-2"
                                    >
                                        <LogOut className="h-4 w-4" /> Cerrar Sesión
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => window.location.href = getLoginUrl()}
                                    className="text-sm font-sans text-primary font-semibold hover:text-primary/80 text-left transition-colors"
                                >
                                    Iniciar Sesión
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
}
