'use client';

import { motion } from 'framer-motion';
import { Space, Booking } from '@/types';
import { MOCK_SPACES } from '@/constants/spaces';
import { Monitor, Users, DoorOpen, Info } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FloorMapProps {
  spaces?: Space[];
  bookings: Booking[];
  date: Date;
  onSpaceSelect: (space: Space) => void;
}

export function FloorMap({ spaces = MOCK_SPACES, bookings, date, onSpaceSelect }: FloorMapProps) {
  const { user } = useAuth();
  
  const getSpaceStatus = (spaceId: string) => {
    const booking = bookings.find(b => b.spaceId === spaceId);
    if (!booking) return 'available';
    if (user && booking.userId === user.uid) return 'mine';
    return 'occupied';
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
      case 'occupied': return 'bg-destructive/10 border-destructive/20 text-destructive cursor-not-allowed opacity-80';
      case 'mine': return 'bg-warning/10 border-warning/20 text-warning animate-pulse';
      default: return 'bg-muted border-muted-foreground/20 text-muted-foreground cursor-not-allowed';
    }
  };

  const getSpaceIcon = (type: string) => {
    switch (type) {
      case 'desk': return <Monitor size={18} />;
      case 'meeting_room': return <Users size={18} />;
      case 'private_office': return <DoorOpen size={18} />;
      default: return <Info size={18} />;
    }
  };

  return (
    <div className="relative w-full h-[600px] border rounded-xl bg-card overflow-hidden shadow-sm">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative w-full h-full p-8"
      >
        {spaces.map((space) => {
          const status = getSpaceStatus(space.id);
          const styles = getStatusStyles(status);
          const booking = bookings.find(b => b.spaceId === space.id);
          
          const spaceContent = (
            <motion.div
              variants={item}
              style={{
                position: 'absolute',
                left: space.location.x,
                top: space.location.y,
                width: space.location.width,
                height: space.location.height,
              }}
              whileHover={status === 'available' ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
              className={`
                flex flex-col items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-300
                ${styles}
                group overflow-hidden
              `}
              onClick={() => status === 'available' && onSpaceSelect(space)}
            >
              <div className="mb-1">{getSpaceIcon(space.type)}</div>
              <span className="text-[10px] font-bold text-center leading-tight px-1 uppercase tracking-tighter">
                {space.name.split(' ').pop()}
              </span>
              
              {space.capacity > 1 && (
                <div className="absolute bottom-1 right-1 opacity-60 text-[8px] font-medium flex items-center gap-0.5">
                   <Users size={8} /> {space.capacity}
                </div>
              )}

              <div className="absolute top-1 right-1">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  status === 'available' ? 'bg-emerald-500' : 
                  status === 'occupied' ? 'bg-destructive' : 
                  'bg-warning'
                }`} />
              </div>
            </motion.div>
          );

          if (status === 'occupied' && user?.role === 'admin' && booking) {
            return (
              <TooltipProvider key={space.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {spaceContent}
                  </TooltipTrigger>
                  <TooltipContent className="bg-destructive text-destructive-foreground border-none p-3 shadow-xl rounded-xl">
                    <div className="space-y-1">
                      <p className="font-bold text-xs">Reservado por:</p>
                      <p className="text-[11px] font-black">{booking.userName}</p>
                      <p className="text-[9px] opacity-80">{booking.userEmail}</p>
                      {booking.userPhone && <p className="text-[9px] font-bold mt-1">Tel: {booking.userPhone}</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return <div key={space.id}>{spaceContent}</div>;
        })}
      </motion.div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur border rounded-lg p-3 flex gap-4 text-xs font-medium shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" /> Disponible
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" /> Ocupado
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" /> Mi reserva
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted-foreground" /> Mantenimiento
        </div>
      </div>
    </div>
  );
}
