'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { motion } from 'framer-motion';
import { QrCode, Sparkles, Coffee, Zap, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

function QRScanner() {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const fullUrl = `${origin}/check-in?secret=GENION_PETRER_2024`;
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(fullUrl)}`);
    }
  }, []);

  return (
    <div className="p-6 bg-white rounded-3xl shadow-inner border-2 border-primary/5">
       {qrUrl ? (
          <img 
            src={qrUrl}
            alt="QR de Check-in Genion Lab"
            className="w-56 h-56 transition-opacity duration-1000 opacity-100"
          />
       ) : (
          <div className="w-56 h-56 flex items-center justify-center bg-muted/20 animate-pulse text-[10px] uppercase font-black tracking-widest text-primary/40">
             Generando QR...
          </div>
       )}
    </div>
  );
}

export default function QRPosterPage() {
  return (
    <div className="min-h-screen bg-white text-black p-0 m-0 print:p-0">
      <div className="hidden print:hidden lg:block">
         <Navbar />
      </div>

      <main className="max-w-4xl mx-auto py-12 px-8 flex flex-col items-center justify-center min-h-[90vh] text-center space-y-12">
        
        {/* Header Section */}
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-black uppercase tracking-[0.2em] animate-pulse">
              <Sparkles size={16} />
              Genion Lab Petrer
           </div>
           <h1 className="text-6xl font-black tracking-tighter leading-none">
              Aterriza en tu <br/>
              <span className="text-primary italic">espacio creativo</span>
           </h1>
        </div>

        {/* QR Zone */}
        <div className="relative group">
           <div className="w-80 h-80 rounded-[40px] border-8 border-primary/20 bg-white flex flex-col items-center justify-center space-y-4 transition-all hover:scale-[1.02] hover:shadow-2xl">
              <QRScanner />
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">QR Único de Genion Lab</p>
           </div>
           
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute -top-10 -right-10 w-24 h-24 border-2 border-primary/10 rounded-full border-dashed"
           />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-3 gap-8 w-full max-w-2xl px-4">
           <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto text-xl font-black shadow-lg shadow-primary/20">1</div>
              <h4 className="font-black text-xs uppercase tracking-widest">Escanea</h4>
              <p className="text-[10px] text-muted-foreground font-medium">Usa la cámara <br/>de tu móvil</p>
           </div>
           <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mx-auto text-xl font-black shadow-lg shadow-zinc-900/20">2</div>
              <h4 className="font-black text-xs uppercase tracking-widest">Confirma</h4>
              <p className="text-[10px] text-muted-foreground font-medium">Valida tu reserva <br/>para hoy</p>
           </div>
           <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto text-xl font-black shadow-lg shadow-emerald-500/20">3</div>
              <h4 className="font-black text-xs uppercase tracking-widest">Disfruta</h4>
              <p className="text-[10px] text-muted-foreground font-medium">Café y WiFi <br/>listos para ti</p>
           </div>
        </div>

        {/* Footer info */}
        <div className="pt-8 border-t w-full max-w-2xl flex items-center justify-between opacity-70">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><Coffee size={20} /></div>
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><Zap size={20} /></div>
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><MapPin size={20} /></div>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tu coworking en Petrer</p>
              <p className="text-sm font-bold opacity-80">genionlab.petrer.vercel.app</p>
           </div>
        </div>
        
        {/* Print Instruction Button */}
        <div className="pt-8 print:hidden">
           <Button onClick={() => window.print()} className="gap-2 h-14 px-8 rounded-2xl font-black shadow-xl">
              Imprimir Cartel de Entrada
           </Button>
        </div>

      </main>
    </div>
  );
}
