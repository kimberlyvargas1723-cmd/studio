// src/ai/flows/generate-progress-summary.ts
'use server';
/**
 * @fileOverview Flow to generate an intelligent summary of a student's progress.
 *
 * This file defines an AI flow that analyzes a student's performance data
 * (correct vs. incorrect answers by topic) and generates a brief, encouraging summary
 * along with a single actionable suggestion for their next study session.
 *
 * - `generateProgressSummary`: The main function to trigger the summary generation.
 */

import { ai } from '@/ai/genkit';
import {
  ProgressSummaryInputSchema,
  type ProgressSummaryInput,
  ProgressSummaryOutputSchema,
  type ProgressSummaryOutput
} from '@/ai/schemas';

/**
 * Generates a custom progress summary and suggestion based on student performance data.
 * @param {ProgressSummaryInput} input - An object containing the student's performance data.
 * @returns {Promise<ProgressSummaryOutput>} A promise that resolves with the generated summary and suggestion.
 */
export async function generateProgressSummary(input: ProgressSummaryInput): Promise<ProgressSummaryOutput> {
  return generateProgressSummaryFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateProgressSummaryPrompt',
  input: { schema: ProgressSummaryInputSchema },
  output: { schema: ProgressSummaryOutputSchema },
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
    const { output } = await prompt(input);
    return output!;
  }
);
