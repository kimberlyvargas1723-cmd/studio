// src/lib/services.ts
import { initialPerformance } from './data';
import type { PerformanceData, Feedback, SavedSummary } from './types';

/**
 * This file provides a service layer for interacting with the browser's localStorage.
 * It abstracts the direct use of `localStorage`, handles JSON parsing and stringification,
 * and provides a clear API for managing user-specific performance data, feedback history, 
 * and saved summaries, using the user's UID as a key.
 */

// --- Performance Data ---

const PERFORMANCE_DATA_KEY_PREFIX = 'performanceData';

/**
 * Retrieves performance data from localStorage for a specific user.
 * If no data exists, it initializes and returns the default performance structure.
 * @param {string} [userId] - The UID of the user. If not provided, it falls back to a generic key.
 * @returns {PerformanceData[]} An array of performance data objects for each topic.
 */
export function getPerformanceData(userId?: string): PerformanceData[] {
  if (typeof window === 'undefined') return initialPerformance;
  const key = userId ? `${PERFORMANCE_DATA_KEY_PREFIX}_${userId}` : 'performanceData_guest';
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : initialPerformance;
}

/**
 * Updates the performance data for a specific topic in localStorage after a quiz question.
 * It increments either the 'correct' or 'incorrect' count for the given topic for a specific user.
 * @param {string} topic The topic to update.
 * @param {boolean} wasCorrect Whether the user's answer was correct.
 * @param {string} [userId] - The UID of the user.
 */
export function updatePerformanceData(topic: string, wasCorrect: boolean, userId?: string): void {
  if (typeof window === 'undefined') return;
  const perfData = getPerformanceData(userId);
  let topicPerf = perfData.find(p => p.topic === topic);
  
  if (!topicPerf) {
    topicPerf = { topic, correct: 0, incorrect: 0 };
    perfData.push(topicPerf);
  }

  if (wasCorrect) {
    topicPerf.correct += 1;
  } else {
    topicPerf.incorrect += 1;
  }
  const key = userId ? `${PERFORMANCE_DATA_KEY_PREFIX}_${userId}` : 'performanceData_guest';
  localStorage.setItem(key, JSON.stringify(perfData));
}

// --- Feedback History ---

const FEEDBACK_HISTORY_KEY_PREFIX = 'feedbackHistory';

/**
 * Retrieves the AI-generated feedback history from localStorage for a specific user.
 * @param {string} [userId] - The UID of the user.
 * @returns {Feedback[]} An array of feedback objects, sorted from most to least recent.
 */
export function getFeedbackHistory(userId?: string): Feedback[] {
  if (typeof window === 'undefined') return [];
  const key = userId ? `${FEEDBACK_HISTORY_KEY_PREFIX}_${userId}` : 'feedbackHistory_guest';
  const history = localStorage.getItem(key);
  return history ? JSON.parse(history) : [];
}

/**
 * Saves new feedback to the feedback history in localStorage for a specific user.
 * @param {Feedback} feedbackData The new feedback data object to save.
 * @param {string} [userId] - The UID of the user.
 */
export function saveFeedback(feedbackData: Feedback, userId?: string): void {
  if (typeof window === 'undefined') return;
  const history = getFeedbackHistory(userId);
  history.unshift(feedbackData);
  const key = userId ? `${FEEDBACK_HISTORY_KEY_PREFIX}_${userId}` : 'feedbackHistory_guest';
  localStorage.setItem(key, JSON.stringify(history.slice(0, 20)));
}

// --- Saved Summaries ---

const SAVED_SUMMARIES_KEY_PREFIX = 'savedSummaries';

/**
 * Retrieves all saved summaries from localStorage for a specific user.
 * @param {string} [userId] - The UID of the user.
 * @returns {SavedSummary[]} An array of saved summary objects.
 */
export function getSavedSummaries(userId?: string): SavedSummary[] {
    if (typeof window === 'undefined') return [];
    const key = userId ? `${SAVED_SUMMARIES_KEY_PREFIX}_${userId}` : 'savedSummaries_guest';
    const summaries = localStorage.getItem(key);
    const parsedSummaries = summaries ? JSON.parse(summaries) : [];
    return parsedSummaries.sort((a: SavedSummary, b: SavedSummary) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Saves a new summary to localStorage for a specific user.
 * @param {SavedSummary} summaryData The summary data object to save.
 * @param {string} [userId] - The UID of the user.
 */
export function saveSummary(summaryData: SavedSummary, userId?: string): void {
    if (typeof window === 'undefined') return;
    const key = userId ? `${SAVED_SUMMARIES_KEY_PREFIX}_${userId}` : 'savedSummaries_guest';
    const summaries = getSavedSummaries(userId);
    summaries.unshift(summaryData);
    localStorage.setItem(key, JSON.stringify(summaries));
}

/**
 * Deletes a summary from localStorage by its unique ID for a specific user.
 * @param {string} summaryId The ID of the summary to delete.
 * @param {string} [userId] - The UID of the user.
 * @returns {SavedSummary[]} The updated array of summaries after deletion.
 */
export function deleteSummary(summaryId: string, userId?: string): SavedSummary[] {
    if (typeof window === 'undefined') return [];
    const key = userId ? `${SAVED_SUMMARIES_KEY_PREFIX}_${userId}` : 'savedSummaries_guest';
    let summaries = getSavedSummaries(userId);
    summaries = summaries.filter(s => s.id !== summaryId);
    localStorage.setItem(key, JSON.stringify(summaries));
    return summaries;
}
