'use client';

import { useState } from 'react';
import { SpaceType, SpaceZone } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Filter, 
  Calendar as CalendarIcon, 
  Search, 
  Layout, 
  Clock, 
  Wifi, 
  Monitor, 
  Zap, 
  ChevronDown 
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MapFiltersProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedType: SpaceType | 'all';
  setSelectedType: (type: SpaceType | 'all') => void;
  selectedZone: SpaceZone | 'all';
  setSelectedZone: (zone: SpaceZone | 'all') => void;
}

export function MapFilters({ 
  selectedDate, 
  setSelectedDate, 
  selectedType, 
  setSelectedType, 
  selectedZone, 
  setSelectedZone 
}: MapFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-6 px-1 border-b mb-6">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
           <Search size={14} className="absolute left-3 top-3 text-muted-foreground" />
           <Input placeholder="Buscar espacio..." className="pl-9 h-10 bg-muted/30 border-none" />
        </div>
        
        <Popover>
          <PopoverTrigger className="flex items-center justify-center rounded-lg border border-border bg-muted/20 h-10 px-3 hover:bg-muted/40 transition-all cursor-pointer">
              <CalendarIcon size={14} className="mr-2 text-primary" />
              <span className="text-sm font-medium">{format(selectedDate, 'PPP', { locale: es })}</span>
              <ChevronDown size={14} className="ml-2 opacity-50" />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap items-center gap-2">
         {/* Filter Types */}
         <div className="flex bg-muted/40 p-1 rounded-xl h-10 items-center">
            {['all', 'desk', 'meeting_room', 'private_office'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as any)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all
                  ${selectedType === type ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                {type === 'all' ? 'Todos' : type.replace('_', ' ')}
              </button>
            ))}
         </div>

         <div className="flex bg-muted/40 p-1 rounded-xl h-10 items-center">
            {['all', 'zona_silenciosa', 'zona_social', 'zona_creativa'].map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone as any)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all
                  ${selectedZone === zone ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                {zone === 'all' ? 'Todas las Zonas' : zone.replace('zona_', '')}
              </button>
            ))}
         </div>
      </div>
    </div>
  );
}
