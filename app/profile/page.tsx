'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  Calendar as CalendarIcon,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ProfilePage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    company: '',
  });

  useEffect(() => {
    setMounted(true);
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        phone: user.phone || '',
        company: user.company || '',
      });
    }
  }, [user]);

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={40} />
          </div>
          <h1 className="text-3xl font-black">Acceso Denegado</h1>
          <p className="text-muted-foreground">Debes iniciar sesión para ver tu perfil.</p>
          <Button asChild className="rounded-full px-8 font-bold">
             <a href="/">Ir al Inicio</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName || !formData.phone) {
      toast.error('Nombre y teléfono son obligatorios');
      return;
    }

    setUpdating(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...formData,
        isProfileComplete: true,
      });
      
      updateUser({ ...user, ...formData, isProfileComplete: true });
      toast.success('¡Perfil actualizado con éxito!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Error al guardar los cambios');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Sidebar / Photo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-1/3 space-y-6"
          >
            <Card className="border-none shadow-2xl rounded-3xl bg-card overflow-hidden">
              <div className="h-24 bg-primary relative" />
              <CardContent className="pt-0 relative -mt-12 flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl bg-secondary border-4 border-background overflow-hidden relative shadow-lg">
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                </div>
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-bold tracking-tight">{user.displayName}</h2>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{user.role}</p>
                </div>
                <div className="mt-6 w-full space-y-4 pt-6 border-t">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                    <Mail size={16} className="text-primary" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>Cuenta de Google Verificada</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-3xl bg-card/50 backdrop-blur-sm p-6 overflow-hidden">
               <h3 className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-4">Estado de Membresía</h3>
               <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                     <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Tipo actual</p>
                     <p className="text-lg font-black text-primary capitalize">{user.membershipType.replace('_', ' ')}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/30">
                     <div className="flex items-center gap-2 mb-1">
                        <CalendarIcon size={14} className="text-muted-foreground" />
                        <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Válido hasta</p>
                     </div>
                     <p className="text-sm font-bold">
                       {user.membershipValidUntil ? format(user.membershipValidUntil.toDate(), 'PPP', { locale: es }) : 'N/A'}
                     </p>
                  </div>
               </div>
            </Card>
          </motion.div>

          {/* Main Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full md:w-2/3"
          >
            <form onSubmit={handleUpdate}>
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-muted/30 pb-8">
                  <CardTitle className="text-2xl font-black">Información de Perfil</CardTitle>
                  <CardDescription className="text-sm font-medium">Gestiona tu identidad profesional en el coworking.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nombre Completo</label>
                       <div className="relative">
                          <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            value={formData.displayName}
                            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                            className="pl-10 h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary font-bold"
                            placeholder="Tu nombre completo"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Teléfono Móvil</label>
                       <div className="relative">
                          <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="pl-10 h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary font-bold"
                            placeholder="+34 600 000 000"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Empresa / Proyecto / LinkedIn</label>
                    <div className="relative">
                      <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="pl-10 h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary font-bold"
                        placeholder="Nombre de tu empresa o freelance"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Preferencias de la Cuenta</h3>
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 size={20} className="text-emerald-500" />
                          <p className="text-sm font-bold">Registro Identificativo Completado</p>
                       </div>
                       <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none">OK</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10 p-8 flex justify-end">
                   <Button 
                    type="submit" 
                    disabled={updating}
                    className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-2"
                   >
                     {updating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                     Guardar Cambios
                   </Button>
                </CardFooter>
              </Card>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
