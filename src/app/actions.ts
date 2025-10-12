'use server';

import { summarizeContent } from '@/ai/flows/content-summarization';
import { generatePracticeQuestions } from '@/ai/flows/practice-question-generation';
import { extractTextFromImage } from '@/ai/flows/image-text-extraction';
import type { StudyResource, GeneratedQuestion } from '@/lib/types';
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
    const filePath = path.join(process.cwd(), 'public', 'estudio', resource.source);
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
    return