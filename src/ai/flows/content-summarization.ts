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
  learningStyle: z.string().optional().describe('The dominant learning style of the user (V, A, R, or K).'),
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
  The student's dominant learning style is {{learningStyle}}.

  Summarize the content provided from the following source: {{{url}}}.
  Focus on the key points, definitions, and concepts relevant for efficient studying.

  Adapt the format of the summary to the student's learning style:
  - If Visual (V): Use bullet points, bold keywords, and suggest where diagrams or flowcharts could clarify a concept (e.g., "[Sugerencia Visual: un mapa mental conectando A con B]").
  - If Auditory (A): Structure the summary like a short podcast script. Use clear, conversational language and questions to prompt reflection (e.g., "¿Recuerdas la diferencia entre...?").
  - If Reading/Writing (R): Create a dense, well-structured summary with clear headings, subheadings, and detailed definitions.
  - If Kinesthetic (K): Focus on real-world examples, applications, and suggest simple actions or experiments (e.g., "[Ejemplo Práctico: Intenta asociar este concepto con un movimiento]").
  - If no style is provided, use a standard bulleted list.

  Return a concise and accurate summary written in Spanish. The summary must be 300 words or less.`,
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
