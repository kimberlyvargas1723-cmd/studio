'use server';

/**
 * @fileOverview This flow generates practice questions based on summarized content.
 *
 * - generatePracticeQuestions - A function that generates practice questions.
 * - PracticeQuestionGenerationInput - The input type for the generatePracticeQuestions function.
 * - PracticeQuestionGenerationOutput - The return type for the generatePracticeQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PracticeQuestionGenerationInputSchema = z.object({
  summarizedContent: z
    .string()
    .describe('The summarized content from the UANL resources.'),
  topic: z.string().describe('The topic of the summarized content.'),
});
export type PracticeQuestionGenerationInput = z.infer<
  typeof PracticeQuestionGenerationInputSchema
>;

const GeneratedQuestionSchema = z.object({
    question: z.string().describe('The generated practice question.'),
    options: z.array(z.string()).describe('An array of 4 multiple-choice options.'),
    correctAnswer: z.string().describe('The correct answer from the options.'),
    explanation: z.string().describe('A brief explanation for why the answer is correct.'),
    topic: z.string().describe('The specific topic of the question (e.g., "Psicología del Desarrollo").'),
});

const PracticeQuestionGenerationOutputSchema = z.object({
  questions: z
    .array(GeneratedQuestionSchema)
    .describe('An array of 5 generated practice questions based on the summarized content.'),
});
export type PracticeQuestionGenerationOutput = z.infer<
  typeof PracticeQuestionGenerationOutputSchema
>;

/**
 * Generates a set of multiple-choice practice questions based on provided content.
 * @param {PracticeQuestionGenerationInput} input - The content and topic for question generation.
 * @returns {Promise<PracticeQuestionGenerationOutput>} A promise that resolves to an array of generated questions.
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

  Based on the following summarized content about "{{topic}}", generate a list of 5 multiple-choice practice questions. Each question must have 4 plausible options. The questions should help students test their knowledge and identify areas where they need more study. Make sure the questions are relevant to the content and are of appropriate difficulty for a university entrance exam.

  For each question, provide the question text, 4 options, the correct answer, a brief explanation, and ensure the 'topic' field is correctly set to "{{topic}}".

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
