// src/ai/flows/personalized-feedback-adaptation.ts
'use server';
/**
 * @fileOverview Flow to analyze a student's answer and generate personalized feedback.
 *
 * This file defines the central AI flow for adaptive learning. It analyzes
 * a student's quiz response, provides personalized feedback adapted to their
 * learning style, identifies areas for improvement, and suggests a dynamic next step.
 *
 * - `analyzePerformanceAndAdapt`: The main function to trigger the analysis.
 */

import { ai } from '@/ai/genkit';
import {
  PerformanceAnalysisInputSchema,
  type PerformanceAnalysisInput,
  PerformanceAnalysisOutputSchema,
  type PerformanceAnalysisOutput
} from '@/ai/schemas';

/**
 * Analyzes a student's answer to a quiz question to provide personalized, adaptive feedback.
 * This flow is the core of the adaptive learning tutor.
 *
 * @param {PerformanceAnalysisInput} input - The question and answer context.
 * @returns {Promise<PerformanceAnalysisOutput>} A promise that resolves with the personalized feedback and next steps.
 */
export async function analyzePerformanceAndAdapt(input: PerformanceAnalysisInput): Promise<PerformanceAnalysisOutput> {
  return analyzePerformanceFlow(input);
}


const prompt = ai.definePrompt({
  name: 'performanceAnalysisPrompt',
  input: { schema: PerformanceAnalysisInputSchema },
  output: { schema: PerformanceAnalysisOutputSchema },
  prompt: `You are an expert AI tutor for a psychology student named Kimberly. Her dominant learning style is {{learningStyle}}.
  Your task is to analyze her answer to a practice question and provide adaptive feedback.

  Topic: {{topic}}
  Question: "{{question}}"
  Correct Answer: "{{correctAnswer}}"
  Kimberly's Answer: "{{studentAnswer}}"

  Analyze her answer and generate the following in Spanish:
  1.  **feedback**: Provide concise, encouraging, and specific feedback. If she was wrong, explain the core misunderstanding. If she was right, reinforce the concept. **Crucially, adapt your explanation to her learning style.** For a Visual learner, say "Imagina que..."; for a Kinesthetic learner, use a real-world analogy. For an Auditory learner, phrase it conversationally. For a Reading/Writing learner, be direct and definitional.
  2.  **areasForImprovement**: Identify the single, most important underlying concept or skill she needs to work on. (e.g., "Diferenciar entre refuerzo positivo y negativo", "Identificar la función del hipocampo").
  3.  **nextStep**: Based on the analysis, decide the best next step for Kimberly. You have three options:
      - **'question'**: If she just needs more practice, suggest a closely related topic for the next question to reinforce her knowledge or address her weak point. The value should be the topic name (e.g., \`{ "type": "question", "value": "Psicología del Desarrollo" }\`).
      - **'summary'**: If she seems to have a fundamental misunderstanding of the topic, suggest she read a summary. The value should be the topic she needs to review (e.g., \`{ "type": "summary", "value": "{{topic}}" }\`).
      - **'youtube'**: If the concept is highly visual or complex, suggest a YouTube search. The value should be a concise, effective search query in Spanish (e.g., \`{ "type": "youtube", "value": "experimento de la situación extraña de Ainsworth" }\`).
      
      Choose only ONE next step. Be strategic.
  `,
});


const analyzePerformanceFlow = ai.defineFlow(
  {
    name: 'analyzePerformanceFlow',
    inputSchema: PerformanceAnalysisInputSchema,
    outputSchema: PerformanceAnalysisOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
