// src/firebase/provider.tsx
'use client';
import { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Database } from 'firebase/database';
import type { FirebaseStorage } from 'firebase/storage';

/**
 * Defines the shape of the context that will be provided to child components.
 * It includes all major Firebase service instances.
 */
interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  database: Database | null;
  storage: FirebaseStorage | null;
}

/**
 * Creates the React context with a default null value.
 */
const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  firestore: null,
  database: null,
  storage: null,
});

/**
 * The main provider component. It takes the initialized Firebase services as props
 * and makes them available to any child component that calls the corresponding hooks.
 * @param {React.PropsWithChildren<FirebaseContextType>} props
 */
export function FirebaseProvider({ children, app, auth, firestore, database, storage }: React.PropsWithChildren<FirebaseContextType>) {
  return (
    <FirebaseContext.Provider value={{ app, auth, firestore, database, storage }}>
      {children}
    </FirebaseContext.Provider>
  );
}

// --- Context Hooks ---

/**
 * A generic hook to access the entire Firebase context.
 * Useful if a component needs multiple Firebase services.
 */
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

/**
 * A specific hook to get only the Firebase Auth instance.
 */
export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return { auth: context.auth };
};

/**
 * A specific hook to get only the Firestore instance.
 */
export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return { firestore: context.firestore };
};

/**
 * A specific hook to get only the Realtime Database instance.
 */
export const useDatabase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a FirebaseProvider');
  }
  return { database: context.database };
};

/**
 * A specific hook to get only the Firebase Storage instance.
 */
export const useStorage = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a FirebaseProvider');
  }
  return { storage: context.storage };
};
