// src/firebase/provider.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, type Auth, type User } from 'firebase/auth';
import { firebaseConfig } from './config';

// Define the shape of the context value
interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context with an initial undefined value
const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

/**
 * A React provider that initializes Firebase and makes the app and auth instances
 * available to all child components through the `useAuth` hook.
 * It also manages the authentication state of the user.
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components to render.
 */
export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize Firebase app (singleton pattern)
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  /**
   * Initiates the Google sign-in popup flow.
   */
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      throw error;
    }
  };

  /**
   * Signs the current user out.
   */
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const value: FirebaseContextValue = {
    app,
    auth,
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Custom hook to access the Firebase context.
 * This provides access to the Firebase app, auth instance, user state, and auth functions.
 * Throws an error if used outside of a `FirebaseProvider`.
 * @returns {FirebaseContextValue} The Firebase context value.
 */
export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context;
};
