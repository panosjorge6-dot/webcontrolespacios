'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Navbar } from '@/components/navbar';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const CHECKIN_SECRET = "GENION_PETRER_2024";

function CheckInContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'not-found'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeBooking, setActiveBooking] = useState<any>(null);

  useEffect(() => {
    const processCheckIn = async () => {
      if (authLoading) return;

      // 1. Check Auth
      if (!user) {
        setStatus('error');
        setErrorMessage("Debes iniciar sesión para hacer el check-in.");
        return;
      }

      // 2. Check Secret
      const secret = searchParams.get('secret');
      if (secret !== CHECKIN_SECRET) {
        setStatus('error');
        setErrorMessage("Código de Check-in inválido. Asegúrate de estar escaneando el QR oficial de Genion Lab.");
        return;
      }

      try {
        // 3. Find today's active booking for this user
        const today = format(new Date(), 'yyyy-MM-dd');
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid),
          where('date', '==', today),
          where('status', '==', 'confirmed')
        );

        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setStatus('not-found');
          return;
        }

        // Check if there is a booking happening NOW (or near now)
        const now = new Date();
        let found = false;

        for (const docSnap of snapshot.docs) {
          const booking = docSnap.data();
          const start = booking.startTime.toDate();
          const end = booking.endTime.toDate();

          // Margin of 30 mins before start
          const marginStart = new Date(start.getTime() - 30 * 60000);
          
          if (now >= marginStart && now <= end) {
            // Found active booking!
            if (booking.checkedIn) {
              setActiveBooking({ id: docSnap.id, ...booking });
              setStatus('success'); // Already checked in
              found = true;
              break;
            }

            // Mark as checked in
            await updateDoc(docSnap.ref, {
              checkedIn: true,
              checkedInAt: serverTimestamp()
            });

            setActiveBooking({ id: docSnap.id, ...booking });
            setStatus('success');
            found = true;
            toast.success("¡Check-in realizado con éxito!");
            break;
          }
        }

        if (!found) {
          setStatus('not-found');
        }

      } catch (err) {
        console.error("Check-in error:", err);
        setStatus('error');
        setErrorMessage("Error al conectar con la base de datos.");
      }
    };

    processCheckIn();
  }, [user, authLoading, searchParams, router]);

  return (
    <main className="max-w-md mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[80vh]">
        
        {status === 'loading' && (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
              <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-black">Validando tu llegada...</h2>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Estamos verificando tu reserva en Genion Lab Petrer.</p>
            </div>
          </div>
        )}

        {status === 'success' && activeBooking && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 w-full"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto relative">
              <CheckCircle2 className="text-emerald-500" size={56} />
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-emerald-500 rounded-full"
              />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight">¡Bienvenido!</h1>
              <p className="text-muted-foreground font-medium">Has completado el check-in correctamente.</p>
              
              <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 text-left space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                   <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-none px-3 py-1 font-bold">RESERVA CONFIRMADA</Badge>
                   <Sparkles className="text-primary" size={18} />
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Tu espacio</p>
                   <p className="text-xl font-black">Escritorio {activeBooking.spaceId.split('_').pop()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                   <div className="flex items-center gap-2">
                      <Calendar className="text-primary" size={14} />
                      <span className="text-xs font-bold">{format(new Date(), 'dd/MM/yyyy')}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Clock className="text-primary" size={14} />
                      <span className="text-xs font-bold">{activeBooking.startTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {activeBooking.endTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   </div>
                </div>
              </div>
            </div>

            <Button onClick={() => router.push('/')} className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
              Ir a mi escritorio
            </Button>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 w-full"
          >
            <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
               <XCircle size={56} />
            </div>
            <div>
               <h2 className="text-2xl font-black">Ups! Algo salió mal</h2>
               <p className="text-muted-foreground mt-2 font-bold px-4">{errorMessage}</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/')} className="w-full h-12 rounded-xl font-bold">
              Volver al inicio
            </Button>
          </motion.div>
        )}

        {status === 'not-found' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 w-full"
          >
             <div className="w-24 h-24 rounded-full bg-warning/10 flex items-center justify-center mx-auto text-warning">
               <Calendar size={56} />
            </div>
            <div className="space-y-3">
               <h2 className="text-2xl font-black">Sin reserva activa</h2>
               <p className="text-muted-foreground font-medium px-4">No hemos encontrado ninguna reserva confirmada a tu nombre para este momento en Genion Lab Petrer.</p>
            </div>
            <div className="p-4 rounded-2xl bg-muted/30 text-xs font-bold text-muted-foreground border border-dashed border-border">
               Si acabas de reservar, espera unos segundos e intenta escanear el código de nuevo.
            </div>
            <Button onClick={() => router.push('/')} className="w-full h-14 rounded-2xl font-black text-lg">
              Hacer una reserva
            </Button>
          </motion.div>
        )}

      </main>
  );
}

export default function CheckInPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      }>
        <CheckInContent />
      </Suspense>
    </div>
  );
}
