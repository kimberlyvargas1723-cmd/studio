'use server';

/**
 * @fileOverview An AI study assistant that provides guidance and recommendations.
 *
 * This file defines a conversational AI flow that acts as a study assistant named 'Vairyx'.
 * It answers student questions, recommends study materials, and suggests relevant
 * YouTube videos, all while adapting its communication style to the user's learning preference.
 *
 * - studyAssistant - The main function that handles a turn in the conversation.
 * - StudyAssistantInput - The Zod schema for the input.
 * - StudyAssistantOutput - The Zod schema for the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { studyResources } from '@/lib/data';

/**
 * Defines the schema for the input of the study assistant flow.
 */
const StudyAssistantInputSchema = z.object({
  query: z.string().describe('The student\'s question or request for guidance.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The conversation history to provide context.'),
  learningStyle: z.string().optional().describe('The dominant learning style of the user (V, A, R, or K).'),
});
export type StudyAssistantInput = z.infer<typeof StudyAssistantInputSchema>;

/**
 * Defines the schema for the output of the study assistant flow.
 */
const StudyAssistantOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the student\'s query.'),
  youtubeSearchQuery: z.string().optional().describe('A concise, effective YouTube search query for supplementary video content.'),
});
export type StudyAssistantOutput = z.infer<typeof StudyAssistantOutputSchema>;

/**
 * Provides AI-powered study assistance, including answering questions and recommending resources.
 * This flow is conversational and adapts its responses to the user's learning style.
 * @param {StudyAssistantInput} input - An object containing the user's query, conversation history, and learning style.
 * @returns {Promise<StudyAssistantOutput>} A promise that resolves to the AI's response and an optional YouTube search query.
 */
export async function studyAssistant(input: StudyAssistantInput): Promise<StudyAssistantOutput> {
  return studyAssistantFlow(input);
}

const studyAssistantPrompt = ai.definePrompt({
  name: 'studyAssistantPrompt',
  input: {schema: StudyAssistantInputSchema },
  output: {schema: StudyAssistantOutputSchema},
  prompt: `You are an expert, friendly, and encouraging AI study assistant for Kimberly, a student preparing for her UANL Psychology entrance exam. Your name is 'Vairyx'.

You have access to the following list of study materials available within the app:
${studyResources.map(r => `- ${r.title} (${r.category})`).join('\n')}

**Crucially, Kimberly's dominant learning style is {{learningStyle}}**. You MUST adapt your explanations and suggestions to this style.
- If Visual (V): Use visual analogies (e.g., "Imagina que..."), describe diagrams, and strongly recommend finding infographics or videos.
- If Auditory (A): Explain things as if you were speaking. Use rhetorical questions and recommend podcasts or lectures.
- If Reading/Writing (R): Provide detailed, text-based explanations and suggest she take notes or rewrite concepts.
- If Kinesthetic (K): Use real-world, physical examples and suggest practical applications or experiments.

Your tasks are:
1.  Answer Kimberly's questions about psychology topics, exam strategies, or any other related query, **always tailoring the explanation to her learning style.**
2.  Proactively recommend which study materials from the list she should focus on based on her questions.
3.  If relevant, suggest a concise and effective search query for her to use on YouTube to find supplementary video content (especially important for Visual learners). For example, if she asks about "classical conditioning", suggest a query like "experimento pavlov condicionamiento clasico".
4.  Keep your answers concise, actionable, and always maintain a positive and motivating tone. Address her by name occasionally.
5.  All responses must be in Spanish.

Conversation History:
{{#if history}}
{{#each history}}
{{#if (eq this.role 'user')}}
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
    inputSchema: StudyAssistantInputSchema,
    outputSchema: StudyAssistantOutputSchema,
  },
  async input => {
    const {output} = await studyAssistantPrompt(input);
    return output!;
  }
);
