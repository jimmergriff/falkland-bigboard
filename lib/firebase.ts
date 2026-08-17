'use client';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue } from 'firebase/database';
import { OwnerEvaluation } from './types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
};

let app: any;
let database: any;

const initFirebase = () => {
  if (!app) {
    try {
      app = initializeApp(firebaseConfig);
      database = getDatabase(app);
    } catch (error) {
      console.error('Firebase init error:', error);
    }
  }
  return database;
};

export const saveEvaluation = async (evaluation: OwnerEvaluation) => {
  try {
    const db = initFirebase();
    if (!db) return;
    const evalRef = ref(db, `evaluations/${evaluation.id}`);
    await set(evalRef, evaluation);
    console.log('Evaluation saved:', evaluation.id);
  } catch (error) {
    console.error('Error saving evaluation:', error);
  }
};

export const loadEvaluations = async (): Promise<OwnerEvaluation[]> => {
  try {
    const db = initFirebase();
    if (!db) return [];
    const evalsRef = ref(db, 'evaluations');
    const snapshot = await get(evalsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data) as OwnerEvaluation[];
    }
    return [];
  } catch (error) {
    console.error('Error loading evaluations:', error);
    return [];
  }
};

export const subscribeToEvaluations = (callback: (evals: OwnerEvaluation[]) => void) => {
  try {
    const db = initFirebase();
    if (!db) return () => {};
    const evalsRef = ref(db, 'evaluations');
    return onValue(evalsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const evals = Object.values(data) as OwnerEvaluation[];
        callback(evals);
      } else {
        callback([]);
      }
    });
  } catch (error) {
    console.error('Firebase subscribe error:', error);
    return () => {};
  }
};
