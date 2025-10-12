// src/ai/flows/study-assistant.ts
'use server';

/**
 * @fileOverview An AI study assistant that provides guidance and recommendations.
 *
 * - studyAssistant - A function that acts as a study assistant.
 * - StudyAssistantInput - The input type for the studyAssistant function.
 * - StudyAssistantOutput - The return type for the studyAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { studyResources } from '@/lib/data';

const StudyAssistantInputSchema = z.object({
  query: z.string().describe('The student\'s question or request for guidance.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
});
export type StudyAssistantInput = z.infer<typeof StudyAssistantInputSchema>;

const StudyAssistantOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the student.'),
  youtubeSearchQuery: z.string().optional().describe('A suggested YouTube search query for video resources.'),
});
export type StudyAssistantOutput = z.infer<typeof StudyAssistantOutputSchema>;

/**
 * Provides AI-powered study assistance, including answering questions and recommending resources.
 * @param {StudyAssistantInput} input - The user's query and conversation history.
 * @returns {Promise<StudyAssistantOutput>} A promise that resolves to the AI's response and an optional YouTube search query.
 */
export async function studyAssistant(input: StudyAssistantInput): Promise<StudyAssistantOutput> {
  // To handle the conditional logic in the prompt, we'll augment the history data.
  const historyForPrompt = input.history?.map(message => ({
    ...message,
    isUser: message.role === 'user',
  }));
  
  return studyAssistantFlow({ ...input, history: historyForPrompt });
}

const studyAssistantPrompt = ai.definePrompt({
  name: 'studyAssistantPrompt',
  input: {schema: z.any()}, // Use z.any() because we augmented the history object.
  output: {schema: StudyAssistantOutputSchema},
  prompt: `You are an expert, friendly, and encouraging AI study assistant for Kimberly, a student preparing for her UANL Psychology entrance exam. Your name is 'Vairyx'.

You have access to the following list of study materials available within the app:
${studyResources.map(r => `- ${r.title} (${r.category})`).join('\n')}

Your tasks are:
1.  Answer Kimberly's questions about study topics, exam strategies, or any other related query.
2.  Proactively recommend which study materials from the list she should focus on based on her questions.
3.  If relevant, suggest a concise and effective search query for her to use on YouTube to find supplementary video content. For example, if she asks about "classical conditioning", suggest "experimento pavlov condicionamiento clasico".
4.  Keep your answers concise, actionable, and always maintain a positive and motivating tone. Address her by name occasionally.
5.  All responses must be in Spanish.

Conversation History:
{{#if history}}
{{#each history}}
{{#if this.isUser}}
Kimberly: {{{this.content}}}
{{else}}
Vairyx: {{{this.content}}}
{{/if}}
{{/each}}
{{/if}}

Kimberly's new query: "{{query}}"

Provide your response and a YouTube search query if applicable.`,
});

const studyAssistantFlow = ai.defineFlow(
  {
    name: 'studyAssistantFlow',
    inputSchema: z.any(),
    outputSchema: StudyAssistantOutputSchema,
  },
  async input => {
    const {output} = await studyAssistantPrompt(input);
    return output!;
  }
);
