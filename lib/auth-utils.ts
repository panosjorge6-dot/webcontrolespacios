import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { User, UserRole, MembershipType } from '@/types';
import { User as FirebaseUser } from 'firebase/auth';

export const syncUserDocument = async (user: FirebaseUser) => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const newUser: User = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Coworker',
      photoURL: user.photoURL || '',
      role: 'member', // Default role
      membershipType: 'flexible', // Default membership
      membershipValidUntil: serverTimestamp() as any, // Should be calculated
      phone: '',
      isProfileComplete: false,
      createdAt: serverTimestamp() as any,
    };
    await setDoc(userRef, newUser);
    return newUser;
  }

  return userDoc.data() as User;
};

export const getUserData = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? (userDoc.data() as User) : null;
};
