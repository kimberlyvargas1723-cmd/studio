'use server';
/**
 * @fileOverview A flow for generating an intelligent summary of a student's progress.
 *
 * - generateProgressSummary - Generates a summary and a suggestion based on performance data.
 * - ProgressSummaryInput - The input type for the generateProgressSummary function.
 * - ProgressSummaryOutput - The return type for the generateProgressSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { PerformanceData } from '@/lib/types';


const PerformanceDataSchema = z.object({
  topic: z.string(),
  correct: z.number(),
  incorrect: z.number(),
});

const ProgressSummaryInputSchema = z.object({
  performanceData: z
    .array(PerformanceDataSchema)
    .describe('An array of objects representing the student\'s performance in each topic.'),
});
export type ProgressSummaryInput = z.infer<typeof ProgressSummaryInputSchema>;

const ProgressSummaryOutputSchema = z.object({
  summary: z.string().describe('A brief, encouraging summary of the student\'s performance, highlighting one strength and one area for improvement.'),
  suggestion: z.string().describe('A single, actionable suggestion for the student to focus on next.'),
});
export type ProgressSummaryOutput = z.infer<typeof ProgressSummaryOutputSchema>;

/**
 * Generates a personalized progress summary and suggestion based on student performance data.
 * @param {ProgressSummaryInput} input - The student's performance data.
 * @returns {Promise<ProgressSummaryOutput>} A promise that resolves to the generated summary and suggestion.
 */
export async function generateProgressSummary(input: ProgressSummaryInput): Promise<ProgressSummaryOutput> {
  return generateProgressSummaryFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateProgressSummaryPrompt',
  input: {schema: ProgressSummaryInputSchema},
  output: {schema: ProgressSummaryOutputSchema},
  prompt: `You are an expert academic advisor AI named Vairyx. You are analyzing the performance data for Kimberly.

Your task is to provide a brief, insightful, and encouraging summary of her progress.

Here are the rules:
1.  **Analyze Performance:** Look at all topics with performance data (correct > 0 or incorrect > 0).
2.  **Identify Strength:** Find a topic where her accuracy (correct / (correct + incorrect)) is highest. Mention this as a strength.
3.  **Identify Weakness:** Find a topic where her accuracy is lowest. Frame this positively as an "área de oportunidad" or "punto a reforzar".
4.  **Generate Summary:** Create a concise summary (2-3 sentences) in Spanish that mentions her strongest topic and the main topic to improve. Be encouraging.
5.  **Generate Suggestion:** Provide one clear, actionable suggestion. This should be a direct recommendation, like "Hoy podríamos enfocarnos en un quiz de 'Bases Biológicas' para fortalecer ese tema."
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
