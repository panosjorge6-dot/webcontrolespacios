import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Booking } from '@/types';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export function useUserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('userId', '==', user.uid)
      // orderBy( 'createdAt', 'desc' ) -> Removed to avoid Missing Index error
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
      // Sort client-side instead
      const sortedData = data.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setBookings(sortedData);
      setLoading(false);
    }, (error) => {
      console.error('Bookings subscription error:', error);
      setLoading(false);
      // If we see the 'missing index' error, we can point to the console link
      if (error.message.includes('index')) {
        toast.error('Falta un índice en la base de datos. Consultar consola para el enlace.');
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user]);

  const cancelBooking = async (bookingId: string) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: 'cancelled' });
      toast.success('Reserva cancelada correctamente');
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error('Error al cancelar la reserva');
    }
  };

  return { bookings, loading, cancelBooking };
}
