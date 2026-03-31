'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Sparkles, Coffee, Zap, Info, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const KNOWLEDGE_BASE = [
  { keywords: ['precio', 'cuanto cuesta', 'tarifa', 'pagar'], response: 'Nuestras tarifas varían desde el pase diario hasta oficinas privadas. El Hot Desking es ideal para empezar, ¡echa un vistazo a los precios al seleccionar una mesa en el mapa!' },
  { keywords: ['horario', 'abierto', 'hora', 'tiempo'], response: 'Genion Lab está abierto de lunes a viernes de 08:30 a 19:30. Para usuarios con escritorio fijo o despacho, el acceso es 24/7.' },
  { keywords: ['wifi', 'internet', 'conexion'], response: 'Contamos con fibra óptica de alta velocidad (simétrica) en todo el edificio para que vueles trabajando.' },
  { keywords: ['cafe', 'beber', 'comida'], response: '¡Por supuesto! El café es ilimitado y de calidad. También tenemos una zona de comedor y relax.' },
  { keywords: ['sala', 'reunion', 'reuniones', 'equipo'], response: 'Puedes reservar nuestras salas de reuniones directamente desde el mapa superior. Tienen capacidad hasta para 10 personas.' },
  { keywords: ['donde', 'esta', 'ubicacion', 'petrer'], response: 'Estamos en el corazón de Petrer, integrados en un entorno de innovación. ¡Es el lugar perfecto para conectar!' },
  { keywords: ['hola', 'buenos dias', 'buenas', 'que tal'], response: '¡Hola! Soy el asistente de Genion Lab. ¿En qué puedo ayudarte a potenciar tu proyecto hoy?' },
];

export function GenionChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '¡Hola! Bienvenido a Genion Lab. Soy Geni, tu asistente inteligente. ¿Te puedo ayudar con alguna duda sobre el coworking?', isBot: true, timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response logic
    setTimeout(() => {
      const userText = inputText.toLowerCase();
      let responseText = "Vaya, todavía estoy aprendiendo. Puedes contactar con nosotros directamente o preguntarme por horarios, precios o el WiFi.";

      for (const item of KNOWLEDGE_BASE) {
        if (item.keywords.some(k => userText.includes(k))) {
          responseText = item.response;
          break;
        }
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="mb-4 w-80 md:w-96 h-[500px] bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight leading-none">Asistente Genion</h3>
                  <Badge variant="secondary" className="bg-white/10 text-[8px] h-4 mt-1 border-none font-black text-white">AI ONLINE</Badge>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 rounded-full h-8 w-8 text-white"
              >
                <X size={18} />
              </Button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.isBot ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`
                    max-w-[85%] p-3 rounded-2xl text-xs font-medium shadow-sm transition-all
                    ${msg.isBot 
                      ? 'bg-card text-foreground rounded-tl-none border border-border/50' 
                      : 'bg-primary text-primary-foreground rounded-tr-none'}
                  `}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card p-3 rounded-2xl rounded-tl-none border border-border/50 space-x-1 flex">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1 h-1 bg-muted-foreground rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Tags */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-muted/5 scrollbar-hide">
              <button 
                onClick={() => setInputText('¿Qué horarios tenéis?')}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-muted border border-border text-[10px] font-bold hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Clock size={10} className="inline mr-1" /> Horarios
              </button>
              <button 
                onClick={() => setInputText('¿Cómo reservo una sala?')}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-muted border border-border text-[10px] font-bold hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Calendar size={10} className="inline mr-1" /> Reservar
              </button>
              <button 
                onClick={() => setInputText('¿Tenéis WiFi rápido?')}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-muted border border-border text-[10px] font-bold hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Zap size={10} className="inline mr-1" /> WiFi
              </button>
            </div>

            {/* Input Footer */}
            <div className="p-4 bg-card border-t border-border/50">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <Input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Pregúntame algo sobre Genion..."
                  className="rounded-xl bg-muted/30 border-none h-10 text-[11px] focus-visible:ring-primary"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="rounded-xl h-10 w-10 bg-primary shadow-lg shadow-primary/20 shrink-0"
                  disabled={!inputText.trim() || isTyping}
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center relative group"
      >
        <span className="absolute -top-12 -left-16 bg-card text-foreground px-3 py-1.5 rounded-xl text-[10px] font-black tracking-tight border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
           ¡Hola! ¿Dudas? 👋
        </span>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full" 
        />
      </motion.button>
    </div>
  );
}
