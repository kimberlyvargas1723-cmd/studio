// src/firebase/config.ts
import type { FirebaseOptions } from 'firebase/app';

/**
 * Firebase configuration object.
 * Replace these values with your application's specific Firebase project configuration.
 *
 * It is safe to expose this configuration on the client-side. Security is enforced
 * by Firebase Security Rules on the backend, not by hiding these keys.
 *
 * You can find this configuration in the Firebase console:
 * Project settings > General > Your apps > Firebase SDK snippet > Config
 */
export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
