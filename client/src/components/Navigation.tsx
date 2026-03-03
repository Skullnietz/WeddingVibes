import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

// We extract WEDDING_DATA here or import it if it's centralized. Quick inline for now:
const WEDDING_DATA = {
    groom: "Gonzalo",
    bride: "Miriam",
    date: new Date("2026-04-11T14:30:00"),
};

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [location, navigate] = useLocation();
    const { isAuthenticated, logout } = useAuth();

    const sections = [
        { id: "inicio", label: "Inicio" },
        { id: "detalles", label: "Detalles" },
        { id: "galeria", label: "Galería" },
        { id: "rsvp", label: "RSVP" },
        { id: "regalos", label: "Regalos" },
        { id: "faq", label: "FAQ" },
    ];

    const scrollToSection = (sectionId: string) => {
        // If not on the home page, navigate to home and append hash
        if (location !== "/" && location !== "/#galeria") {
            window.location.href = `/#${sectionId}`;
            return;
        }
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsOpen(false);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
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
                            onClick={() => scrollToSection(section.id)}
                            className="text-sm font-sans text-foreground hover:text-primary transition-colors"
                        >
                            {section.label}
                        </button>
                    ))}
                    {isAuthenticated ? (
                        <>
                            <button
                                onClick={() => navigate("/galeria")}
                                className="text-sm font-sans text-primary font-semibold"
                            >
                                Mi Galería
                            </button>
                            <button
                                onClick={() => logout()}
                                className="text-sm font-sans text-destructive hover:text-destructive/80 font-semibold transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </>
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
                                    onClick={() => scrollToSection(section.id)}
                                    className="text-sm font-sans text-foreground hover:text-primary transition-colors text-left"
                                >
                                    {section.label}
                                </button>
                            ))}
                            {isAuthenticated ? (
                                <>
                                    <button
                                        onClick={() => { navigate("/galeria"); setIsOpen(false); }}
                                        className="text-sm font-sans text-primary font-semibold text-left"
                                    >
                                        Mi Galería
                                    </button>
                                    <button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        className="text-sm font-sans text-destructive hover:text-destructive/80 font-semibold text-left transition-colors"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
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
