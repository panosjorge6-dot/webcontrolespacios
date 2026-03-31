'use client';

import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from '@/types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { User as UserIcon, Phone, Building2 } from 'lucide-react';

interface CompleteProfileDialogProps {
  user: User | null;
  isOpen: boolean;
  onComplete: (updatedUser: User) => void;
}

export function CompleteProfileDialog({ user, isOpen, onComplete }: CompleteProfileDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    company: user?.company || '',
  });

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName || !formData.phone) {
      toast.error('Por favor, rellena tu nombre y teléfono');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const updates = {
        ...formData,
        isProfileComplete: true,
      };
      
      await updateDoc(userRef, updates);
      
      onComplete({
        ...user,
        ...updates
      } as User);
      
      toast.success('Perfil completado. ¡Ya puedes reservar!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[400px] border-none shadow-2xl p-0 overflow-hidden rounded-3xl">
        <div className="bg-primary h-24 flex items-center justify-center relative">
           <div className="absolute -bottom-10 w-20 h-20 rounded-2xl bg-card border-4 border-background flex items-center justify-center shadow-lg">
              <UserIcon size={32} className="text-primary" />
           </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 pt-14 space-y-6">
          <div className="text-center space-y-2">
            <DialogTitle className="text-2xl font-black tracking-tight">Completa tu Perfil</DialogTitle>
            <DialogDescription className="text-sm font-medium">
              Necesitamos estos datos para identificarte en tus reservas nacionales e internacionales de Genion Lab.
            </DialogDescription>
          </div>

            <div className="space-y-2">
              <label htmlFor="displayName" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Nombre Completo</label>
              <div className="relative">
                <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="displayName" 
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Juan Pérez" 
                  className="pl-10 h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
               <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Teléfono Móvil</label>
               <div className="relative">
                 <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <Input 
                   id="phone" 
                   value={formData.phone}
                   onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                   placeholder="+34 600..." 
                   className="pl-10 h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-primary"
                 />
               </div>
            </div>

            <div className="space-y-2">
               <label htmlFor="company" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Empresa / Proyecto (Opcional)</label>
               <div className="relative">
                 <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <Input 
                   id="company" 
                   value={formData.company}
                   onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                   placeholder="Mi Startup S.L." 
                   className="pl-10 h-11 rounded-xl bg-muted/30 border-none focus-visible:ring-primary"
                 />
               </div>
            </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Finalizar Registro'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
