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
  url: z.string().url().describe('The URL of the content to summarize.'),
});
export type ContentSummarizationInput = z.infer<typeof ContentSummarizationInputSchema>;

const ContentSummarizationOutputSchema = z.object({
  summary: z.string().describe('The summary of the content.'),
});
export type ContentSummarizationOutput = z.infer<typeof ContentSummarizationOutputSchema>;

export async function summarizeContent(input: ContentSummarizationInput): Promise<ContentSummarizationOutput> {
  return summarizeContentFlow(input);
}

const summarizeContentPrompt = ai.definePrompt({
  name: 'summarizeContentPrompt',
  input: {schema: ContentSummarizationInputSchema},
  output: {schema: ContentSummarizationOutputSchema},
  prompt: `You are an expert summarizer.  Summarize the content of the following URL: {{{url}}}.  Focus on the key points and relevant information for efficient studying.  Return a concise and accurate summary.`,
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
