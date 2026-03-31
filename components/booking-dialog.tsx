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
import { Space, User } from '@/types';
import { createBooking } from '@/lib/booking-utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/hooks/use-auth';
import { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Wifi, Monitor, Coffee, Zap, Info, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BookingDialogProps {
  space: Space | null;
  isOpen: boolean;
  onClose: () => void;
  dateRange: DateRange | undefined;
}

export function BookingDialog({ space, isOpen, onClose, dateRange }: BookingDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('19:30');

  if (!space) return null;

  const handleBooking = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para reservar');
      return;
    }

    setLoading(true);
    const result = await createBooking(
      space, 
      user, 
      dateRange?.from || new Date(),
      dateRange?.to,
      startTime,
      endTime,
      recurring
    );

    setLoading(false);
    
    if (result.success) {
      toast.success(result.count && result.count > 1 
        ? `¡Reserva de ${result.count} días confirmada!` 
        : '¡Reserva confirmada!');
      onClose();
    } else {
      toast.error(result.error || 'Algo salió mal. Inténtalo de nuevo.');
    }
  };

  const getAmenityIcon = (name: string) => {
    const low = name.toLowerCase();
    if (low.includes('wifi')) return <Wifi size={14} className="mr-1" />;
    if (low.includes('monitor')) return <Monitor size={14} className="mr-1" />;
    if (low.includes('pizarra')) return <Zap size={14} className="mr-1" />;
    return <Info size={14} className="mr-1" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {space.type === 'desk' ? <Monitor size={24} /> : <Clock size={24} />}
             </div>
             <div>
                <DialogTitle className="text-xl">{space.name}</DialogTitle>
                <DialogDescription className="text-xs uppercase tracking-wider font-semibold">
                   {space.zone.replace('_', ' ')} • Capacidad: {space.capacity}
                </DialogDescription>
             </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5 overflow-hidden">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Fecha seleccionada</span>
                <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/30 text-[11px] h-9">
                   <CalendarIcon size={14} className="text-primary shrink-0" />
                   <span className="truncate">
                     {dateRange?.from && dateRange?.to 
                       ? `${format(dateRange.from, 'd MMM')} - ${format(dateRange.to, 'd MMM')}`
                       : dateRange?.from ? format(dateRange.from, 'd MMM yyyy', { locale: es }) : 'No hay fecha'}
                   </span>
                </div>
             </div>
             <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Precio</span>
                <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/30 text-sm font-semibold h-9">
                   {space.pricePerHour === 0 ? 'Gratis (Membresía)' : `${space.pricePerHour}€ / hora`}
                </div>
             </div>
          </div>

          {/* Amenities */}
          <div className="space-y-2">
             <span className="text-[10px] font-bold text-muted-foreground uppercase">Comodidades</span>
             <div className="flex flex-wrap gap-2">
                {space.amenities.map(a => (
                  <Badge key={a} variant="secondary" className="px-2 py-0.5 text-[10px] flex items-center">
                    {getAmenityIcon(a)} {a}
                  </Badge>
                ))}
             </div>
          </div>

          {/* Time Selector for Meeting Rooms */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                   <Clock size={10} /> Hora Inicio
                </label>
                <select 
                  className="w-full h-9 p-2 border rounded-lg bg-background text-xs font-bold"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  {['08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                   <Clock size={10} /> Hora Fin
                </label>
                <select 
                  className="w-full h-9 p-2 border rounded-lg bg-background text-xs font-bold"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
             </div>
          </div>

          {!user?.isProfileComplete && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex gap-3 items-center">
               <AlertCircle className="text-destructive shrink-0" size={18} />
               <p className="text-[10px] font-bold text-destructive leading-tight">
                 Debes completar tu perfil (Teléfono) antes de reservar.
               </p>
            </div>
          )}

          {/* Options */}
          <div className="flex items-center space-x-2 pt-2 border-t mt-4">
            <Checkbox 
              id="recurring" 
              checked={recurring} 
              onCheckedChange={(checked) => setRecurring(!!checked)} 
            />
            <label
              htmlFor="recurring"
              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Hacer esta reserva recurrente cada semana
            </label>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cerrar</Button>
          <Button 
            onClick={handleBooking} 
            disabled={loading || !user?.isProfileComplete}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? 'Confirmando...' : (!user?.isProfileComplete ? 'Perfil Incompleto' : 'Confirmar Reserva')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
