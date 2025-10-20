// src/ai/flows/practice-question-generation.ts
'use server';
/**
 * @fileOverview This flow generates multiple-choice practice questions based on summarized content.
 *
 * This file defines an AI flow that takes a piece of text and a topic,
 * and generates a set of 5 multiple-choice questions designed to test a student's
 * knowledge on that topic, formatted in the style of the EXANI-II exam.
 *
 * - `generatePracticeQuestions`: The main function to trigger question generation.
 */

import { ai } from '@/ai/genkit';
import {
  PracticeQuestionGenerationInputSchema,
  type PracticeQuestionGenerationInput,
  PracticeQuestionGenerationOutputSchema,
  type PracticeQuestionGenerationOutput
} from '@/ai/schemas';

/**
 * Generates a set of multiple-choice practice questions based on the provided content.
 * @param {PracticeQuestionGenerationInput} input - An object containing the content and topic for question generation.
 * @returns {Promise<PracticeQuestionGenerationOutput>} A promise that resolves with an array of 5 generated questions.
 */
export async function generatePracticeQuestions(
  input: PracticeQuestionGenerationInput
): Promise<PracticeQuestionGenerationOutput> {
  return generatePracticeQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'practiceQuestionGenerationPrompt',
  input: { schema: PracticeQuestionGenerationInputSchema },
  output: { schema: PracticeQuestionGenerationOutputSchema },
  prompt: `You are an expert educator specializing in creating practice questions for the UANL Psychology entrance exam (EXANI-II).

  Based on the following summarized content about "{{topic}}", generate a list of 5 multiple-choice practice questions.
  
  RULES:
  - Each question must have exactly 4 plausible options.
  - The questions should help students test their knowledge and identify areas where they need more study.
  - The questions must be relevant to the provided content and of appropriate difficulty for a university entrance exam.
  - For each question, provide the question text, 4 options, the correct answer, a brief explanation, and ensure the 'topic' field is correctly set to "{{topic}}".

  Summarized Content:
  "{{summarizedContent}}"
  `,
});

const generatePracticeQuestionsFlow = ai.defineFlow(
  {
    name: 'generatePracticeQuestionsFlow',
    inputSchema: PracticeQuestionGenerationInputSchema,
    outputSchema: PracticeQuestionGenerationOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
