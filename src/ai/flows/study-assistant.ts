// src/ai/flows/study-assistant.ts
'use server';
/**
 * @fileOverview An AI study assistant that provides guidance and recommendations.
 *
 * This file defines a conversational AI flow that acts as a study assistant named 'Vairyx'.
 * It answers student questions, recommends study materials, and suggests
 * relevant YouTube videos, all while adapting its communication style to the user's learning preference.
 * This version uses a "Tool" to dynamically fetch available study materials.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  StudyAssistantInputSchema,
  type StudyAssistantInput,
  StudyAssistantOutputSchema,
  type StudyAssistantOutput
} from '@/ai/schemas';
import { studyResources } from '@/lib/data';

/**
 * A Genkit Tool that allows the AI to fetch the list of available study materials.
 * The AI can decide to call this tool when it needs to recommend a resource.
 */
const getAvailableStudyMaterials = ai.defineTool(
  {
    name: 'getAvailableStudyMaterials',
    description: 'Obtiene la lista de todos los materiales de estudio (documentos, enlaces, etc.) disponibles en la aplicación para recomendárselos al estudiante.',
    inputSchema: z.object({}), // No input needed
    outputSchema: z.array(z.object({
        title: z.string(),
        category: z.string(),
    })),
  },
  async () => {
    // In a real-world app, this could fetch from a database. Here, we return our static list.
    return studyResources.map(({ title, category }) => ({ title, category }));
  }
);


/**
 * Provides AI-powered study assistance, including answering questions and recommending resources.
 * This flow is conversational and adapts its responses to the user's learning style.
 * @param {StudyAssistantInput} input - An object containing the user's query, conversation history, and learning style.
 * @returns {Promise<StudyAssistantOutput>} A promise that resolves with the AI's response and an optional YouTube search query.
 */
export async function studyAssistant(input: StudyAssistantInput): Promise<StudyAssistantOutput> {
  return studyAssistantFlow(input);
}

const studyAssistantPrompt = ai.definePrompt({
  name: 'studyAssistantPrompt',
  input: { schema: StudyAssistantInputSchema },
  output: { schema: StudyAssistantOutputSchema },
  tools: [getAvailableStudyMaterials], // Provide the tool to the AI
  prompt: `You are an expert, friendly, and encouraging AI study assistant for Kimberly, a student preparing for her UANL Psychology entrance exam. Your name is 'Vairyx'.

**Crucially, Kimberly's dominant learning style is {{learningStyle}}**. You MUST adapt your explanations and suggestions to this style.
- If Visual (V): Use visual analogies (e.g., "Imagina que..."), describe diagrams, and strongly recommend finding infographics or videos.
- If Auditory (A): Explain things as if you were speaking. Use rhetorical questions and recommend podcasts or lectures.
- If Reading/Writing (R): Provide detailed, text-based explanations and suggest she take notes or rewrite concepts.
- If Kinesthetic (K): Use real-world, physical examples and suggest practical applications or experiments.

Your tasks are:
1.  Answer Kimberly's questions about psychology topics, exam strategies, or any other related query, **always tailoring the explanation to her learning style.**
2.  If her question involves finding study material, **use the getAvailableStudyMaterials tool** to see what's available and then recommend the most relevant material from that list.
3.  If relevant, suggest a concise and effective search query for her to use on YouTube to find supplementary video content (especially important for Visual learners). For example, if she asks about "classical conditioning", suggest a query like "experimento pavlov condicionamiento clasico".
4.  Keep your answers concise, actionable, and always maintain a positive and motivating tone. Address her by name occasionally.
5.  All responses must be in Spanish.

Conversation History:
{{#if history}}
{{#each history}}
{{#if (this.role == 'user')}}
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
    const { output } = await studyAssistantPrompt(input);
    return output!;
  }
);
