// src/firebase/index.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getDatabase, type Database } from "firebase/database";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "./config";
import { initializeFirebaseAppCheck, type AppCheckConfig } from "./app-check";

// Re-export providers and hooks for easy access
export {
  FirebaseProvider,
  useFirebase,
  useAuth,
  useFirestore,
  useDatabase,
  useStorage,
} from "./provider";
export { FirebaseClientProvider } from "./client-provider";
export { useCollection } from "./firestore/use-collection";
export { useDoc } from "./firestore/use-doc";
export { useUser } from "./auth/use-user";

// Re-export App Check utilities
export {
  initializeFirebaseAppCheck,
  getAppCheck,
  getAppCheckToken,
  verifyAppCheck,
  useAppCheckStatus,
  type AppCheckConfig,
} from "./app-check";

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  database: Database;
  storage: FirebaseStorage;
};

let services: FirebaseServices | null = null;

/**
 * Initializes Firebase and returns the app and service instances.
 * This function handles both client-side and server-side initialization,
 * ensuring that Firebase is only initialized once.
 *
 * @param appCheckConfig - Optional App Check configuration
 * @returns {FirebaseServices} An object containing the initialized Firebase services.
 */
export function initializeFirebase(
  appCheckConfig?: AppCheckConfig,
): FirebaseServices {
  if (typeof window !== "undefined") {
    // Client-side execution
    if (!services) {
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

      // Initialize App Check if configuration is provided
      if (appCheckConfig) {
        initializeFirebaseAppCheck(app, appCheckConfig);
      }

      services = {
        app,
        auth: getAuth(app),
        firestore: getFirestore(app),
        database: getDatabase(app),
        storage: getStorage(app),
      };
    }
    return services;
  } else {
    // Server-side execution (if needed, though client-provider handles this)
    const app = initializeApp(firebaseConfig);
    return {
      app,
      auth: getAuth(app),
      firestore: getFirestore(app),
      database: getDatabase(app),
      storage: getStorage(app),
    };
  }
}
