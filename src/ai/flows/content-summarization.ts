// src/ai/flows/content-summarization.ts
'use server';

/**
 * @fileOverview A content summarization AI agent.
 *
 * This file defines the AI flow for summarizing content. It takes a URL or a data URI
 * of content and a user's learning style, then returns a concise summary adapted
 * to that style.
 *
 * - summarizeContent - The main function that triggers the summarization flow.
 * - ContentSummarizationInput - The Zod schema for the input.
 * - ContentSummarizationOutput - The Zod schema for the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the schema for the input of the content summarization flow.
 */
const ContentSummarizationInputSchema = z.object({
  url: z.string().describe('The URL or data URI of the content to summarize.'),
  learningStyle: z.string().optional().describe('The dominant learning style of the user (V, A, R, or K).'),
});
export type ContentSummarizationInput = z.infer<typeof ContentSummarizationInputSchema>;

/**
 * Defines the schema for the output of the content summarization flow.
 */
const ContentSummarizationOutputSchema = z.object({
  summary: z.string().describe('The summary of the content, formatted in Markdown.'),
});
export type ContentSummarizationOutput = z.infer<typeof ContentSummarizationOutputSchema>;

/**
 * Summarizes the provided content using an AI model.
 * This flow takes a URL or a data URI and returns a concise summary
 * adapted to the user's specified learning style.
 * @param {ContentSummarizationInput} input - The content to be summarized and the user's learning style.
 * @returns {Promise<ContentSummarizationOutput>} A promise that resolves to the summary of the content.
 */
export async function summarizeContent(input: ContentSummarizationInput): Promise<ContentSummarizationOutput> {
  return summarizeContentFlow(input);
}

const summarizeContentPrompt = ai.definePrompt({
  name: 'summarizeContentPrompt',
  input: {schema: ContentSummarizationInputSchema},
  output: {schema: ContentSummarizationOutputSchema},
  prompt: `You are an expert summarizer for a student named Kimberly, who is preparing for her psychology entrance exam.
  The student's dominant learning style is {{learningStyle}}.

  Summarize the content provided from the following source: {{{url}}}.
  Focus on the key points, definitions, and concepts relevant for efficient studying.

  Adapt the format of the summary to the student's learning style:
  - If Visual (V): Use bullet points, **bold keywords**, and suggest where diagrams or flowcharts could clarify a concept (e.g., "[Sugerencia Visual: un mapa mental conectando A con B]").
  - If Auditory (A): Structure the summary like a short podcast script. Use clear, conversational language and questions to prompt reflection (e.g., "¿Recuerdas la diferencia entre...?").
  - If Reading/Writing (R): Create a dense, well-structured summary with clear headings, subheadings, and detailed definitions.
  - If Kinesthetic (K): Focus on real-world examples, applications, and suggest simple actions or experiments (e.g., "[Ejemplo Práctico: Intenta asociar este concepto con un movimiento]").
  - If no style is provided, use a standard, well-structured bulleted list.

  Return a concise and accurate summary written in Spanish. The summary must be 300 words or less and formatted in Markdown.`,
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
