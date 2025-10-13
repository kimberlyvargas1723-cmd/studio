// src/app/actions.ts
'use server';

import { summarizeContent, type ContentSummarizationInput } from '@/ai/flows/content-summarization';
import { generatePracticeQuestions } from '@/ai/flows/practice-question-generation';
import { extractTextFromImage } from '@/ai/flows/image-text-extraction';
import { generateStudyPlan } from '@/ai/flows/generate-study-plan';
import { generateProgressSummary } from '@/ai/flows/generate-progress-summary';
import { generateLearningStrategy } from '@/ai/flows/generate-learning-strategy';
import type { StudyResource, GeneratedQuestion, PerformanceData } from '@/lib/types';
import type { StudyPlanInput, StudyPlanOutput } from '@/ai/flows/generate-study-plan';
import fs from 'fs/promises';
import path from 'path';

/**
 * Server Action para disparar la sumarización de contenido por IA.
 * @param {ContentSummarizationInput} input - El contenido a resumir y, opcionalmente, el estilo de aprendizaje.
 * @returns {Promise<{summary?: string; error?: string}>} El resumen o un objeto de error.
 */
export async function summarizeContentAction(input: ContentSummarizationInput) {
  try {
    const result = await summarizeContent(input);
    return { summary: result.summary };
  } catch (e: any) {
    console.error('Error in summarizeContentAction:', e);
    return { error: e.message || 'No se pudo generar el resumen. Por favor, intenta de nuevo.' };
  }
}

/**
 * Server Action para disparar la generación de preguntas de práctica.
 * Lee el contenido del recurso de estudio desde el sistema de archivos local.
 * @param {StudyResource} resource - El recurso de estudio del cual generar preguntas.
 * @returns {Promise<{questions?: GeneratedQuestion[]; error?: string}>} Las preguntas generadas o un objeto de error.
 */
export async function generatePracticeQuestionsAction(resource: StudyResource) {
  try {
    // Construye la ruta correcta al archivo markdown en el directorio src/lib/lecturas
    const filePath = path.join(process.cwd(), 'src/lib/lecturas', resource.source);
    const resourceContent = await fs.readFile(filePath, 'utf-8');
    
    const result = await generatePracticeQuestions({
      summarizedContent: resourceContent,
      topic: resource.title,
    });

    return { questions: result.questions };
  } catch (e: any) {
    console.error('Error in generatePracticeQuestionsAction:', e);
    return { error: e.message || 'No se pudo generar el quiz. Por favor, intenta de nuevo.' };
  }
}

/**
 * Server Action para extraer texto de una imagen.
 * @param {string} imageUrl - La URL de datos de la imagen a procesar.
 * @returns {Promise<{textContent?: string; error?: string}>} El texto extraído o un objeto de error.
 */
export async function extractTextFromImageAction(imageUrl: string) {
  try {
    const result = await extractTextFromImage({ imageUrl });
    return { textContent: result.textContent };
  } catch (e: any) {
    console.error('Error in extractTextFromImageAction:', e);
    return { error: e.message || 'No se pudo extraer texto de la imagen. Asegúrate de que la imagen sea clara.' };
  }
}


/**
 * Server Action para disparar la generación del plan de estudio por IA.
 * @param {StudyPlanInput} input - Los datos de rendimiento del estudiante y los días hasta el examen.
 * @returns {Promise<{plan?: StudyPlanOutput; error?: string}>} El plan generado o un objeto de error.
 */
export async function generateStudyPlanAction(input: StudyPlanInput): Promise<{ plan?: StudyPlanOutput; error?: string }> {
  try {
    const result = await generateStudyPlan(input);
    return { plan: result };
  } catch (e: any) {
    console.error('Error in generateStudyPlanAction:', e);
    return { error: e.message || 'No se pudo generar el plan de estudio. Intenta de nuevo más tarde.' };
  }
}

/**
 * Server Action para generar un resumen inteligente del progreso del usuario.
 * @param {PerformanceData[]} performanceData - Los datos de rendimiento del usuario.
 * @returns {Promise<{summary?: string; suggestion?: string; error?: string}>} El resumen y la sugerencia generados, o un objeto de error.
 */
export async function generateProgressSummaryAction(performanceData: PerformanceData[]) {
  try {
    const result = await generateProgressSummary({ performanceData });
    return { summary: result.summary, suggestion: result.suggestion };
  } catch (e: any) {
    console.error('Error in generateProgressSummaryAction:', e);
    return { error: e.message || 'No se pudo generar el resumen de progreso.' };
  }
}

/**
 * Server Action para generar una estrategia de aprendizaje personalizada basada en un estilo de aprendizaje.
 * @param {string} learningStyle - El estilo de aprendizaje dominante del usuario (V, A, R, o K).
 * @returns {Promise<{style?: string; strategy?: string; error?: string}>} El estilo y la estrategia generada, o un objeto de error.
 */
export async function generateLearningStrategyAction(learningStyle: string) {
  try {
    const result = await generateLearningStrategy({ learningStyle });
    return { style: result.style, strategy: result.strategy };
  } catch (e: any) {
    console.error('Error in generateLearningStrategyAction:', e);
    return { error: e.message || 'No se pudo generar la estrategia de aprendizaje.' };
  }
}
