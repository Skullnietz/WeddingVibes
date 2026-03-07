import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, XCircle, Users } from "lucide-react";

export default function AdminAsistencia() {
    const { user, isAuthenticated } = useAuth();
    const [, navigate] = useLocation();

    if (!isAuthenticated || user?.role !== "admin") {
        navigate("/");
        return null;
    }

    const { data: rsvps = [], isLoading } = trpc.rsvp.getAll.useQuery();

    // Summary Metrics
    const attending = rsvps.filter((r: any) => r.isAttending);
    const notAttending = rsvps.filter((r: any) => !r.isAttending);

    // Calculate total people coming (Guests + Companions)
    const totalPeople = attending.reduce((acc: number, rsvp: any) => acc + 1 + (rsvp.numberOfCompanions || 0), 0);

    // Group by invitation (Families)
    const familiesConfirmed = new Set(attending.map((r: any) => r.invitationId).filter(Boolean)).size;

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-border">
                    <div>
                        <Link href="/" className="inline-flex items-center text-sm font-sans text-primary hover:underline mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al inicio
                        </Link>
                        <h1 className="font-serif text-3xl md:text-5xl text-foreground font-medium">Panel de Asistencia</h1>
                        <p className="font-sans text-muted-foreground mt-2">Resume y gestiona las confirmaciones de tus invitados.</p>
                    </div>
                </div>

                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Total Personas */}
                    <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm flex items-center space-x-4">
                        <div className="bg-primary/20 p-3 rounded-full text-primary">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-sans tracking-wider text-muted-foreground uppercase">Personas Totales</p>
                            <h3 className="text-3xl font-serif font-bold text-foreground">{totalPeople}</h3>
                        </div>
                    </div>

                    {/* Familias/Invitaciones */}
                    <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm flex items-center space-x-4">
                        <div className="bg-green-500/20 p-3 rounded-full text-green-600 dark:text-green-500">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-sans tracking-wider text-muted-foreground uppercase">Invitaciones ("Familias")</p>
                            <h3 className="text-3xl font-serif font-bold text-foreground">{familiesConfirmed}</h3>
                        </div>
                    </div>

                    {/* Declinaron */}
                    <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm flex items-center space-x-4">
                        <div className="bg-red-500/20 p-3 rounded-full text-red-600 dark:text-red-500">
                            <XCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-sans tracking-wider text-muted-foreground uppercase">Declinaron</p>
                            <h3 className="text-3xl font-serif font-bold text-foreground">{notAttending.length}</h3>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border bg-muted/30">
                        <h2 className="font-serif text-2xl text-foreground">Detalle de Confirmaciones</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-sans text-sm">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">Invitado Principal</th>
                                    <th className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">Asiste</th>
                                    <th className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">Acompañantes</th>
                                    <th className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">Total</th>
                                    <th className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">Vino de Invitación</th>
                                    <th className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">Requerimientos Específicos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground animate-pulse">Cargando base de datos...</td>
                                    </tr>
                                ) : rsvps.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Todavía no hay confirmaciones.</td>
                                    </tr>
                                ) : rsvps.map((rsvp: any) => (
                                    <tr key={rsvp.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">{rsvp.guestName}</td>
                                        <td className="px-6 py-4">
                                            {rsvp.isAttending ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    Sí
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{rsvp.numberOfCompanions || 0}</td>
                                        <td className="px-6 py-4 font-semibold text-foreground">
                                            {rsvp.isAttending ? 1 + (rsvp.numberOfCompanions || 0) : 0}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {rsvp.originalInvitationName ? (
                                                <div>
                                                    <p className="text-xs">{rsvp.originalInvitationName}</p>
                                                    <p className="text-[10px] opacity-60 font-mono">/{rsvp.originalInvitationSlug}</p>
                                                </div>
                                            ) : (
                                                <span className="italic opacity-50">Orgánico / Sin Link</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground text-xs max-w-[200px] truncate" title={rsvp.dietaryRestrictions || rsvp.specialRequests || "No hay notas."}>
                                            {rsvp.dietaryRestrictions || rsvp.specialRequests || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
