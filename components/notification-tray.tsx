import { useNotifications } from '@/hooks/use-notifications';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Bell, 
  CheckCheck, 
  Calendar as CalendarIcon, 
  AlertCircle, 
  Info,
  Clock
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function NotificationTray() {
  const { notifications, unreadCount, markAsRead, loading } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmation': return <CalendarIcon size={16} className="text-emerald-500" />;
      case 'cancellation': return <AlertCircle size={16} className="text-destructive" />;
      default: return <Info size={16} className="text-primary" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger
         className="relative p-2 text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95 group"
      >
        <Bell size={20} className="group-hover:rotate-[15deg] transition-transform" />
        <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-[8px] font-black flex items-center justify-center text-primary-foreground rounded-full border-2 border-background"
              >
                {unreadCount}
              </motion.span>
            )}
        </AnimatePresence>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 rounded-2xl overflow-hidden shadow-2xl mt-2">
         <div className="p-4 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest">Notificaciones</h3>
            {unreadCount > 0 && (
              <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary bg-primary/5">
                 {unreadCount} nuevas
              </Badge>
            )}
         </div>

         <div className="max-h-[350px] overflow-y-auto">
            {loading ? (
               <div className="p-8 text-center space-y-3">
                  <Clock className="mx-auto text-muted-foreground animate-spin" size={24} />
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Cargando...</p>
               </div>
            ) : notifications.length === 0 ? (
               <div className="p-12 text-center">
                  <CheckCheck size={32} className="mx-auto text-muted-foreground/20 mb-4" />
                  <p className="text-xs text-muted-foreground font-medium italic">Estás al día</p>
               </div>
            ) : (
               <div className="divide-y divide-border/50">
                  {notifications.map((n) => (
                    <div 
                       key={n.id} 
                       onClick={() => !n.read && markAsRead(n.id)}
                       className={`p-4 transition-colors hover:bg-muted/30 cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}
                    >
                       <div className="flex gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!n.read ? 'bg-background shadow-sm' : 'bg-muted/50'}`}>
                             {getIcon(n.type)}
                          </div>
                          <div className="space-y-1">
                             <div className="flex justify-between items-start gap-2">
                                <h4 className="text-xs font-bold leading-tight">{n.title}</h4>
                                <span className="text-[8px] font-bold text-muted-foreground whitespace-nowrap">
                                   {format(n.createdAt?.toDate() || new Date(), 'HH:mm', { locale: es })}
                                </span>
                             </div>
                             <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                                {n.message}
                             </p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            )}
         </div>
         
         <div className="p-2 border-t bg-muted/20">
            <Link 
               href="/my-bookings" 
               className={cn(buttonVariants({ variant: 'ghost' }), "w-full h-8 text-[10px] font-bold uppercase tracking-widest hover:bg-muted/50")}
            >
               Ver mis reservas
            </Link>
         </div>
      </PopoverContent>
    </Popover>
  );
}

