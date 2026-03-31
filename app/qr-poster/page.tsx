'use client';

import { Navbar } from '@/components/navbar';
import { motion } from 'framer-motion';
import { QrCode, ArrowRight, CheckCircle, MapPin, Sparkles, Coffee, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

        {/* QR Zone - The User can print this and the QR will be in the middle */}
        <div className="relative group">
           <div className="w-80 h-80 rounded-[40px] border-8 border-primary/20 bg-muted/5 flex flex-col items-center justify-center space-y-4 transition-all hover:scale-[1.02] hover:bg-white hover:shadow-2xl">
              <div className="w-64 h-64 border-4 border-dashed border-primary/30 rounded-3xl flex flex-col items-center justify-center text-primary/40">
                 <QrCode size={120} strokeWidth={1} />
                 <p className="text-[10px] font-black uppercase tracking-widest mt-4">Pega tu Código QR aquí</p>
              </div>
           </div>
           
           {/* Decorative Elements */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute -top-10 -right-10 w-24 h-24 border-2 border-primary/10 rounded-full border-dashed"
           />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-3 gap-8 w-full max-w-2xl">
           <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto text-xl font-black shadow-lg shadow-primary/20">1</div>
              <h4 className="font-black text-sm uppercase tracking-widest">Escanea</h4>
              <p className="text-xs text-muted-foreground font-medium">Enfoca con tu móvil <br/>la cámara normal</p>
           </div>
           <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mx-auto text-xl font-black shadow-lg shadow-zinc-900/20">2</div>
              <h4 className="font-black text-sm uppercase tracking-widest">Confirma</h4>
              <p className="text-xs text-muted-foreground font-medium">Valida tu reserva <br/>para hoy</p>
           </div>
           <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto text-xl font-black shadow-lg shadow-emerald-500/20">3</div>
              <h4 className="font-black text-sm uppercase tracking-widest">Disfruta</h4>
              <p className="text-xs text-muted-foreground font-medium">Café y WiFi <br/>listos para ti</p>
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
              <p className="text-sm font-bold">genionlab.petrer.app</p>
           </div>
        </div>
        
        {/* Print Instruction Button - Hidden on Print */}
        <div className="pt-8 print:hidden">
           <Button onClick={() => window.print()} className="gap-2 h-14 px-8 rounded-2xl font-black shadow-xl">
              Imprimir mi Cartel Oficial
           </Button>
           <p className="text-[10px] text-muted-foreground mt-4 font-bold uppercase tracking-widest leading-relaxed">
             * Se recomienda imprimir en tamaño A3 o A4 para la entrada.
           </p>
        </div>

      </main>
    </div>
  );
}
