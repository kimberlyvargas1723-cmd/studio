'use server';

/**
 * @fileOverview This flow generates practice questions based on the summarized content from the UANL resources.
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
});
export type PracticeQuestionGenerationInput = z.infer<
  typeof PracticeQuestionGenerationInputSchema
>;

const PracticeQuestionGenerationOutputSchema = z.object({
  questions: z
    .array(z.string())
    .describe('The generated practice questions based on the summarized content.'),
});
export type PracticeQuestionGenerationOutput = z.infer<
  typeof PracticeQuestionGenerationOutputSchema
>;

export async function generatePracticeQuestions(
  input: PracticeQuestionGenerationInput
): Promise<PracticeQuestionGenerationOutput> {
  return generatePracticeQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'practiceQuestionGenerationPrompt',
  input: {schema: PracticeQuestionGenerationInputSchema},
  output: {schema: PracticeQuestionGenerationOutputSchema},
  prompt: `You are an expert educator specializing in creating practice questions for university entrance exams.

  Based on the following summarized content from UANL resources, generate a list of practice questions that will help students test their knowledge and identify areas where they need more study. Make sure the questions are relevant to the content and are of appropriate difficulty for the exam.

  Summarized Content:
  {{summarizedContent}}

  Practice Questions:
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
