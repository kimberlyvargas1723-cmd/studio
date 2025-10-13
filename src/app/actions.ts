// src/app/actions.ts
'use server';
/**
 * @fileoverview This file contains Server Actions, which are asynchronous functions
 * that are executed on the server. They can be called directly from client components,
 * providing a secure way to perform server-side logic without needing to create custom API endpoints.
 */

import { summarizeContent } from '@/ai/flows/content-summarization';
import { generatePracticeQuestions } from '@/ai/flows/practice-question-generation';
import { extractTextFromImage } from '@/ai/flows/image-text-extraction';
import { generateStudyPlan } from '@/ai/flows/generate-study-plan';
import { generateProgressSummary } from '@/ai/flows/generate-progress-summary';
import { generateLearningStrategy } from '@/ai/flows/generate-learning-strategy';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { generateDashboardGreeting } from '@/ai/flows/generate-dashboard-greeting';
import { studyAssistant } from '@/ai/flows/study-assistant';
import { generateFlashcards } from '@/ai/flows/generate-flashcards';
import type {
  ContentSummarizationInput,
  StudyPlanInput,
  StudyPlanOutput,
  ProgressSummaryInput,
  ProgressSummaryOutput,
  PracticeQuestionGenerationOutput,
  TextToSpeechInput,
  TextToSpeechOutput,
  DashboardGreetingInput,
  DashboardGreetingOutput,
  StudyAssistantInput,
  StudyAssistantOutput,
  FlashcardGenerationInput,
  FlashcardGenerationOutput,
} from '@/ai/schemas';
import type { StudyResource } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

/**
 * Server Action to trigger AI content summarization.
 * @param {ContentSummarizationInput} input - The content to summarize and, optionally, the learning style.
 * @returns {Promise<{summary?: string; error?: string}>} The summary or an error object.
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
 * Server Action to trigger practice question generation.
 * Reads the study resource content from the local filesystem.
 * @param {StudyResource} resource - The study resource to generate questions from.
 * @returns {Promise<{questions?: PracticeQuestionGenerationOutput['questions']; error?: string}>} The generated questions or an error object.
 */
export async function generatePracticeQuestionsAction(resource: StudyResource) {
  try {
    const filePath = path.join(process.cwd(), 'public/lecturas', resource.source);
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
 * Server Action to extract text from an image.
 * @param {string} imageUrl - The data URL of the image to process.
 * @returns {Promise<{textContent?: string; error?: string}>} The extracted text or an error object.
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
 * Server Action to trigger AI study plan generation.
 * @param {Omit<StudyPlanInput, 'currentDate'>} input - The student's performance data and days until the exam.
 * @returns {Promise<{plan?: StudyPlanOutput; error?: string}>} The generated plan or an error object.
 */
export async function generateStudyPlanAction(input: Omit<StudyPlanInput, 'currentDate'>): Promise<{ plan?: StudyPlanOutput; error?: string }> {
  try {
    const result = await generateStudyPlan(input);
    return { plan: result };
  } catch (e: any) {
    console.error('Error in generateStudyPlanAction:', e);
    return { error: e.message || 'No se pudo generar el plan de estudio. Intenta de nuevo más tarde.' };
  }
}

/**
 * Server Action to generate an intelligent summary of the user's progress.
 * @param {ProgressSummaryInput} input - The user's performance data.
 * @returns {Promise<ProgressSummaryOutput | { error: string }>} The generated summary and suggestion, or an error object.
 */
export async function generateProgressSummaryAction(input: ProgressSummaryInput): Promise<ProgressSummaryOutput | { error: string }> {
  try {
    const result = await generateProgressSummary(input);
    return result;
  } catch (e: any) {
    console.error('Error in generateProgressSummaryAction:', e);
    return { error: e.message || 'No se pudo generar el resumen de progreso.' };
  }
}

/**
 * Server Action to generate a personalized learning strategy based on a learning style.
 * @param {string} learningStyle - The user's dominant learning style (V, A, R, or K).
 * @returns {Promise<{style?: string; strategy?: string; error?: string}>} The generated style and strategy, or an error object.
 */
export async function generateLearningStrategyAction(learningStyle: string) {
  try {
    const result = await generateLearningStrategy({ learningStyle });
    return { style: result.style, strategy: result.strategy };
  } catch (e: any)
    {
    console.error('Error in generateLearningStrategyAction:', e);
    return { error: e.message || 'No se pudo generar la estrategia de aprendizaje.' };
  }
}

/**
 * Server Action to convert text to speech.
 * @param {TextToSpeechInput} input - The text to convert.
 * @returns {Promise<TextToSpeechOutput | { error: string }>} The audio data URI or an error object.
 */
export async function textToSpeechAction(input: TextToSpeechInput): Promise<TextToSpeechOutput | { error: string }> {
  try {
    const result = await textToSpeech(input);
    return result;
  } catch (e: any) {
    console.error('Error in textToSpeechAction:', e);
    return { error: e.message || 'No se pudo generar el audio. Intenta de nuevo.' };
  }
}

/**
 * Server Action to generate a personalized greeting for the dashboard.
 * @param {DashboardGreetingInput} input - The user's learning style.
 * @returns {Promise<DashboardGreetingOutput | { error: string }>} The greeting and suggestion, or an error object.
 */
export async function generateDashboardGreetingAction(input: DashboardGreetingInput): Promise<DashboardGreetingOutput | { error: string }> {
    try {
        const result = await generateDashboardGreeting(input);
        return result;
    } catch (e: any) {
        console.error('Error in generateDashboardGreetingAction:', e);
        return { error: e.message || 'No se pudo generar el saludo.' };
    }
}


/**
 * Server Action to get a response from the study assistant AI.
 * @param {StudyAssistantInput} input - The user's query, history, and learning style.
 * @returns {Promise<StudyAssistantOutput | { error: string }>} The AI's response or an error object.
 */
export async function studyAssistantAction(input: StudyAssistantInput): Promise<StudyAssistantOutput | { error: string }> {
    try {
        const result = await studyAssistant(input);
        return result;
    } catch (e: any) {
        console.error('Error in studyAssistantAction:', e);
        return { error: e.message || 'Lo siento, no pude procesar tu solicitud en este momento.' };
    }
}

/**
 * Server Action to generate flashcards from a given text content.
 * @param {FlashcardGenerationInput} input - The content and topic for flashcard generation.
 * @returns {Promise<FlashcardGenerationOutput | { error: string }>} The generated flashcards or an error object.
 */
export async function generateFlashcardsAction(input: FlashcardGenerationInput): Promise<FlashcardGenerationOutput | { error: string }> {
  try {
    const result = await generateFlashcards(input);
    return result;
  } catch (e: any) {
    console.error('Error in generateFlashcardsAction:', e);
    return { error: e.message || 'No se pudieron generar las flashcards. Intenta de nuevo.' };
  }
}
