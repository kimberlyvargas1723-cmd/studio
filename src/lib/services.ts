// src/lib/services.ts
import { initialPerformance } from './data';
import type { PerformanceData, Feedback, SavedSummary, LearningStrategy } from './types';

/**
 * This file provides a service layer for interacting with the browser's localStorage.
 * It abstracts the direct use of `localStorage`, handles JSON parsing and stringification,
 * and provides a clear API for managing performance data, feedback history, 
 * saved summaries, and checklist state.
 */

// --- Performance Data ---

const PERFORMANCE_DATA_KEY = 'performanceData';

/**
 * Retrieves performance data from localStorage.
 * If no data exists, it initializes and returns the default performance structure.
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
 * @returns {Feedback[]} An array of feedback objects, sorted from most to least recent.
 */
export function getFeedbackHistory(): Feedback[] {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem(FEEDBACK_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

/**
 * Saves new feedback to the feedback history in localStorage.
 * It keeps a maximum of 20 most recent feedback items.
 * @param {Feedback} feedbackData The new feedback data object to save.
 */
export function saveFeedback(feedbackData: Feedback): void {
  if (typeof window === 'undefined') return;
  const history = getFeedbackHistory();
  history.unshift(feedbackData);
  localStorage.setItem(FEEDBACK_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}

// --- Saved Summaries ---

const SAVED_SUMMARIES_KEY = 'savedSummaries';

/**
 * Retrieves all saved summaries from localStorage, sorted by creation date.
 * @returns {SavedSummary[]} An array of saved summary objects.
 */
export function getSavedSummaries(): SavedSummary[] {
    if (typeof window === 'undefined') return [];
    const summaries = localStorage.getItem(SAVED_SUMMARIES_KEY);
    const parsedSummaries = summaries ? JSON.parse(summaries) : [];
    return parsedSummaries.sort((a: SavedSummary, b: SavedSummary) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Saves a new summary to localStorage.
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
export function deleteSummaryFromStorage(summaryId: string): SavedSummary[] {
    if (typeof window === 'undefined') return [];
    let summaries = getSavedSummaries();
    summaries = summaries.filter(s => s.id !== summaryId);
    localStorage.setItem(SAVED_SUMMARIES_KEY, JSON.stringify(summaries));
    return summaries;
}


// --- Admission Checklist ---

const CHECKLIST_STATE_KEY = 'admissionChecklistState';

/**
 * Retrieves the state of the admission checklist from localStorage.
 * @returns {Record<string, boolean>} A map of task IDs to their completion status.
 */
export function getChecklistState(): Record<string, boolean> {
    if (typeof window === 'undefined') return {};
    const state = localStorage.getItem(CHECKLIST_STATE_KEY);
    return state ? JSON.parse(state) : {};
}

/**
 * Updates the state of a single task in the admission checklist in localStorage.
 * @param {string} taskId The ID of the task to update.
 * @param {boolean} isChecked The new completion status of the task.
 */
export function updateChecklistState(taskId: string, isChecked: boolean): void {
    if (typeof window === 'undefined') return;
    const state = getChecklistState();
    state[taskId] = isChecked;
    localStorage.setItem(CHECKLIST_STATE_KEY, JSON.stringify(state));
}


// --- Learning Strategy ---

const LEARNING_STRATEGY_KEY = 'learningStrategy';

/**
 * Retrieves the saved learning strategy from localStorage.
 * @returns {LearningStrategy | null} The saved strategy object or null if not found.
 */
export function getLearningStrategy(): LearningStrategy | null {
    if (typeof window === 'undefined') return null;
    const strategy = localStorage.getItem(LEARNING_STRATEGY_KEY);
    return strategy ? JSON.parse(strategy) : null;
}

/**
 * Saves the generated learning strategy to localStorage.
 * @param {LearningStrategy} strategyData The strategy object to save.
 */
export function saveLearningStrategy(strategyData: LearningStrategy): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LEARNING_STRATEGY_KEY, JSON.stringify(strategyData));
}
