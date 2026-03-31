'use client';

import { useAuth } from '@/hooks/use-auth';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Calendar as CalendarIcon, 
  ShieldAlert, 
  LayoutDashboard,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Booking } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    todayBookings: 0,
    totalUsers: 0
  });
  const [latestBookings, setLatestBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchStats = async () => {
      try {
        const bookingsCol = collection(db, 'bookings');
        const bookingsSnapshot = await getDocs(bookingsCol);
        
        const q = query(bookingsCol, orderBy('createdAt', 'desc'), limit(5));
        const qSnapshot = await getDocs(q);
        
        const data = qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
        setLatestBookings(data);
        
        const allBookings = bookingsSnapshot.docs.map(doc => doc.data() as Booking);
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        
        setStats({
          totalBookings: allBookings.length,
          activeBookings: allBookings.filter(b => b.status === 'confirmed').length,
          todayBookings: allBookings.filter(b => b.date === todayStr).length,
          totalUsers: 84 // Simulado o fetch users col
        });
        setLoading(false);
      } catch (err) {
        console.error('Admin fetch error:', err);
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
           <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 text-destructive">
              <ShieldAlert size={40} />
           </div>
           <h2 className="text-2xl font-black tracking-tight">Acceso Restringido</h2>
           <p className="text-muted-foreground mt-2">Esta sección está disponible únicamente para administradores del sistema.</p>
           <Link 
              href="/" 
              className={cn(buttonVariants({ variant: 'outline' }), "mt-8 rounded-full px-8")}
           >
              Volver al inicio
           </Link>
        </div>
      </main>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-muted/20 pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                 <LayoutDashboard className="text-primary" /> PANEL <span className="text-primary italic">ADMIN</span>
              </h1>
              <p className="text-muted-foreground mt-1 font-medium">Global Desk Management & Statistics</p>
           </div>
           <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" className="rounded-full gap-2">
                 <CalendarIcon size={16} /> Programar Mantenimiento
              </Button>
              <Button size="sm" className="rounded-full gap-2 bg-primary">
                 <Settings size={16} /> Ajustes Globales
              </Button>
           </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (
          <motion.div 
             variants={container}
             initial="hidden"
             animate="show"
             className="space-y-8"
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <motion.div variants={item}>
                  <Card className="rounded-3xl border-none shadow-xl bg-card">
                     <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                              <CalendarIcon size={20} />
                           </div>
                           <Badge variant="ghost" className="text-emerald-500 bg-emerald-500/5 text-[10px] font-bold">+12%</Badge>
                        </div>
                        <h3 className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Reservas Totales</h3>
                        <p className="text-3xl font-black mt-1">{stats.totalBookings}</p>
                     </CardContent>
                  </Card>
               </motion.div>

               <motion.div variants={item}>
                  <Card className="rounded-3xl border-none shadow-xl bg-card">
                     <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                              <TrendingUp size={20} />
                           </div>
                           <Badge variant="ghost" className="text-orange-500 bg-orange-500/5 text-[10px] font-bold">Activo</Badge>
                        </div>
                        <h3 className="text-muted-foreground text-xs uppercase font-bold tracking-widest">En Tiempo Real</h3>
                        <p className="text-3xl font-black mt-1">{stats.activeBookings}</p>
                     </CardContent>
                  </Card>
               </motion.div>

               <motion.div variants={item}>
                  <Card className="rounded-3xl border-none shadow-xl bg-card">
                     <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                              <Users size={20} />
                           </div>
                           <Badge variant="ghost" className="text-blue-500 bg-blue-500/5 text-[10px] font-bold">Total</Badge>
                        </div>
                        <h3 className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Usuarios Únicos</h3>
                        <p className="text-3xl font-black mt-1">{stats.totalUsers}</p>
                     </CardContent>
                  </Card>
               </motion.div>

               <motion.div variants={item}>
                  <Card className="rounded-3xl border-none shadow-xl bg-card">
                     <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                              <ArrowUpRight size={20} />
                           </div>
                           <Badge variant="ghost" className="text-emerald-500 bg-emerald-500/5 text-[10px] font-bold">Hoy</Badge>
                        </div>
                        <h3 className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Reservas Hoy</h3>
                        <p className="text-3xl font-black mt-1">{stats.todayBookings}</p>
                     </CardContent>
                  </Card>
               </motion.div>
            </div>

            {/* Main Admin Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left Column: Recent Activity */}
               <motion.div variants={item} className="lg:col-span-2 space-y-6">
                  <Card className="rounded-3xl border-none shadow-xl bg-card overflow-hidden">
                     <CardHeader className="border-b bg-card/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                           <div>
                              <CardTitle className="text-lg font-black">Últimas Reservas</CardTitle>
                              <CardDescription className="text-xs">Sincronización en tiempo real con Firebase</CardDescription>
                           </div>
                           <Button variant="ghost" size="sm" className="text-xs font-bold text-primary">Ver Todo →</Button>
                        </div>
                     </CardHeader>
                     <CardContent className="p-0">
                        {latestBookings.length > 0 ? (
                           <div className="divide-y">
                              {latestBookings.map((b) => (
                                 <div key={b.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                          <Users size={18} className="text-muted-foreground" />
                                       </div>
                                       <div>
                                          <p className="text-sm font-bold">{b.userName}</p>
                                          <p className="text-[10px] text-muted-foreground uppercase font-bold">{b.spaceId.replace('-', ' ')} • {format(new Date(b.date as string), 'PP', { locale: es })}</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <Badge variant={b.status === 'confirmed' ? 'outline' : 'secondary'} className={b.status === 'confirmed' ? 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20' : ''}>
                                          {b.status === 'confirmed' ? 'Activa' : 'Pasada'}
                                       </Badge>
                                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                          <ArrowUpRight size={14} />
                                       </Button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="p-12 text-center">
                              <AlertCircle size={32} className="mx-auto text-muted-foreground/30 mb-4" />
                              <p className="text-sm text-muted-foreground">No hay actividad reciente.</p>
                           </div>
                        )}
                     </CardContent>
                  </Card>
               </motion.div>

               {/* Right Column: Quick Management */}
               <motion.div variants={item} className="space-y-6">
                  <Card className="rounded-3xl border-none shadow-xl bg-primary text-primary-foreground overflow-hidden">
                     <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-black flex items-center gap-2">
                           <BarChart3 size={20} /> Centro de Control
                        </CardTitle>
                        <CardDescription className="text-primary-foreground/70 text-xs">Acciones rápidas globales</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4 pt-4">
                        <Button className="w-full justify-between bg-white/10 hover:bg-white/20 border-none text-white h-12 rounded-2xl group">
                           <span>Análisis de Ocupación</span>
                           <TrendingUp size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button className="w-full justify-between bg-white/10 hover:bg-white/20 border-none text-white h-12 rounded-2xl group">
                           <span>Gestión de Membresías</span>
                           <Users size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button className="w-full justify-between bg-white/10 hover:bg-white/20 border-none text-white h-12 rounded-2xl group">
                           <span>Configuración del Mapa</span>
                           <Settings size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                     </CardContent>
                  </Card>

                  <Card className="rounded-3xl border-none shadow-xl bg-card">
                     <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Estado del Sistema</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4 pt-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              Firebase Firestore
                           </div>
                           <span className="text-emerald-500">Operativo</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold">
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              Auth Systems
                           </div>
                           <span className="text-emerald-500">Operativo</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold">
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              Email Service
                           </div>
                           <span className="text-emerald-500">Operativo</span>
                        </div>
                     </CardContent>
                  </Card>
               </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
