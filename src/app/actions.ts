// src/app/actions.ts
'use server';

import { summarizeContent } from '@/ai/flows/content-summarization';
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
 * Server Action to trigger AI content summarization.
 * @param {string} content - The markdown content to summarize.
 * @returns {Promise<{summary: string} | {error: string}>} - The summary or an error.
 */
export async function summarizeContentAction(content: string) {
  try {
    const result = await summarizeContent({ 
      url: `data:text/markdown;charset=utf-8,${encodeURIComponent(content)}` 
    });
    return { summary: result.summary };
  } catch (e) {
    console.error('Error in summarizeContentAction:', e);
    return { error: 'No se pudo generar el resumen del contenido.' };
  }
}

/**
 * Server Action to trigger practice question generation.
 * It reads the content of the study resource from the local filesystem.
 * @param {StudyResource} resource - The study resource to generate questions from.
 * @returns {Promise<{questions: GeneratedQuestion[]} | {error: string}>} - The generated questions or an error.
 */
export async function generatePracticeQuestionsAction(resource: StudyResource) {
  try {
    // Build the correct path to the markdown file in the public directory
    const filePath = path.join(process.cwd(), 'public', resource.source);
    const resourceContent = await fs.readFile(filePath, 'utf-8');
    
    const result = await generatePracticeQuestions({
      summarizedContent: resourceContent,
      topic: resource.title,
    });

    return { questions: result.questions };
  } catch (e) {
    console.error('Error in generatePracticeQuestionsAction:', e);
    return { error: 'No se pudo generar el quiz. Intenta de nuevo.' };
  }
}

/**
 * Server Action to extract text from an image.
 * @param {string} imageUrl - The data URL of the image to process.
 * @returns {Promise<{textContent: string} | {error: string}>} - The extracted text or an error.
 */
export async function extractTextFromImageAction(imageUrl: string) {
  try {
    const result = await extractTextFromImage({ imageUrl });
    return { textContent: result.textContent };
  } catch (e) {
    console.error('Error in extractTextFromImageAction:', e);
    return { error: 'No se pudo extraer texto de la imagen.' };
  }
}


/**
 * Server Action to trigger AI study plan generation.
 * @param {StudyPlanInput} input - The student's performance data and days until the exam.
 * @returns {Promise<{plan: StudyPlanOutput} | {error: string}>} - The generated plan or an error.
 */
export async function generateStudyPlanAction(input: StudyPlanInput): Promise<{ plan?: StudyPlanOutput; error?: string }> {
  try {
    const result = await generateStudyPlan(input);
    return { plan: result };
  } catch (e: any) {
    console.error('Error in generateStudyPlanAction:', e);
    return { error: e.message || 'No se pudo generar el plan de estudio.' };
  }
}

/**
 * Server Action to generate an intelligent summary of the user's progress.
 * @param {PerformanceData[]} performanceData - The user's performance data.
 * @returns {Promise<{summary: string; suggestion: string} | {error: string}>} - The generated summary and suggestion, or an error.
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
 * Server Action to generate a personalized learning strategy based on a learning style.
 * @param {string} learningStyle - The user's dominant learning style (V, A, R, or K).
 * @returns {Promise<{style: string; strategy: string} | {error: string}>} - The style and generated strategy, or an error.
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
