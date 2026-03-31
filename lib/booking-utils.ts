import { 
  collection, 
  doc, 
  runTransaction, 
  serverTimestamp, 
  query, 
  where, 
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Space, User } from '@/types';
import { format, eachDayOfInterval, isSameDay, parse } from 'date-fns';

const BUSINESS_HOURS = {
  start: '08:30',
  end: '19:30'
};

export async function createBooking(
  space: Space,
  user: User,
  startDate: Date,
  endDate?: Date, // optional for ranges
  startTime: string = '08:30', // default to open
  endTime: string = '19:30', // default to close
  isRecurring: boolean = false
) {
  const dates = endDate && !isSameDay(startDate, endDate)
    ? eachDayOfInterval({ start: startDate, end: endDate })
    : [startDate];

  try {
    // 1. Pre-validation: Check business hours
    if (startTime < BUSINESS_HOURS.start || endTime > BUSINESS_HOURS.end) {
      throw new Error(`Las reservas deben estar dentro del horario de Genion Lab (${BUSINESS_HOURS.start} - ${BUSINESS_HOURS.end}).`);
    }

    if (startTime >= endTime) {
      throw new Error('La hora de inicio debe ser anterior a la hora de fin.');
    }

    // 2. Perform availability check for all days
    // We do this by querying existing bookings for these days/space
    for (const date of dates) {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const q = query(
        collection(db, 'bookings'),
        where('spaceId', '==', space.id),
        where('date', '==', dateStr),
        where('status', '==', 'confirmed')
      );
      
      const existingSnapshot = await getDocs(q);
      const existingBookings = existingSnapshot.docs.map(d => d.data());

      // Check for overlaps
      const newStart = parse(`${dateStr} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
      const newEnd = parse(`${dateStr} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date());

      for (const eb of existingBookings) {
        const exStart = eb.startTime.toDate();
        const exEnd = eb.endTime.toDate();

        // (StartA < EndB) and (EndA > StartB) means overlap
        if (newStart < exEnd && newEnd > exStart) {
          throw new Error(`Conflicto horario el ${dateStr}: El espacio ya está reservado de ${format(exStart, 'HH:mm')} a ${format(exEnd, 'HH:mm')}.`);
        }
      }
    }

    // 3. Create Bookings in a Transaction
    await runTransaction(db, async (transaction) => {
      const bookingsToCreate: { ref: any, data: any }[] = [];

      for (const date of dates) {
        const dateStr = format(date, 'yyyy-MM-dd');
        const bookingRef = doc(collection(db, 'bookings')); 
        
        const newBooking = {
          spaceId: space.id,
          userId: user.uid,
          userName: user.displayName,
          userEmail: user.email,
          userPhone: user.phone || '',
          date: dateStr,
          status: 'confirmed',
          createdAt: serverTimestamp(),
          isRecurring,
          startTime: Timestamp.fromDate(parse(`${dateStr} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date())),
          endTime: Timestamp.fromDate(parse(`${dateStr} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date())),
        };

        bookingsToCreate.push({ ref: bookingRef, data: newBooking });
      }

      for (const b of bookingsToCreate) {
        transaction.set(b.ref, b.data);
      }
      
      // Create single notification
      const notificationRef = doc(collection(db, 'notifications'));
      transaction.set(notificationRef, {
        userId: user.uid,
        title: 'Reserva Confirmada',
        message: dates.length > 1 
          ? `Has reservado ${space.name} del ${format(startDate, 'dd/MM')} al ${format(endDate!, 'dd/MM')} (${startTime} - ${endTime}).`
          : `Has reservado ${space.name} para el ${format(startDate, 'dd/MM')} (${startTime} - ${endTime}).`,
        type: 'booking_confirmation',
        read: false,
        createdAt: serverTimestamp(),
      });

      // 4. TRIGGER EMAIL via Firestore 'mail' collection
      const mailRef = doc(collection(db, 'mail'));
      transaction.set(mailRef, {
        to: user.email,
        message: {
          subject: `✅ Reserva Confirmada: ${space.name} en Genion Lab`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f0f0f0; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #000; font-size: 24px; margin: 0;">¡Hola, ${user.displayName}!</h1>
                <p style="color: #666; font-size: 16px;">Tu reserva ha sido confirmada con éxito.</p>
              </div>
              
              <div style="background-color: #f9f9f9; padding: 25px; border-radius: 15px; margin-bottom: 30px;">
                <h2 style="font-size: 14px; color: #999; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0;">Detalles del Espacio</h2>
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">${space.name}</div>
                
                <h2 style="font-size: 14px; color: #999; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0;">Cuándo</h2>
                <div style="font-size: 16px; margin-bottom: 10px;">
                  <strong>Fecha:</strong> ${dates.length > 1 
                    ? `Del ${format(startDate, 'dd/MM/yyyy')} al ${format(endDate!, 'dd/MM/yyyy')}` 
                    : format(startDate, 'dd/MM/yyyy')}
                </div>
                <div style="font-size: 16px;">
                  <strong>Horario:</strong> ${startTime} - ${endTime}
                </div>
              </div>

              <div style="text-align: center; color: #666; font-size: 14px; line-height: 1.6;">
                <p>Te esperamos en Genion Lab Petrer. <br/>Recuerda traer tu equipo y muchas ganas de innovar.</p>
                <p style="margin-top: 30px; font-size: 12px; color: #aaa;">Este es un mensaje automático, por favor no respondas a este correo.</p>
              </div>
            </div>
          `
        }
      });

      return bookingsToCreate;
    });

    return { success: true, count: dates.length };
  } catch (error: any) {
    console.error('Booking failed:', error);
    return { success: false, error: error.message };
  }
}
