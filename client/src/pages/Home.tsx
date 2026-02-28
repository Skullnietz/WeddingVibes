import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Clock, Gift, Users, Camera, MessageCircle, ChevronDown, Menu, X, Gem, PartyPopper } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "../lib/trpc";
// Icono personalizado de Camisa (Shirt)
const ShirtIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
  </svg>
);

// Icono personalizado de Vestido (Dress)
const DressIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
  >
    <path d="M5.061,91.952c-0.167,0.741,0.013,1.517,0.487,2.11C6.022,94.655,6.741,95,7.5,95h85c0.759,0,1.478-0.345,1.952-0.938 c0.474-0.593,0.653-1.37,0.487-2.11c-3.531-15.707-12.213-29.95-24.523-40.293l3.544-10.633l7.422,3.71 c1.127,0.565,2.499,0.2,3.198-0.849l10-15c0.612-0.918,0.55-2.13-0.154-2.98C86.418,16.226,75.259,9.332,63.004,6.494 c-0.708-0.165-1.454-0.011-2.042,0.419c-0.587,0.43-0.958,1.095-1.015,1.82C59.449,15.051,55.08,20,50,20s-9.449-4.949-9.948-11.268 c-0.057-0.725-0.428-1.39-1.015-1.82c-0.587-0.43-1.333-0.584-2.042-0.419C24.741,9.332,13.582,16.226,5.574,25.907 c-0.704,0.85-0.766,2.062-0.154,2.98l10,15c0.698,1.049,2.071,1.412,3.198,0.849l7.422-3.71l3.544,10.633 C17.274,62.001,8.592,76.245,5.061,91.952z" />
  </svg>
);

// Datos de la boda (placeholder - personalizar según necesidad)
const WEDDING_DATA = {
  groom: "Gonzalo",
  bride: "Miriam",
  date: new Date("2026-04-11T14:30:00"),
  hashtag: "#MiriamGonzaloBoda2026",
  venue: "Pino Suárez num. 312 entre Instituto Literario y Morelos. Col. 5 de mayo. Toluca",
  ceremonyTime: "14:30",
  receptionTime: "13:30",
  colors: {
    primary: "#D4AF37", // Dorado clásico
    accent: "#E8D8C8",  // Beige suave
    light: "#FDFAF6",   // Blanco perla
  },
};

// Componente de Countdown
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const updateCountdown = () => {
    const now = new Date().getTime();
    const weddingTime = WEDDING_DATA.date.getTime();
    const difference = weddingTime - now;

    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }
  };

  useEffect(() => {
    updateCountdown(); // Call immediately
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-2 md:gap-4">
      <CountdownBox value={timeLeft.days} label="Días" />
      <CountdownBox value={timeLeft.hours} label="Horas" />
      <CountdownBox value={timeLeft.minutes} label="Minutos" />
      <CountdownBox value={timeLeft.seconds} label="Segundos" />
    </div>
  );
}

const CountdownBox = ({ value, label }: { value: number; label: string }) => (
  <motion.div
    className="flex flex-col items-center"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="bg-background/80 backdrop-blur-sm border border-primary/30 text-foreground rounded-lg p-4 md:p-6 min-w-[4rem] md:min-w-[5rem] shadow-xl">
      <span className="text-2xl md:text-4xl font-bold font-serif tabular-nums text-center block text-primary drop-shadow-sm">
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span className="text-xs md:text-sm font-sans mt-2 text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase tracking-widest">
      {label}
    </span>
  </motion.div>
);



// Componente de Navegación Sticky
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  const sections = [
    { id: "inicio", label: "Inicio" },
    { id: "detalles", label: "Detalles" },
    { id: "galeria", label: "Galería" },
    { id: "rsvp", label: "RSVP" },
    { id: "regalos", label: "Regalos" },
    { id: "faq", label: "FAQ" },
  ];

  const scrollToSection = (sectionId: string) => {
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
          className="font-serif text-xl font-bold text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
          {isAuthenticated && (
            <button
              onClick={() => navigate("/galeria")}
              className="text-sm font-sans text-primary font-semibold"
            >
              Mi Galería
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
            <div className="container py-4 flex flex-col gap-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-sm font-sans text-foreground hover:text-primary transition-colors text-left"
                >
                  {section.label}
                </button>
              ))}
              {isAuthenticated && (
                <button
                  onClick={() => navigate("/galeria")}
                  className="text-sm font-sans text-primary font-semibold text-left"
                >
                  Mi Galería
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

// Sección Hero
function HeroSection() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/invitacion/:slug");

  const { data: invitation } = trpc.invitations.getBySlug.useQuery(
    params?.slug || "",
    { enabled: !!match && !!params?.slug }
  );

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Background Image & Overlay (Ken Burns Animation Effect) */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        {/* Layer 1: Animated Image */}
        <motion.img
          src="/principal.png"
          alt="Miriam y Gonzalo"
          className="w-full h-full object-cover object-[center_top] sm:object-center opacity-90 origin-center"
          animate={{ scale: [1, 1.1] }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        />
        {/* Layer 2: Gentle Dark Overlay to guarantee text readability anywhere */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/10 to-black/60" />
      </div>

      {/* Invitación Personalizada Separada (Top Banner Flotante o Bloque Superior) */}
      <AnimatePresence>
        {invitation?.guestName && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            className="absolute top-[60px] left-0 right-0 z-40 pointer-events-none"
          >
            <div className="bg-black/50 backdrop-blur-md w-full text-center border-b border-primary/30 shadow-2xl pt-6 pb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
                className="mb-3"
              >
                <PartyPopper size={24} className="text-primary mx-auto drop-shadow-md" />
              </motion.div>

              <p className="text-white/90 text-xs md:text-sm font-sans font-light tracking-[0.2em] uppercase mb-2 drop-shadow-md">
                ¡Qué emoción contar con ustedes!
              </p>

              <h2 className="font-serif text-3xl md:text-5xl text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-tight mb-2">
                {invitation.guestName}
              </h2>

              <div className="w-12 h-px bg-primary/40 mx-auto" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container relative z-10 flex flex-col items-center justify-center mt-56 md:mt-48 mb-16">
        {/* Glassmorphism container for maximum contrast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl text-center"
        >

          {/* Monogram */}
          <div className="mb-8 flex justify-center">
            <motion.div
              className="w-24 h-24 md:w-32 md:h-32 border-4 border-white rounded-full flex items-center justify-center drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <span className="font-serif text-4xl md:text-5xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                M & G
              </span>
            </motion.div>
          </div>

          {/* Names and date */}
          <h1 className="heading-luxury text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {WEDDING_DATA.bride} & {WEDDING_DATA.groom}
          </h1>
          <p className="text-luxury text-white font-semibold mb-8 text-lg md:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {WEDDING_DATA.date.toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          {/* Countdown */}
          <div className="mb-12">
            <CountdownTimer />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-serif shadow-xl"
              onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Heart className="mr-2" size={20} />
              Confirmar Asistencia
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-serif bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white/20 transition-all drop-shadow-lg"
              onClick={() => document.getElementById("detalles")?.scrollIntoView({ behavior: "smooth" })}
            >
              Ver Detalles
            </Button>
            {!isAuthenticated && (
              <Button
                size="lg"
                variant="outline"
                className="font-serif bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white/20 transition-all drop-shadow-lg"
                onClick={() => window.location.href = getLoginUrl()}
              >
                <Users className="mr-2" size={20} />
                Galería Privada
              </Button>
            )}
          </div>

          {/* Hashtag */}
          <p className="mt-12 text-sm md:text-base font-sans text-white/90 font-medium drop-shadow-md">
            Comparte tus fotos con <span className="font-bold text-white tracking-wide" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>{WEDDING_DATA.hashtag}</span>
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => document.getElementById("detalles")?.scrollIntoView({ behavior: "smooth" })}
        >
          <ChevronDown className="text-white hover:text-primary transition-colors" size={32} />
        </motion.div>
      </div>
    </section >
  );
}

// Sección de Detalles
function DetailsSection() {
  return (
    <section id="detalles" className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="subheading-luxury text-primary mb-4">Detalles de la Recepción</h2>
          <div className="divider-luxury mx-auto w-24 mb-8" />
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {/* Reception with Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="p-10 border-primary/20 hover:border-primary/50 transition-all duration-300 h-full bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex -space-x-3">
                      <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center z-10">
                        <Clock className="text-primary" size={24} />
                      </div>
                      <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center">
                        <MapPin className="text-primary" size={24} />
                      </div>
                    </div>
                    <h3 className="font-serif text-3xl font-semibold text-primary">
                      Recepción
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-sans text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-2">Horario</h4>
                      <p className="font-medium text-xl text-foreground">
                        {WEDDING_DATA.receptionTime} hrs
                      </p>
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-2">Ubicación</h4>
                      <p className="text-foreground leading-relaxed text-lg mb-4">
                        {WEDDING_DATA.venue}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto font-sans border-primary/20 text-primary hover:bg-primary/5 gap-2"
                        onClick={() => window.open("https://maps.app.goo.gl/Wa1eTe4NvoB6ZQ8HA", "_blank")}
                      >
                        <MapPin size={16} />
                        Abrir en Google Maps
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="h-64 md:h-full min-h-[300px] w-full rounded-xl overflow-hidden shadow-inner border border-primary/10">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235.36834488450313!2d-99.65005240825978!3d19.286996265850824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cd89b94302f485%3A0x462b6270781b3411!2sLiceo%20preuniversitario%20Toluca!5e0!3m2!1ses-419!2smx!4v1772076287177!5m2!1ses-419!2smx"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Código de Vestimenta integrado y balanceado */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="p-10 border-primary/20 hover:border-primary/50 transition-all duration-300 h-full bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md">
              <div className="grid md:grid-cols-2 gap-8 items-center h-full">
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex -space-x-3">
                      <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center z-10">
                        <ShirtIcon className="text-primary" size={24} />
                      </div>
                      <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center">
                        <DressIcon className="text-primary" size={24} />
                      </div>
                    </div>
                    <h3 className="font-serif text-3xl font-semibold text-primary">
                      Vestimenta
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-sans text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-2">Estilo</h4>
                      <p className="font-medium text-xl text-foreground">
                        Casual Elegante
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-6 bg-primary/5 p-6 md:p-8 rounded-xl border border-primary/10 h-full place-content-center">
                  <div>
                    <h4 className="font-sans text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-2 opacity-80">Colores</h4>
                    <p className="font-medium text-foreground leading-relaxed text-lg">
                      Claros (blancos, perla, champagne, crema, beige, nude, dorados o cálidos)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-2 opacity-80">Consideración</h4>
                    <p className="font-medium text-foreground leading-relaxed text-lg">
                      Calzado apto para jardín (evitar tacón fino)
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16"
        >
          <h3 className="font-serif text-3xl font-semibold text-primary mb-12 text-center">
            Agenda del Día
          </h3>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            {/* Calendar Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-primary/10 rounded-2xl transform rotate-3 scale-105 transition-transform group-hover:rotate-6"></div>
              <img
                src="/calendario.png"
                alt="Calendario de Boda"
                className="relative z-10 w-full rounded-2xl shadow-xl shadow-primary/10 transition-transform duration-500 group-hover:-translate-y-2"
              />
            </motion.div>

            {/* Timeline List */}
            <div className="space-y-6">
              {[
                { time: "13:30", event: "RECEPCIÓN" },
                { time: "14:00", event: "BODA CIVIL" },
                { time: "14:30", event: "CEREMONIA" },
                { time: "15:00", event: "BRINDIS" },
                { time: "16:30", event: "COMIDA" },
                { time: "17:00", event: "SESIÓN DE FOTOS" },
                { time: "18:00", event: "PASTEL Y MESA DE DULCES" },
                { time: "19:30", event: "PRIMER BAILE" },
                { time: "20:00", event: "LANZAMIENTO DE RAMO" },
                { time: "20:30", event: "BAILE Y KARAOKE" },
                { time: "23:00", event: "CIERRE" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-24 font-serif font-semibold text-primary">
                    {item.time}
                  </div>
                  <div className="flex-1 h-px bg-border group-hover:bg-primary/50 transition-colors" />
                  <div className="text-luxury text-foreground">{item.event}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Sección de Galería Pre-boda
function GallerySection() {
  const photos = [
    { id: 1, title: "Nuestra primer salida a bailar 💃🕺", src: "/gallery/Nuestra primer salida a bailar.jpeg" },
    { id: 2, title: "Esperando el año nuevo 🎆🥂", src: "/gallery/Esperando el año nuevo.jpeg" },
    { id: 3, title: "En la boda de Tavito 💒💍", src: "/gallery/En la boda de Tavito.jpeg" },
    { id: 4, title: "De paseo en la marquesa 🌲🏞️", src: "/gallery/De paseo en la marquesa.jpeg" },
    { id: 5, title: "Esperando navidad 🎄🎁", src: "/gallery/Esperando navidad.jpeg" },
    { id: 6, title: "El cumple de Gonz 🎂🥳", src: "/gallery/El cumple de Gonz.jpeg" },
    { id: 7, title: "Anillos de compromiso 💍✨", src: "/gallery/Anillos de compromiso.jpeg" },
    { id: 8, title: "En el cantón 🏡❤️", src: "/gallery/En el cantón.jpeg" },
    { id: 9, title: "En el cumple de Pepe 🎈🍰", src: "/gallery/En el cumple de Pepe.jpeg" },
    { id: 10, title: "De paseo en galerías 🛍️✨", src: "/gallery/De paseo en galerías.jpeg" },
    { id: 11, title: "En el cine 🍿🎥", src: "/gallery/En el cine.jpeg" },
    { id: 12, title: "De fiesta con Reny 🎊👯‍♀️", src: "/gallery/De fiesta con Reny.jpeg" },
    { id: 13, title: "De paseo en el zoológico 🦁🦒", src: "/gallery/De paseo en el zoológico.jpeg" },
    { id: 14, title: "En la plaza comercial 🏬✨", src: "/gallery/En la plaza comercial.jpeg" },
    { id: 15, title: "En Querétaro en el cumple de Dany 🛣️🎂", src: "/gallery/En Querétaro en el cumple de Dany.jpeg" },
  ];

  const [selectedPhoto, setSelectedPhoto] = useState<typeof photos[0] | null>(null);

  return (
    <section id="galeria" className="py-20 bg-secondary/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="subheading-luxury text-primary mb-4">Galería Pre-boda</h2>
          <div className="divider-luxury mx-auto w-24 mb-8" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: (index % 5) * 0.1 }}
              className="relative overflow-hidden rounded-lg group cursor-pointer aspect-square bg-muted/50"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera className="text-white drop-shadow-lg" size={32} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal / Lightbox animado */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
              onClick={() => setSelectedPhoto(null)}
            >
              <button
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(null);
                }}
              >
                <X size={28} />
              </button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 text-center"
                >
                  <p className="text-xl md:text-3xl font-serif text-white font-medium drop-shadow-lg px-4">
                    {selectedPhoto.title}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}


// Sección RSVP
function RSVPSection() {
  const { user, isAuthenticated } = useAuth();
  const [match, params] = useRoute("/invitacion/:slug");

  const { data: invitation } = trpc.invitations.getBySlug.useQuery(
    params?.slug || "",
    { enabled: !!match && !!params?.slug }
  );

  const [formData, setFormData] = useState({
    guestName: user?.name || "",
    isAttending: true,
    numberOfCompanions: 0,
  });

  // Si el usuario acaba de iniciar sesión o se cargó la invitación, actualiza el nombre
  useEffect(() => {
    if (invitation?.guestName) {
      setFormData(prev => ({ ...prev, guestName: invitation.guestName }));
    } else if (user?.name) {
      setFormData(prev => ({ ...prev, guestName: user.name || "" }));
    }
  }, [user, invitation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated && !invitation) {
      alert("Por favor inicia sesión con Google para confirmar tu asistencia, o accede desde tu invitación personalizada.");
      return;
    }
    // TODO: Integrar con API de tRPC
    console.log("RSVP submitted:", formData);
    alert("¡Gracias por confirmar tu asistencia, " + formData.guestName + "!");
  };

  const showLoginPrompt = !isAuthenticated && !invitation;

  return (
    <section id="rsvp" className="py-20 bg-primary/5">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="subheading-luxury text-primary mb-4">Confirma tu Asistencia</h2>
          <div className="divider-luxury mx-auto w-24 mb-8" />
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8 border-primary/20 bg-white/50 backdrop-blur-sm shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {showLoginPrompt && (
                <div className="pb-6 border-b border-border/50 mb-6 flex flex-col items-center gap-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Inicia sesión para poder confirmar tu asistencia y la de tus acompañantes.
                  </p>
                  <a href={getLoginUrl()} className="w-full">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-primary/20 hover:bg-primary/5 font-sans h-12 flex items-center justify-center gap-3"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Iniciar sesión con Google
                    </Button>
                  </a>
                </div>
              )}

              <div>
                <label className="block text-sm font-sans font-semibold text-foreground mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted/50 disabled:text-muted-foreground"
                  placeholder="Tu nombre"
                  disabled={!!invitation}
                />
              </div>

              <div>
                <label className="block text-sm font-sans font-semibold text-foreground mb-4">
                  ¿Confirmas tu asistencia?
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isAttending: true })}
                    className={`flex-1 py-2 px-4 rounded-lg font-sans font-semibold transition-colors ${formData.isAttending
                      ? "bg-primary text-primary-foreground"
                      : "bg-border text-foreground hover:bg-border/80"
                      }`}
                  >
                    Sí, Asistiré
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isAttending: false })}
                    className={`flex-1 py-2 px-4 rounded-lg font-sans font-semibold transition-colors ${!formData.isAttending
                      ? "bg-primary text-primary-foreground"
                      : "bg-border text-foreground hover:bg-border/80"
                      }`}
                  >
                    No Podré Asistir
                  </button>
                </div>
              </div>
              {formData.isAttending && (
                <div>
                  <label className="block text-sm font-sans font-semibold text-foreground mb-2">
                    Acompañantes
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={formData.numberOfCompanions}
                    onChange={(e) => setFormData({ ...formData, numberOfCompanions: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-serif py-3"
              >
                Enviar Confirmación
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}

// Sección de Regalos
function GiftsSection() {
  const giftOptions = [
    {
      icon: Gift,
      title: "Mesa de Regalos",
      description: "Visita nuestras tiendas favoritas",
      link: "#",
    },
    {
      icon: Heart,
      title: "Transferencia Bancaria",
      description: "Cuenta: 123456789 | CLABE: 002180000000123456789",
      link: "#",
    },
  ];

  return (
    <section id="regalos" className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="subheading-luxury text-primary mb-4">Regalos</h2>
          <div className="divider-luxury mx-auto w-24 mb-8" />
          <p className="text-luxury text-muted-foreground max-w-2xl mx-auto">
            Tu presencia es el mejor regalo, pero si deseas contribuir, aquí hay algunas opciones
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {giftOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 text-center border-primary/20 hover:border-primary/50 transition-colors h-full">
                  <Icon className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-serif text-lg font-semibold text-primary mb-2">
                    {option.title}
                  </h3>
                  <p className="text-luxury text-muted-foreground mb-6">
                    {option.description}
                  </p>
                  <Button variant="outline" className="w-full">
                    Más Información
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Sección FAQ
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "¿Pueden asistir niños?",
      answer: "Sí, los niños son bienvenidos. Por favor indícalo en el RSVP para preparar actividades especiales.",
    },
    {
      question: "¿Qué pasa si llueve?",
      answer: "El evento tiene cobertura completa. La ceremonia y recepción se realizarán sin inconvenientes.",
    },
    {
      question: "¿Qué colores debo evitar?",
      answer: "Por favor evita blanco, negro y tonos muy oscuros. Los colores de la boda son púrpura y dorado.",
    },
    {
      question: "¿Habrá transporte de regreso?",
      answer: "Sí, proporcionaremos transporte de regreso hasta las 2:00 AM.",
    },
    {
      question: "¿Hay estacionamiento?",
      answer: "Sí, hay estacionamiento gratuito disponible en el venue.",
    },
    {
      question: "¿Política de fotos durante la ceremonia?",
      answer: "Por favor no tomes fotos durante la ceremonia. Podrás hacerlo durante la recepción.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-primary/5">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="subheading-luxury text-primary mb-4">Preguntas Frecuentes</h2>
          <div className="divider-luxury mx-auto w-24 mb-8" />
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors text-left"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-semibold text-foreground">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} className="text-primary" />
                  </motion.div>
                </div>
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-secondary/30 border-l-2 border-primary"
                >
                  <p className="text-luxury text-foreground">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Sección de Cierre
function ClosingSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Heart className="w-12 h-12 text-accent mx-auto mb-6" />
          <h2 className="subheading-luxury text-primary mb-4">
            Gracias por ser parte de nuestro día especial
          </h2>
          <p className="text-luxury text-muted-foreground max-w-2xl mx-auto mb-8">
            Tu presencia y apoyo significan el mundo para nosotros. Esperamos compartir este momento inolvidable contigo.
          </p>
          <p className="text-lg font-serif text-primary mb-8">
            {WEDDING_DATA.groom} & {WEDDING_DATA.bride}
          </p>

          {isAuthenticated && (
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-serif"
            >
              <Camera className="mr-2" size={20} />
              Sube tus Fotos
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// Componente Principal
export default function Home() {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Navigation />
      <HeroSection />
      <DetailsSection />
      <RSVPSection />
      <GallerySection />
      <GiftsSection />
      <FAQSection />
      <ClosingSection />
    </div>
  );
}
