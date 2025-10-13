// src/lib/services.ts
import { initialPerformance } from './data';
import type { PerformanceData, Feedback, SavedSummary, LearningStrategy } from './types';

/**
 * @fileoverview
 * Este archivo proporciona una capa de servicio para interactuar con el `localStorage` del navegador.
 * Abstrae el uso directo de `localStorage`, maneja la serialización/deserialización de JSON
 * y proporciona una API clara para gestionar los datos de rendimiento, el historial de feedback,
 * los resúmenes guardados, el checklist de admisión y la estrategia de aprendizaje del usuario.
 *
 * Cada función incluye una verificación (`typeof window !== 'undefined'`) para garantizar
 * que solo se ejecute en el lado del cliente, evitando errores durante el renderizado del lado del servidor (SSR) en Next.js.
 */


// --- Performance Data ---

const PERFORMANCE_DATA_KEY = 'performanceData';

/**
 * Recupera los datos de rendimiento del `localStorage`.
 * Si no existen datos, inicializa y devuelve la estructura de rendimiento por defecto.
 * @returns {PerformanceData[]} Un array de objetos con los datos de rendimiento para cada tema.
 */
export function getPerformanceData(): PerformanceData[] {
  if (typeof window === 'undefined') return initialPerformance;
  try {
    const data = localStorage.getItem(PERFORMANCE_DATA_KEY);
    return data ? JSON.parse(data) : initialPerformance;
  } catch (error) {
    console.error("Error parsing performance data from localStorage:", error);
    return initialPerformance;
  }
}

/**
 * Actualiza los datos de rendimiento para un tema específico en `localStorage` después de una pregunta del quiz.
 * Incrementa el contador de 'correctas' o 'incorrectas' para el tema dado.
 * @param {string} topic - El tema que se va a actualizar.
 * @param {boolean} wasCorrect - Si la respuesta del usuario fue correcta.
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
 * Recupera el historial de feedback generado por la IA desde `localStorage`.
 * @returns {Feedback[]} Un array de objetos de feedback, ordenados del más reciente al más antiguo.
 */
export function getFeedbackHistory(): Feedback[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = localStorage.getItem(FEEDBACK_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error parsing feedback history from localStorage:", error);
    return [];
  }
}

/**
 * Guarda un nuevo feedback en el historial de `localStorage`.
 * Mantiene un máximo de 20 elementos de feedback, descartando los más antiguos.
 * @param {Feedback} feedbackData - El nuevo objeto de datos de feedback para guardar.
 */
export function saveFeedback(feedbackData: Feedback): void {
  if (typeof window === 'undefined') return;
  const history = getFeedbackHistory();
  // Añade el nuevo feedback al principio del array.
  history.unshift(feedbackData);
  // Limita el historial a los últimos 20 elementos para evitar que crezca indefinidamente.
  localStorage.setItem(FEEDBACK_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}

// --- Saved Summaries ---

const SAVED_SUMMARIES_KEY = 'savedSummaries';

/**
 * Recupera todos los resúmenes guardados desde `localStorage`, ordenados por fecha de creación descendente.
 * @returns {SavedSummary[]} Un array de objetos de resúmenes guardados.
 */
export function getSavedSummaries(): SavedSummary[] {
    if (typeof window === 'undefined') return [];
    try {
        const summaries = localStorage.getItem(SAVED_SUMMARIES_KEY);
        const parsedSummaries: SavedSummary[] = summaries ? JSON.parse(summaries) : [];
        // Ordena los resúmenes para mostrar los más recientes primero.
        return parsedSummaries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
        console.error("Error parsing saved summaries from localStorage:", error);
        return [];
    }
}

/**
 * Guarda un nuevo resumen en `localStorage`.
 * @param {SavedSummary} summaryData - El objeto de datos del resumen para guardar.
 */
export function saveSummary(summaryData: SavedSummary): void {
    if (typeof window === 'undefined') return;
    const summaries = getSavedSummaries();
    summaries.unshift(summaryData); // Añade al principio para mantener el orden descendente.
    localStorage.setItem(SAVED_SUMMARIES_KEY, JSON.stringify(summaries));
}

/**
 * Elimina un resumen de `localStorage` por su ID único.
 * @param {string} summaryId - El ID del resumen a eliminar.
 * @returns {SavedSummary[]} El array actualizado de resúmenes después de la eliminación.
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
 * Recupera el estado del checklist de admisión desde `localStorage`.
 * @returns {Record<string, boolean>} Un mapa de IDs de tareas a su estado de completado (true/false).
 */
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

/**
 * Actualiza el estado de una tarea única en el checklist de admisión en `localStorage`.
 * @param {string} taskId - El ID de la tarea a actualizar.
 * @param {boolean} isChecked - El nuevo estado de completado de la tarea.
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
 * Recupera la estrategia de aprendizaje guardada desde `localStorage`.
 * @returns {LearningStrategy | null} El objeto de estrategia guardado o null si no se encuentra.
 */
export function getLearningStrategy(): LearningStrategy | null {
    if (typeof window === 'undefined') return null;
    try {
        const strategy = localStorage.getItem(LEARNING_STRATEGY_KEY);
        return strategy ? JSON.parse(strategy) : null;
    } catch (error) {
        console.error("Error parsing learning strategy from localStorage:", error);
        return null;
    }
}

/**
 * Guarda la estrategia de aprendizaje generada en `localStorage`.
 * @param {LearningStrategy} strategyData - El objeto de estrategia para guardar.
 */
export function saveLearningStrategy(strategyData: LearningStrategy): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LEARNING_STRATEGY_KEY, JSON.stringify(strategyData));
}
