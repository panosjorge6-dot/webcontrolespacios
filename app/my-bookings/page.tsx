'use client';

import { useUserBookings } from '@/hooks/use-user-bookings';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_SPACES } from '@/constants/spaces';
import { format, isAfter, isBefore } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, XCircle, AlertCircle, RefreshCcw, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyBookingsPage() {
  const { bookings, loading, cancelBooking } = useUserBookings();

  const getSpaceName = (id: string) => MOCK_SPACES.find(s => s.id === id)?.name || 'Espacio';
  const getSpaceZone = (id: string) => MOCK_SPACES.find(s => s.id === id)?.zone.replace('_', ' ') || 'General';

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status !== 'confirmed');

  return (
    <main className="min-h-screen bg-background pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight">Mis <span className="text-primary">Reservas</span></h1>
          <p className="text-muted-foreground mt-2">Gestiona tus espacios y horarios activos.</p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-muted" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-muted-foreground/20">
             <AlertCircle size={48} className="mx-auto text-muted-foreground/30 mb-4" />
             <h3 className="text-xl font-bold">Sin reservas</h3>
             <p className="text-muted-foreground mt-1">Aún no has realizado ninguna reserva.</p>
             <Button asChild className="mt-6 rounded-full" variant="outline">
                <a href="/">Ir al Mapa</a>
             </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Active Bookings */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
                    <Clock size={16} /> Próximas Reservas
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <AnimatePresence>
                      {upcomingBookings.map((booking) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                        >
                          <Card className="rounded-2xl border-none shadow-xl bg-card hover:translate-y-[-4px] transition-all duration-300 overflow-hidden">
                             <div className="h-2 bg-primary w-full" />
                             <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                   <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                                      <Monitor size={20} />
                                   </div>
                                   <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/20 bg-primary/5">
                                      Confirmada
                                   </Badge>
                                </div>
                                <CardTitle className="text-lg">{getSpaceName(booking.spaceId)}</CardTitle>
                                <CardDescription className="text-[10px] uppercase font-bold tracking-wider">{getSpaceZone(booking.spaceId)}</CardDescription>
                             </CardHeader>
                             <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border">
                                   <CalendarIcon size={16} className="text-muted-foreground" />
                                   <span className="text-sm font-medium">{format(new Date(booking.date as string), 'PPP')}</span>
                                </div>
                                {booking.isRecurring && (
                                   <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 p-2 rounded-lg w-fit">
                                      <RefreshCcw size={12} /> RESERVA SEMANAL
                                   </div>
                                )}
                             </CardContent>
                             <CardFooter className="pt-0 flex gap-2">
                                <Button variant="ghost" className="text-xs text-destructive hover:bg-destructive/5 hover:text-destructive w-full gap-2" onClick={() => cancelBooking(booking.id)}>
                                   <XCircle size={14} /> Cancelar Reserva
                                </Button>
                             </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                   </AnimatePresence>
                </div>
            </section>

            {/* History */}
            {pastBookings.length > 0 && (
               <section className="space-y-6">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      Histórico Pasado
                  </div>
                  <div className="space-y-3">
                     {pastBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-xl opacity-60">
                           <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                 <Monitor size={16} className="text-muted-foreground" />
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold">{getSpaceName(booking.spaceId)}</h4>
                                 <p className="text-xs text-muted-foreground">{format(new Date(booking.date as string), 'PP')}</p>
                              </div>
                           </div>
                           <Badge variant="ghost" className="capitalize text-[10px] font-bold px-3 bg-background">
                              {booking.status === 'cancelled' ? 'Cancelada' : 'Completada'}
                           </Badge>
                        </div>
                     ))}
                  </div>
               </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
