import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Booking } from '@/types';
import { format } from 'date-fns';

export function useRealtimeBookings(date: Date) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const bookingsRef = collection(db, 'bookings');
    
    // We listen to bookings for the selected date
    const q = query(
      bookingsRef,
      where('date', '==', dateStr),
      where('status', '==', 'confirmed')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
      setBookings(data);
      setLoading(false);
    }, (error) => {
      console.error('Realtime bookings error:', error);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [date]);

  return { bookings, loading };
}
