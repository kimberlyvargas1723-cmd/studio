// src/firebase/auth/use-user.tsx
'use client';
import { onAuthStateChanged, type Auth, type User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useAuth } from '../provider';

/**
 * A React hook that provides real-time information about the currently
 * authenticated user.
 *
 * @returns {{ user: User | null; loading: boolean }} An object containing
 * the user object (or null if not logged in) and a loading state.
 */
export function useUser() {
  const { auth } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error('Error with onAuthStateChanged:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}
