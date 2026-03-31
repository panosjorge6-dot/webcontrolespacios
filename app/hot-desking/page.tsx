'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/hooks/use-auth';
import { useRealtimeBookings } from '@/hooks/use-realtime-bookings';
import { MOCK_SPACES } from '@/constants/spaces';
import { Button } from '@/components/ui/button';
import { Monitor, Shuffle, Zap, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBooking } from '@/lib/booking-utils';
import { toast } from 'sonner';

export default function HotDeskingPage() {
  const { user } = useAuth();
  const [assigning, setAssigning] = useState(false);
  const selectedDate = new Date(); // Hot desking is always for "now/today"
  const { bookings, loading } = useRealtimeBookings(selectedDate);

  const availableDesks = MOCK_SPACES.filter(s => 
    s.type === 'desk' && 
    !bookings.find(b => b.spaceId === s.id && b.status === 'confirmed')
  );

  const handleRandomAssignment = async () => {
    if (!user) {
      toast.error('Acceso denegado. Debes iniciar sesión.');
      return;
    }

    if (availableDesks.length === 0) {
      toast.error('Lo sentimos, no hay escritorios disponibles en este momento.');
      return;
    }

    setAssigning(true);
    const randomDesk = availableDesks[Math.floor(Math.random() * availableDesks.length)];
    
    // Assign for today
    const res = await createBooking(randomDesk, user, selectedDate);
    
    setAssigning(false);
    if (res.success) {
      toast.success(`¡Bingo! Te hemos asignado el ${randomDesk.name}.`);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
         >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
               <Monitor size={32} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
              Escritorios <span className="text-primary italic">Flexibles</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed">
              ¿No tienes un sitio fijo? Usa nuestro sistema de <span className="font-bold text-foreground">Hot Desking</span> 
              para encontrar el mejor lugar disponible en un segundo.
            </p>
         </motion.div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-8">
            {/* Quick Check-in */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="p-8 rounded-3xl bg-card border border-border flex flex-col justify-between"
            >
               <div>
                  <h3 className="text-xl font-bold mb-2">Auto Asignación</h3>
                  <p className="text-sm text-muted-foreground mb-8">
                    Déjanos elegir por ti el espacio más tranquilo disponible hoy.
                  </p>
               </div>
               <Button 
                 onClick={handleRandomAssignment} 
                 disabled={assigning || loading}
                 size="lg" 
                 className="w-full h-16 rounded-2xl gap-3 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
               >
                 {assigning ? <Loader2 className="animate-spin" /> : <Shuffle size={20} />}
                 {assigning ? 'Asignando...' : 'Encontrarme un sitio'}
               </Button>
            </motion.div>

            {/* List Selection */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3 }}
               className="p-8 rounded-3xl bg-secondary/10 border border-secondary/20 flex flex-col justify-between"
            >
               <div>
                  <h3 className="text-xl font-bold mb-2">Disponibilidad Real</h3>
                  <p className="text-sm text-muted-foreground mb-8">
                    {availableDesks.length} escritorios libres en este momento.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                     {availableDesks.slice(0, 4).map(d => (
                        <div key={d.id} className="px-3 py-1.5 bg-background rounded-lg border border-border text-[10px] font-bold uppercase tracking-wider">
                           {d.name.split(' ').pop()}
                        </div>
                     ))}
                     {availableDesks.length > 4 && (
                        <div className="px-3 py-1.5 bg-background rounded-lg border border-border text-[10px] font-bold opacity-60">
                           +{availableDesks.length - 4} más
                        </div>
                     )}
                  </div>
               </div>
               <Button asChild variant="outline" className="w-full h-16 rounded-2xl gap-3 text-lg font-bold border-secondary/20 hover:bg-secondary/20 hover:text-secondary">
                 <a href="/?type=desk">Ver Mapa</a>
               </Button>
            </motion.div>
         </div>

         {/* Steps Info */}
         <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-12 text-left opacity-80">
            <div className="space-y-4">
               <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">1</div>
               <h4 className="font-bold text-sm">Escaneo Real</h4>
               <p className="text-xs text-muted-foreground leading-relaxed">Sensores y reservas activas sincronizados al segundo para evitar solapamientos.</p>
            </div>
            <div className="space-y-4">
               <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">2</div>
               <h4 className="font-bold text-sm">Check-in Instantáneo</h4>
               <p className="text-xs text-muted-foreground leading-relaxed">Click and Go. Reserva por 24 horas automáticamente sin trámites adicionales.</p>
            </div>
            <div className="space-y-4">
               <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">3</div>
               <h4 className="font-bold text-sm">Libertad Total</h4>
               <p className="text-xs text-muted-foreground leading-relaxed">Muévete por diferentes zonas según tu necesidad: Silenciosa, Social o Creativa.</p>
            </div>
         </div>
      </div>
    </main>
  );
}
