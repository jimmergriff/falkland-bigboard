'use client';

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase once
let firebaseApp: any = null;
let authInstance: any = null;

const initializeFirebaseAuth = () => {
  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
    authInstance = getAuth(firebaseApp);
  }
  return authInstance;
};

// User role mapping
const USER_ROLES: { [key: string]: string } = {
  'jamesgriff729@gmail.com': 'Roy',
  'spencer.birkel@gmail.com': 'Pine',
};

export const getUserRole = (email: string | null): string | null => {
  if (!email) return null;
  return USER_ROLES[email.toLowerCase()] || null;
};

export const signInWithGoogle = async () => {
  try {
    const auth = initializeFirebaseAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    const email = result.user.email;
    const role = getUserRole(email);
    
    if (!role) {
      // User not authorized
      await signOut(auth);
      throw new Error('This email is not authorized. Please use an authorized account.');
    }
    
    return { user: result.user, role };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    const auth = initializeFirebaseAuth();
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const onAuthChange = (callback: (user: User | null, role: string | null) => void) => {
  const auth = initializeFirebaseAuth();
  return onAuthStateChanged(auth, (user) => {
    const role = user ? getUserRole(user.email) : null;
    callback(user, role);
  });
};
