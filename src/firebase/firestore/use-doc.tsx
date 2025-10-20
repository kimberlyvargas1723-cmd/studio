// src/firebase/firestore/use-doc.tsx
'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, doc, type DocumentData } from 'firebase/firestore';
import { useFirestore } from '../provider';

/**
 * A React hook for listening to real-time updates on a single Firestore document.
 *
 * @param {string | null} path - The path to the Firestore document (e.g., 'collection/docId'). If null, the hook will not fetch data.
 * @returns {{ data: DocumentData | null; loading: boolean; error: Error | null }}
 *          An object containing the document data, loading state, and error.
 */
export function useDoc(path: string | null) {
  const { firestore } = useFirestore();
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Si no hay path, no hacemos nada. Esto previene el error.
    if (!firestore || !path) {
      setLoading(false);
      setData(null);
      return;
    }
    
    setLoading(true);
    const docRef = doc(firestore, path);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setData({ id: docSnapshot.id, ...docSnapshot.data() });
        } else {
          setData(null); // Document does not exist
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching document:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path]);

  return { data, loading, error };
}
