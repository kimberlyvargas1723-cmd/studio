// src/lib/services.ts
import { initialPerformance } from './data';
import type { PerformanceData, Feedback, SavedSummary } from './types';

/**
 * Namespace for functions that interact with the browser's localStorage.
 * This abstracts the direct use of `localStorage` and handles JSON parsing.
 */

// --- Performance Data ---

const PERFORMANCE_DATA_KEY = 'performanceData';

/**
 * Retrieves performance data from localStorage.
 * Initializes with default data if none exists.
 * @returns {PerformanceData[]} An array of performance data objects.
 */
export function getPerformanceData(): PerformanceData[] {
  if (typeof window === 'undefined') return initialPerformance;
  const data = localStorage.getItem(PERFORMANCE_DATA_KEY);
  return data ? JSON.parse(data) : initialPerformance;
}

/**
 * Updates the performance data for a specific topic in localStorage.
 * @param {string} topic The topic to update.
 * @param {boolean} wasCorrect Whether the answer was correct.
 */
export function updatePerformanceData(topic: string, wasCorrect: boolean): void {
  if (typeof window === 'undefined') return;
  const perfData = getPerformanceData();
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
  localStorage.setItem(PERFORMANCE_DATA_KEY, JSON.stringify(perfData));
}

// --- Feedback History ---

const FEEDBACK_HISTORY_KEY = 'feedbackHistory';

/**
 * Retrieves the feedback history from localStorage.
 * @returns {Feedback[]} An array of feedback objects, sorted by most recent.
 */
export function getFeedbackHistory(): Feedback[] {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem(FEEDBACK_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

/**
 * Saves new feedback to the feedback history in localStorage.
 * Keeps a maximum of 20 entries.
 * @param {Feedback} feedbackData The new feedback data to save.
 */
export function saveFeedback(feedbackData: Feedback): void {
  if (typeof window === 'undefined') return;
  const history = getFeedbackHistory();
  history.unshift(feedbackData); // Add to the beginning
  localStorage.setItem(FEEDBACK_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}

// --- Saved Summaries ---

const SAVED_SUMMARIES_KEY = 'savedSummaries';

/**
 * Retrieves all saved summaries from localStorage.
 * @returns {SavedSummary[]} An array of saved summary objects, sorted by most recent.
 */
export function getSavedSummaries(): SavedSummary[] {
    if (typeof window === 'undefined') return [];
    const summaries = localStorage.getItem(SAVED_SUMMARIES_KEY);
    const parsedSummaries = summaries ? JSON.parse(summaries) : [];
    // Sort by most recent first
    return parsedSummaries.sort((a: SavedSummary, b: SavedSummary) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Saves a new summary to localStorage.
 * @param {SavedSummary} summaryData The summary data to save.
 */
export function saveSummary(summaryData: SavedSummary): void {
    if (typeof window === 'undefined') return;
    const summaries = getSavedSummaries();
    summaries.unshift(summaryData);
    localStorage.setItem(SAVED_SUMMARIES_KEY, JSON.stringify(summaries));
}

/**
 * Deletes a summary from localStorage by its ID.
 * @param {string} summaryId The ID of the summary to delete.
 * @returns {SavedSummary[]} The updated array of summaries after deletion.
 */
export function deleteSummary(summaryId: string): SavedSummary[] {
    if (typeof window === 'undefined') return [];
    let summaries = getSavedSummaries();
    summaries = summaries.filter(s => s.id !== summaryId);
    localStorage.setItem(SAVED_SUMMARIES_KEY, JSON.stringify(summaries));
    return summaries;
}
