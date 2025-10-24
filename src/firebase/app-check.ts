// src/firebase/app-check.ts
import { initializeAppCheck, ReCaptchaV3Provider, getToken, type AppCheck } from 'firebase/app-check';
import type { FirebaseApp } from 'firebase/app';

declare global {
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
}

let appCheck: AppCheck | null = null;

/**
 * Firebase App Check Configuration
 *
 * App Check helps protect your backend resources from abuse by preventing unauthorized
 * clients from accessing your backend resources. It works with both Firebase services
 * (Firestore, Realtime Database, Cloud Storage, Cloud Functions) and your own backend.
 *
 * @see https://firebase.google.com/docs/app-check
 */
export interface AppCheckConfig {
  /**
   * reCAPTCHA v3 site key from Google reCAPTCHA admin console
   * Get it from: https://www.google.com/recaptcha/admin
   */
  recaptchaSiteKey: string;

  /**
   * Enable debug token for local development
   * Set to true to enable debug mode
   */
  isDebugMode?: boolean;

  /**
   * Debug token for local testing
   * Generate using Firebase Console: Project Settings > App Check
   */
  debugToken?: string;
}

/**
 * Initializes Firebase App Check with reCAPTCHA v3 provider
 *
 * This function should be called once during app initialization, typically
 * after Firebase app initialization but before any Firebase service calls.
 *
 * @param app - Initialized Firebase app instance
 * @param config - App Check configuration object
 * @returns AppCheck instance or null if already initialized
 *
 * @example
 * ```typescript
 * const app = initializeApp(firebaseConfig);
 * initializeFirebaseAppCheck(app, {
 *   recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
 *   isDebugMode: process.env.NODE_ENV === 'development'
 * });
 * ```
 */
export function initializeFirebaseAppCheck(
  app: FirebaseApp,
  config: AppCheckConfig
): AppCheck | null {
  // Only initialize on client-side
  if (typeof window === 'undefined') {
    return null;
  }

  // Return existing instance if already initialized
  if (appCheck) {
    return appCheck;
  }

  try {
    // Enable debug mode for local development
    if (config.isDebugMode) {
      // This allows you to run the app locally without reCAPTCHA verification
      // You need to add the debug token to Firebase Console
      if (config.debugToken) {
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = config.debugToken;
      } else {
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }
      console.log('🔓 App Check: Debug mode enabled');
    }

    // Initialize App Check with reCAPTCHA v3 provider
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(config.recaptchaSiteKey),

      // Automatically refresh tokens when they expire
      isTokenAutoRefreshEnabled: true,
    });

    console.log('✅ App Check: Initialized successfully');
    return appCheck;
  } catch (error) {
    console.error('❌ App Check: Initialization failed', error);
    // Don't throw - allow app to continue but log the error
    return null;
  }
}

/**
 * Gets the current App Check instance
 *
 * @returns AppCheck instance or null if not initialized
 */
export function getAppCheck(): AppCheck | null {
  return appCheck;
}

/**
 * Gets an App Check token
 *
 * This function forces a token refresh and returns a new token.
 * Useful for testing or when you need to explicitly verify App Check status.
 *
 * @param forceRefresh - If true, forces token refresh even if current token is valid
 * @returns Promise with the App Check token result
 *
 * @example
 * ```typescript
 * try {
 *   const token = await getAppCheckToken();
 *   console.log('App Check token:', token.token);
 * } catch (error) {
 *   console.error('Failed to get App Check token:', error);
 * }
 * ```
 */
export async function getAppCheckToken(forceRefresh = false) {
  if (!appCheck) {
    throw new Error('App Check not initialized');
  }

  try {
    const tokenResult = await getToken(appCheck, forceRefresh);
    return tokenResult;
  } catch (error) {
    console.error('Failed to get App Check token:', error);
    throw error;
  }
}

/**
 * Verifies if App Check is properly initialized and working
 *
 * @returns Promise<boolean> - true if App Check is working, false otherwise
 *
 * @example
 * ```typescript
 * const isWorking = await verifyAppCheck();
 * if (!isWorking) {
 *   console.warn('App Check verification failed');
 * }
 * ```
 */
export async function verifyAppCheck(): Promise<boolean> {
  if (!appCheck) {
    console.warn('App Check not initialized');
    return false;
  }

  try {
    await getAppCheckToken();
    return true;
  } catch (error) {
    console.error('App Check verification failed:', error);
    return false;
  }
}

/**
 * Custom hook for React components to check App Check status
 *
 * @returns Object with App Check status and token retrieval function
 */
export function useAppCheckStatus() {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);

  React.useEffect(() => {
    const checkStatus = async () => {
      setIsInitialized(!!appCheck);
      if (appCheck) {
        const verified = await verifyAppCheck();
        setIsVerified(verified);
      }
    };

    checkStatus();
  }, []);

  return {
    isInitialized,
    isVerified,
    getToken: getAppCheckToken,
  };
}

// Import React for the custom hook
import * as React from 'react';
