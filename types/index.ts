import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'member' | 'owner';
export type MembershipType = 'day_pass' | 'fixed_desk' | 'private_office' | 'flexible';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  membershipType: MembershipType;
  membershipValidUntil: Timestamp;
  phone: string;
  company?: string;
  isProfileComplete: boolean;
  createdAt: Timestamp;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

export type SpaceType = 'desk' | 'meeting_room' | 'private_office';
export type SpaceZone = 'zona_silenciosa' | 'zona_social' | 'zona_creativa';

export interface Space {
  id: string;
  type: SpaceType;
  name: string;
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  capacity: number;
  amenities: string[];
  pricePerHour: number;
  isActive: boolean;
  zone: SpaceZone;
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'expired';
export type RecurringPattern = 'weekly' | 'monthly';


export interface Booking {
  id: string;
  spaceId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  date: Timestamp | string; // YYYY-MM-DD
  startTime?: Timestamp;
  endTime?: Timestamp;
  status: BookingStatus;
  createdAt: Timestamp;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  checkedIn?: boolean;
  checkedInAt?: Timestamp;
}

export type NotificationType = 'booking_confirmation' | 'booking_reminder' | 'cancellation' | 'system';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Timestamp;
}
