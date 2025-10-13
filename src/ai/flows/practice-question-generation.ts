'use server';

/**
 * @fileOverview This flow generates multiple-choice practice questions based on summarized content.
 *
 * This file defines an AI flow that takes a piece of text content and a topic,
 * and generates a set of 5 multiple-choice questions designed to test a student's
 * knowledge on that topic, formatted for the EXANI-II exam style.
 *
 * - generatePracticeQuestions - The main function to trigger question generation.
 * - PracticeQuestionGenerationInput - The Zod schema for the input.
 * - PracticeQuestionGenerationOutput - The Zod schema for the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the schema for the input of the practice question generation flow.
 */
const PracticeQuestionGenerationInputSchema = z.object({
  summarizedContent: z
    .string()
    .describe('The summarized content from the study resources.'),
  topic: z.string().describe('The topic of the summarized content.'),
});
export type PracticeQuestionGenerationInput = z.infer<
  typeof PracticeQuestionGenerationInputSchema
>;

/**
 * Defines the schema for a single generated multiple-choice question.
 */
const GeneratedQuestionSchema = z.object({
    question: z.string().describe('The generated practice question.'),
    options: z.array(z.string()).length(4).describe('An array of 4 multiple-choice options.'),
    correctAnswer: z.string().describe('The correct answer from the options.'),
    explanation: z.string().describe('A brief explanation for why the answer is correct.'),
    topic: z.string().describe('The specific topic of the question (e.g., "Psicología del Desarrollo").'),
});

/**
 * Defines the schema for the output of the practice question generation flow.
 */
const PracticeQuestionGenerationOutputSchema = z.object({
  questions: z
    .array(GeneratedQuestionSchema)
    .length(5)
    .describe('An array of 5 generated practice questions based on the summarized content.'),
});
export type PracticeQuestionGenerationOutput = z.infer<
  typeof PracticeQuestionGenerationOutputSchema
>;

/**
 * Generates a set of multiple-choice practice questions based on provided content.
 * @param {PracticeQuestionGenerationInput} input - An object containing the content and topic for question generation.
 * @returns {Promise<PracticeQuestionGenerationOutput>} A promise that resolves to an array of 5 generated questions.
 */
export async function generatePracticeQuestions(
  input: PracticeQuestionGenerationInput
): Promise<PracticeQuestionGenerationOutput> {
  return generatePracticeQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'practiceQuestionGenerationPrompt',
  input: {schema: PracticeQuestionGenerationInputSchema},
  output: {schema: PracticeQuestionGenerationOutputSchema},
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
    const {output} = await prompt(input);
    return output!;
  }
);
