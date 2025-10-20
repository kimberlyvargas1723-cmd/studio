// src/firebase/client-provider.tsx
'use client';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

/**
 * This provider component ensures that Firebase is initialized only once
 * on the client-side and makes the Firebase app instance available to
 * all child components through the FirebaseProvider.
 *
 * @param {{ children: React.ReactNode }} props - The child components to render.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const { app, auth, firestore, database, storage } = initializeFirebase();
  
  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore} database={database} storage={storage}>
      {children}
    </FirebaseProvider>
  );
}
