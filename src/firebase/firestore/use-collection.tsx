// src/firebase/firestore/use-collection.tsx
'use client';
import { useState, useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  limit,
  startAfter,
  type Firestore,
  type DocumentData,
  type Query,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

/**
 * Defines the structure for query options passed to the useCollection hook.
 */
interface QueryOptions {
  where?: [string, '==', any];
  orderBy?: [string, 'desc' | 'asc'];
  limit?: number;
  startAfter?: any;
}

/**
 * A React hook for listening to real-time updates on a Firestore collection.
 * It provides the data from the collection, loading status, and any errors.
 *
 * @param {string} path - The path to the Firestore collection.
 * @param {QueryOptions} [options] - Optional query constraints.
 * @returns {{ data: DocumentData[]; loading: boolean; error: Error | null }}
 *          An object containing the collection data, loading state, and error.
 */
export function useCollection(path: string, options?: QueryOptions) {
  const { firestore } = useFirestore();
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firestore) {
      setLoading(false);
      return;
    }
    
    let collectionQuery: Query = collection(firestore, path);
    if (options?.where) collectionQuery = query(collectionQuery, where(...options.where));
    if (options?.orderBy) collectionQuery = query(collectionQuery, orderBy(...options.orderBy));
    if (options?.limit) collectionQuery = query(collectionQuery, limit(options.limit));
    if (options?.startAfter) collectionQuery = query(collectionQuery, startAfter(options.startAfter));

    const unsubscribe = onSnapshot(
      collectionQuery,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching collection:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path, JSON.stringify(options)]); // Stringify options to handle dependency changes

  return { data, loading, error };
}
