'use server';
/**
 * @fileOverview A flow for generating an intelligent summary of a student's progress.
 *
 * This file defines an AI flow that analyzes a student's performance data
 * (correct vs. incorrect answers per topic) and generates a brief, encouraging
 * summary along with a single, actionable suggestion for their next study session.
 *
 * - generateProgressSummary - The main function to trigger the summary generation.
 * - ProgressSummaryInput - The Zod schema for the input.
 * - ProgressSummaryOutput - The Zod schema for the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the schema for a single performance data point.
 */
const PerformanceDataSchema = z.object({
  topic: z.string().describe('The name of the study topic.'),
  correct: z.number().describe('The count of correct answers for this topic.'),
  incorrect: z.number().describe('The count of incorrect answers for this topic.'),
});

/**
 * Defines the schema for the input of the progress summary generation flow.
 */
const ProgressSummaryInputSchema = z.object({
  performanceData: z
    .array(PerformanceDataSchema)
    .describe('An array of objects representing the student\'s performance in each topic.'),
});
export type ProgressSummaryInput = z.infer<typeof ProgressSummaryInputSchema>;

/**
 * Defines the schema for the output of the progress summary generation flow.
 */
const ProgressSummaryOutputSchema = z.object({
  summary: z.string().describe('A brief, encouraging summary of the student\'s performance, highlighting one strength and one area for improvement.'),
  suggestion: z.string().describe('A single, actionable suggestion for the student to focus on next.'),
});
export type ProgressSummaryOutput = z.infer<typeof ProgressSummaryOutputSchema>;

/**
 * Generates a personalized progress summary and suggestion based on student performance data.
 * @param {ProgressSummaryInput} input - An object containing the student's performance data.
 * @returns {Promise<ProgressSummaryOutput>} A promise that resolves to the generated summary and suggestion.
 */
export async function generateProgressSummary(input: ProgressSummaryInput): Promise<ProgressSummaryOutput> {
  return generateProgressSummaryFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateProgressSummaryPrompt',
  input: {schema: ProgressSummaryInputSchema},
  output: {schema: ProgressSummaryOutputSchema},
  prompt: `You are an expert academic advisor AI named Vairyx. You are analyzing the performance data for a student named Kimberly.

Your task is to provide a brief, insightful, and encouraging summary of her progress.

Here are the rules:
1.  **Analyze Performance:** Look at all topics with performance data (correct > 0 or incorrect > 0). Ignore topics with no activity.
2.  **Identify Strength:** Find the topic where her accuracy (correct / (correct + incorrect)) is highest. Mention this as a strength. If there are ties, pick one.
3.  **Identify Weakness:** Find the topic where her accuracy is lowest. Frame this positively as an "área de oportunidad" or "punto a reforzar".
4.  **Generate Summary:** Create a concise summary (2-3 sentences) in Spanish that mentions her strongest topic and the main topic to improve. Be encouraging and address her as Kimberly.
5.  **Generate Suggestion:** Provide one clear, actionable suggestion. This should be a direct recommendation, like "Mi sugerencia para hoy es enfocarnos en un quiz de 'Bases Biológicas' para fortalecer ese tema."
6.  **Language:** All output must be in Spanish.

Student Performance Data:
{{#each performanceData}}
- Topic: {{topic}}, Correct: {{correct}}, Incorrect: {{incorrect}}
{{/each}}

Generate the summary and suggestion now.`,
});

const generateProgressSummaryFlow = ai.defineFlow(
  {
    name: 'generateProgressSummaryFlow',
    inputSchema: ProgressSummaryInputSchema,
    outputSchema: ProgressSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
