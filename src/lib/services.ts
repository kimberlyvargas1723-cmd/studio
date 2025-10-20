// src/lib/services.ts
import { doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { initialPerformance } from './data';
import type { PerformanceData, Feedback, SavedSummary, LearningStrategy } from './types';

const { firestore } = initializeFirebase();

/**
 * @fileoverview
 * This file provides a service layer for interacting with Firebase services and localStorage.
 * It abstracts the data fetching and setting logic for various parts of the application.
 */

// --- Performance Data (now on Firestore) ---

/**
 * Retrieves the user's performance data from their document in Firestore.
 * @param {string} userId - The UID of the authenticated user.
 * @returns {Promise<PerformanceData[]>} The user's performance data.
 */
export async function getPerformanceData(userId: string): Promise<PerformanceData[]> {
  if (!firestore) return initialPerformance;
  const profile = await getUserProfile(userId);
  return profile?.performanceData || initialPerformance;
}

/**
 * Updates a user's performance data in Firestore after a quiz answer.
 * @param {string} userId - The UID of the authenticated user.
 * @param {string} topic - The topic of the question answered.
 * @param {boolean} wasCorrect - Whether the answer was correct.
 */
export async function updatePerformanceData(userId: string, topic: string, wasCorrect: boolean): Promise<void> {
  if (!firestore || !userId) return;
  const userDocRef = doc(firestore, 'users', userId);
  
  // Find the index of the topic in the performance data array.
  // We need to do this because Firestore can't directly increment a value in an array object by its property.
  const profile = await getUserProfile(userId);
  const perfData = profile?.performanceData || initialPerformance;
  const topicIndex = perfData.findIndex((p: PerformanceData) => p.topic === topic);

  if (topicIndex === -1) {
    // Topic not found, should not happen if initialPerformance is synced.
    console.error(`Topic "${topic}" not found in performance data for user ${userId}.`);
    return;
  }
  
  const fieldToIncrement = wasCorrect ? `performanceData.${topicIndex}.correct` : `performanceData.${topicIndex}.incorrect`;

  try {
    await updateDoc(userDocRef, {
      [fieldToIncrement]: increment(1)
    });
  } catch (error) {
     console.error("Error updating performance data in Firestore:", error);
     // If the document or array doesn't exist, create it.
     const profileData = await getUserProfile(userId);
     const currentPerfData = profileData?.performanceData || initialPerformance;
     const topicData = currentPerfData.find((p: PerformanceData) => p.topic === topic);
     if (topicData) {
        if(wasCorrect) topicData.correct++;
        else topicData.incorrect++;
     }
     await setDoc(userDocRef, { performanceData: currentPerfData }, { merge: true });
  }
}


// --- Feedback History (now on Firestore) ---

/**
 * Retrieves the most recent feedback history for a user from Firestore.
 * @param {string} userId - The UID of the authenticated user.
 * @returns {Promise<Feedback[]>} A promise that resolves to an array of feedback items.
 */
export async function getFeedbackHistory(userId: string): Promise<Feedback[]> {
    if (!firestore || !userId) return [];
    try {
        const feedbackColRef = collection(firestore, 'users', userId, 'feedbackHistory');
        const q = query(feedbackColRef, orderBy('timestamp', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Feedback);
    } catch (error) {
        console.error("Error fetching feedback history from Firestore:", error);
        return [];
    }
}

/**
 * Saves a new feedback entry to the user's feedbackHistory subcollection in Firestore.
 * @param {string} userId - The UID of the authenticated user.
 * @param {Feedback} feedbackData - The feedback object to save.
 */
export async function saveFeedback(userId: string, feedbackData: Feedback): Promise<void> {
    if (!firestore || !userId) return;
    try {
        const feedbackColRef = collection(firestore, 'users', userId, 'feedbackHistory');
        await addDoc(feedbackColRef, feedbackData);
    } catch (error) {
        console.error("Error saving feedback to Firestore:", error);
    }
}

// --- Saved Summaries (still on localStorage) ---

const SAVED_SUMMARIES_KEY = 'savedSummaries';

export function getSavedSummaries(): SavedSummary[] {
    if (typeof window === 'undefined') return [];
    try {
        const summaries = localStorage.getItem(SAVED_SUMMARIES_KEY);
        const parsedSummaries: SavedSummary[] = summaries ? JSON.parse(summaries) : [];
        return parsedSummaries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
        console.error("Error parsing saved summaries from localStorage:", error);
        return [];
    }
}

export function saveSummary(summaryData: SavedSummary): void {
    if (typeof window === 'undefined') return;
    const summaries = getSavedSummaries();
    summaries.unshift(summaryData);
    localStorage.setItem(SAVED_SUMMARIES_KEY, JSON.stringify(summaries));
}

export function deleteSummaryFromStorage(summaryId: string): SavedSummary[] {
    if (typeof window === 'undefined') return [];
    let summaries = getSavedSummaries();
    summaries = summaries.filter(s => s.id !== summaryId);
    localStorage.setItem(SAVED_SUMMARIES_KEY, JSON.stringify(summaries));
    return summaries;
}


// --- Admission Checklist (still on localStorage) ---

const CHECKLIST_STATE_KEY = 'admissionChecklistState';

export function getChecklistState(): Record<string, boolean> {
    if (typeof window === 'undefined') return {};
    try {
        const state = localStorage.getItem(CHECKLIST_STATE_KEY);
        return state ? JSON.parse(state) : {};
    } catch (error) {
        console.error("Error parsing checklist state from localStorage:", error);
        return {};
    }
}

export function updateChecklistState(taskId: string, isChecked: boolean): void {
    if (typeof window === 'undefined') return;
    const state = getChecklistState();
    state[taskId] = isChecked;
    localStorage.setItem(CHECKLIST_STATE_KEY, JSON.stringify(state));
}


// --- User Profile and Learning Strategy (Firestore) ---

/**
 * Retrieves a user's full profile document from Firestore.
 * @param {string} userId - The UID of the authenticated user.
 * @returns {Promise<any | null>} The user's data object or null if not found.
 */
export async function getUserProfile(userId: string): Promise<any | null> {
    if (!firestore || !userId) return null;
    const userDocRef = doc(firestore, 'users', userId);
    try {
        const docSnap = await getDoc(userDocRef);
        return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
        console.error("Error fetching user profile from Firestore:", error);
        return null;
    }
}


/**
 * Retrieves the user's learning strategy from their document in Firestore.
 * @param {string} userId - The UID of the authenticated user.
 * @returns {Promise<LearningStrategy | null>} The learning strategy object or null if not found.
 */
export async function getLearningStrategy(userId: string): Promise<LearningStrategy | null> {
    const profile = await getUserProfile(userId);
    return profile?.learningStrategy || null;
}

/**
 * Saves or updates the user's learning strategy and performance data in their document in Firestore.
 * @param {string} userId - The UID of the authenticated user.
 * @param {LearningStrategy} strategyData - The learning strategy object to save.
 */
export async function saveLearningStrategy(userId: string, strategyData: LearningStrategy): Promise<void> {
    if (!firestore || !userId) return;
    const userDocRef = doc(firestore, 'users', userId);
    try {
        await setDoc(userDocRef, { 
            learningStrategy: strategyData,
            displayName: 'Kimberly', // Set default name on first save
            performanceData: initialPerformance // Initialize performance data
        }, { merge: true });
    } catch (error) {
        console.error("Error saving learning strategy to Firestore:", error);
    }
}
