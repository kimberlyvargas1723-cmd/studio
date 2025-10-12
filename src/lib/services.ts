// src/lib/services.ts
import { initialPerformance } from './data';
import type { PerformanceData, Feedback, SavedSummary } from './types';

/**
 * This file provides a service layer for interacting with the browser's localStorage.
 * It abstracts the direct use of `localStorage`, handles JSON parsing and stringification,
 * and provides a clear API for managing performance data, feedback history, and saved summaries.
 */

// --- Performance Data ---

const PERFORMANCE_DATA_KEY = 'performanceData';

/**
 * Retrieves performance data from localStorage.
 * If no data exists, it initializes and returns the default performance structure.
 * This function is safe to call on the server-side, returning initial data.
 * @returns {PerformanceData[]} An array of performance data objects for each topic.
 */
export function getPerformanceData(): PerformanceData[] {
  if (typeof window === 'undefined') return initialPerformance;
  const data = localStorage.getItem(PERFORMANCE_DATA_KEY);
  return data ? JSON.parse(data) : initialPerformance;
}

/**
 * Updates the performance data for a specific topic in localStorage after a quiz question.
 * It increments either the 'correct' or 'incorrect' count for the given topic.
 * @param {string} topic The topic to update.
 * @param {boolean} wasCorrect Whether the user's answer was correct.
 */
export function updatePerformanceData(topic: string, wasCorrect: boolean): void {
  if (typeof window === 'undefined') return;
  const perfData = getPerformanceData();
  let topicPerf = perfData.find(p => p.topic === topic);
  
  // If the topic doesn't exist in the data, initialize it.
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
 * Retrieves the AI-generated feedback history from localStorage.
 * Returns an empty array if no history is found.
 * @returns {Feedback[]} An array of feedback objects, sorted from most to least recent.
 */
export function getFeedbackHistory(): Feedback[] {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem(FEEDBACK_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

/**
 * Saves new feedback to the feedback history in localStorage.
 * It prepends the new feedback and keeps a maximum of the 20 most recent entries.
 * @param {Feedback} feedbackData The new feedback data object to save.
 */
export function saveFeedback(feedbackData: Feedback): void {
  if (typeof window === 'undefined') return;
  const history = getFeedbackHistory();
  history.unshift(feedbackData); // Add new feedback to the beginning of the array.
  localStorage.setItem(FEEDBACK_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}

// --- Saved Summaries ---

const SAVED_SUMMARIES_KEY = 'savedSummaries';

/**
 * Retrieves all saved summaries from localStorage.
 * The summaries are sorted by creation date, with the most recent appearing first.
 * @returns {SavedSummary[]} An array of saved summary objects.
 */
export function getSavedSummaries(): SavedSummary[] {
    if (typeof window === 'undefined') return [];
    const summaries = localStorage.getItem(SAVED_SUMMARIES_KEY);
    const parsedSummaries = summaries ? JSON.parse(summaries) : [];
    // Sort by most recent first to display new summaries at the top.
    return parsedSummaries.sort((a: SavedSummary, b: SavedSummary) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Saves a new summary to localStorage.
 * It adds the new summary to the beginning of the existing list.
 * @param {SavedSummary} summaryData The summary data object to save.
 */
export function saveSummary(summaryData: SavedSummary): void {
    if (typeof window === 'undefined') return;
    const summaries = getSavedSummaries();
    summaries.unshift(summaryData);
    localStorage.setItem(SAVED_SUMMARIES_KEY, JSON.stringify(summaries));
}

/**
 * Deletes a summary from localStorage by its unique ID.
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
