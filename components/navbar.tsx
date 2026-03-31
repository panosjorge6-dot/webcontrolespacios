'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Bell,
  LogIn,
  LogOut,
  Settings,
  User as UserIcon,
  LayoutDashboard,
  Calendar as CalendarIcon,
  Menu,
  X,
  Map as MapIcon,
  Zap,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { NotificationTray } from './notification-tray';
import { ModeToggle } from './mode-toggle';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

export function Navbar() {
  const { user, loginWithGoogle, logout, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Mapa', href: '/', icon: <MapIcon size={18} /> },
    { name: 'Mis Reservas', href: '/my-bookings', icon: <CalendarIcon size={18} /> },
    { name: 'Hot Desking', href: '/hot-desking', icon: <Zap size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group py-1 active:scale-95 transition-all">
              <img
                src="/logo-genion.png"
                alt="Genion Lab Petrer"
                className="h-16 w-auto grayscale-100 brightness-0 dark:invert transition-all duration-300 group-hover:scale-105"
              />
            </Link>

            <div className="hidden md:flex gap-1 h-16 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-4 h-full flex items-center text-sm font-bold tracking-tight transition-all border-b-2
                    ${pathname === link.href
                      ? 'text-primary border-primary bg-primary/5'
                      : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30'}
                  `}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <ModeToggle />

            {authLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mx-4" />
            ) : user ? (
              <>
                <NotificationTray />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all shadow-sm">
                      <AvatarImage src={user.photoURL} alt={user.displayName} />
                      <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 mt-2 shadow-2xl">
                    <DropdownMenuLabel className="font-normal p-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold truncate">{user.displayName}</span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">{user.role} • {user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-xl h-10 cursor-pointer">
                      <Link href="/profile" className="flex items-center gap-3">
                        <UserIcon size={16} className="text-muted-foreground" /> Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl h-10 cursor-pointer">
                      <Link href="/my-bookings" className="flex items-center gap-3">
                        <CalendarIcon size={16} className="text-muted-foreground" /> Mis Reservas
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild className="rounded-xl h-10 cursor-pointer text-primary bg-primary/5">
                        <Link href="/admin" className="flex items-center gap-3 font-bold">
                          <LayoutDashboard size={16} /> Panel Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="rounded-xl h-10 text-destructive cursor-pointer group">
                      <LogOut size={16} className="mr-3 group-hover:translate-x-1 transition-transform" /> Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={loginWithGoogle} size="sm" className="gap-2 bg-primary rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                <LogIn size={16} />
                Acceder
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-muted-foreground hover:text-foreground transition-all"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[49] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 bottom-0 w-full max-w-[300px] bg-card border-l z-50 md:hidden p-6 space-y-8"
            >
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-2">Navegación</p>
                <div className="grid grid-cols-1 gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                             flex items-center justify-between p-4 rounded-xl text-sm font-bold transition-all
                             ${pathname === link.href ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted'}
                           `}
                    >
                      <div className="flex items-center gap-3">
                        {link.icon}
                        {link.name}
                      </div>
                      <ChevronRight size={14} className={pathname === link.href ? 'opacity-100' : 'opacity-40'} />
                    </Link>
                  ))}
                </div>
              </div>

              {user && (
                <div className="pt-8 border-t space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-2">Centro de Control</p>
                  <div className="grid grid-cols-1 gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl text-sm font-bold"
                    >
                      <UserIcon size={18} /> Mi Perfil
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl text-sm font-bold text-primary"
                      >
                        <LayoutDashboard size={18} /> Admin Panel
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {!user && !authLoading && (
                <div className="pt-8 border-t space-y-4 px-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-2">Acceso</p>
                  <Button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      const provider = new GoogleAuthProvider();
                      try {
                        setLoading(true);
                        await signInWithPopup(auth, provider);
                        toast.success('Sesión iniciada con éxito');
                      } catch (error: any) {
                        console.error('Login error:', error);
                        toast.error('Error al iniciar sesión: ' + (error.message || 'Error desconocido'));
                        setLoading(false);
                      }
                    }}
                    className="w-full gap-3 p-4 h-14 bg-primary rounded-xl text-sm font-bold shadow-lg shadow-primary/20"
                  >
                    <LogIn size={18} /> Iniciar Sesión con Google
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

