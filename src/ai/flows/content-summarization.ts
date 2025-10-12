// src/ai/flows/content-summarization.ts
'use server';

/**
 * @fileOverview A content summarization AI agent.
 *
 * - summarizeContent - A function that handles the content summarization process.
 * - ContentSummarizationInput - The input type for the summarizeContent function.
 * - ContentSummarizationOutput - The return type for the summarizeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentSummarizationInputSchema = z.object({
  url: z.string().describe('The URL or data URI of the content to summarize.'),
});
export type ContentSummarizationInput = z.infer<typeof ContentSummarizationInputSchema>;

const ContentSummarizationOutputSchema = z.object({
  summary: z.string().describe('The summary of the content.'),
});
export type ContentSummarizationOutput = z.infer<typeof ContentSummarizationOutputSchema>;

/**
 * Summarizes the provided content using an AI model.
 * This flow takes a URL or a data URI and returns a concise summary.
 * @param {ContentSummarizationInput} input - The content to be summarized.
 * @returns {Promise<ContentSummarizationOutput>} A promise that resolves to the summary of the content.
 */
export async function summarizeContent(input: ContentSummarizationInput): Promise<ContentSummarizationOutput> {
  return summarizeContentFlow(input);
}

const summarizeContentPrompt = ai.definePrompt({
  name: 'summarizeContentPrompt',
  input: {schema: ContentSummarizationInputSchema},
  output: {schema: ContentSummarizationOutputSchema},
  prompt: `You are an expert summarizer for a student preparing for their psychology entrance exam. 
  Summarize the content provided from the following source: {{{url}}}. 
  Focus on the key points, definitions, and concepts relevant for efficient studying. 
  Return a concise and accurate summary written in Spanish.`,
});

const summarizeContentFlow = ai.defineFlow(
  {
    name: 'summarizeContentFlow',
    inputSchema: ContentSummarizationInputSchema,
    outputSchema: ContentSummarizationOutputSchema,
  },
  async input => {
    const {output} = await summarizeContentPrompt(input);
    return output!;
  }
);
