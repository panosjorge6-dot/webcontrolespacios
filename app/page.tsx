'use client';

import { useState, useEffect } from 'react';
import { FloorMap } from '@/components/floor-map';
import { MapFilters } from '@/components/map-filters';
import { BookingDialog } from '@/components/booking-dialog';
import { CompleteProfileDialog } from '@/components/complete-profile-dialog';
import { Space, SpaceType, SpaceZone } from '@/types';
import { useRealtimeBookings } from '@/hooks/use-realtime-bookings';
import { useAuth } from '@/hooks/use-auth';
import { MOCK_SPACES } from '@/constants/spaces';
import { motion } from 'framer-motion';
import { Coffee, Zap, Palette, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  });

  const selectedDate = dateRange?.from || new Date();
  const [selectedType, setSelectedType] = useState<SpaceType | 'all'>('all');
  const [selectedZone, setSelectedZone] = useState<SpaceZone | 'all'>('all');
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const { bookings } = useRealtimeBookings(selectedDate);
  const { user, updateUser } = useAuth();

  const showCompleteProfile = !!user && !user.isProfileComplete;

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredSpaces = MOCK_SPACES.filter(s => {
    const typeMatch = selectedType === 'all' || s.type === selectedType;
    const zoneMatch = selectedZone === 'all' || s.zone === selectedZone;
    return typeMatch && zoneMatch;
  });

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <main className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tighter text-foreground"
          >
            Tu lugar en <span className="text-primary italic">Genion Lab</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl font-medium"
          >
            Reserva tu escritorio, sala de reuniones u oficina en el coworking de la innovación en Petrer. 
            Únete a la comunidad más creativa.
          </motion.p>
        </div>

        {/* Interactive Workspace Area */}
        <section className="space-y-8">
           <MapFilters 
             selectedDate={selectedDate || new Date()}
             setSelectedDate={(date) => setDateRange({ from: date, to: undefined })}
             selectedType={selectedType}
             setSelectedType={setSelectedType}
             selectedZone={selectedZone}
             setSelectedZone={setSelectedZone}
           />

           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Info */}
              <div className="lg:col-span-1 space-y-6">
                 <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-4">
                     <div className="flex items-center justify-between px-1 mb-2">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-2">
                           <CalendarIcon size={14} className="text-primary" />
                           Calendario
                        </h3>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-2 py-0.5 text-[10px]">
                           {dateRange?.from && dateRange?.to 
                             ? `${format(dateRange.from, 'd MMM', { locale: es })} - ${format(dateRange.to, 'd MMM', { locale: es })}`
                             : dateRange?.from ? format(dateRange.from, 'd MMM', { locale: es }) : '...'}
                        </Badge>
                     </div>
                    <div className="pt-2 px-1">
                       <Calendar
                         mode="range"
                         selected={dateRange}
                         onSelect={setDateRange}
                         className="rounded-xl border-none w-full"
                       />
                    </div>
                    <div className="pt-2">
                       <p className="text-[10px] text-muted-foreground leading-relaxed px-2 italic">
                          * Mostrando disponibilidad para el {format(selectedDate, 'PPPP', { locale: es })}
                       </p>
                    </div>
                 </div>

                 <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                    <h3 className="font-bold text-sm tracking-widest uppercase text-muted-foreground">Beneficios</h3>
                    <div className="space-y-4">
                       <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                             <Coffee size={20} />
                          </div>
                          <div>
                             <h4 className="font-bold text-sm">Café Ilimitado</h4>
                             <p className="text-[10px] text-muted-foreground uppercase font-semibold">Tostado local</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                             <Palette size={20} />
                          </div>
                          <div>
                             <h4 className="font-bold text-sm">Zonas Creativas</h4>
                             <p className="text-[10px] text-muted-foreground uppercase font-semibold">Inspiración pura</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Map Canvas */}
              <div className="lg:col-span-3">
                 <FloorMap 
                   spaces={filteredSpaces}
                   bookings={bookings}
                   date={selectedDate}
                   onSpaceSelect={(space) => setSelectedSpace(space)}
                 />
              </div>
           </div>
        </section>
      </div>

      <BookingDialog 
        space={selectedSpace}
        dateRange={dateRange}
        isOpen={!!selectedSpace}
        onClose={() => setSelectedSpace(null)}
      />

      <CompleteProfileDialog 
        user={user} 
        isOpen={showCompleteProfile} 
        onComplete={updateUser} 
      />
    </main>
  );
}
