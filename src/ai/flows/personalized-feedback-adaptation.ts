// src/ai/flows/personalized-feedback-adaptation.ts
'use server';

/**
 * @fileOverview A flow for analyzing a student's answer to generate personalized feedback and adapt the study path.
 *
 * - analyzePerformanceAndAdapt - Analyzes a quiz answer and provides adaptive feedback.
 * - PerformanceAnalysisInput - The input type for the analyzePerformanceAndAdapt function.
 * - PerformanceAnalysisOutput - The return type for the analyzePerformanceAndAdapt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PerformanceAnalysisInputSchema = z.object({
  question: z.string().describe('The question that was asked.'),
  studentAnswer: z.string().describe('The answer provided by the student.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  topic: z.string().describe('The topic of the question.'),
});
export type PerformanceAnalysisInput = z.infer<typeof PerformanceAnalysisInputSchema>;

const PerformanceAnalysisOutputSchema = z.object({
  feedback: z.string().describe('Specific feedback on why the student\'s answer was right or wrong.'),
  areasForImprovement: z.string().describe('The key concept or skill the student should focus on based on their answer.'),
  adaptedQuestionTopic: z.string().describe('A suggested topic for the next question to reinforce the area of improvement.'),
});
export type PerformanceAnalysisOutput = z.infer<typeof PerformanceAnalysisOutputSchema>;

/**
 * Analyzes a student's answer to a quiz question to provide personalized feedback.
 * This flow is the core of the adaptive learning tutor.
 * @param {PerformanceAnalysisInput} input - The context of the question and answer.
 * @returns {Promise<PerformanceAnalysisOutput>} A promise that resolves to the personalized feedback.
 */
export async function analyzePerformanceAndAdapt(input: PerformanceAnalysisInput): Promise<PerformanceAnalysisOutput> {
  // For the dashboard greeting, we'll return a static, encouraging message.
  if (input.question === 'dashboard_greeting') {
    return {
      feedback: `He visto que ya has estado estudiando. ¡Excelente! Para seguir avanzando en tu preparación, te sugiero que hoy nos centremos en el concepto de **Memoria a Largo Plazo**, que complementa lo que ya viste.`,
      areasForImprovement: 'Continuar con el plan de estudio.',
      adaptedQuestionTopic: 'Memoria a Largo Plazo'
    };
  }
  return analyzePerformanceFlow(input);
}


const prompt = ai.definePrompt({
  name: 'performanceAnalysisPrompt',
  input: {schema: PerformanceAnalysisInputSchema},
  output: {schema: PerformanceAnalysisOutputSchema},
  prompt: `You are an expert AI tutor for a psychology student named Kimberly. Your task is to analyze her answer to a practice question and provide adaptive feedback.

  Topic: {{topic}}
  Question: "{{question}}"
  Correct Answer: "{{correctAnswer}}"
  Kimberly's Answer: "{{studentAnswer}}"

  Analyze her answer and generate the following in Spanish:
  1.  **feedback**: Provide concise, encouraging, and specific feedback. If she was wrong, explain the core misunderstanding. If she was right, reinforce the concept.
  2.  **areasForImprovement**: Identify the single, most important underlying concept or skill she needs to work on. (e.g., "Diferenciar entre refuerzo positivo y negativo", "Identificar la función del hipocampo").
  3.  **adaptedQuestionTopic**: Suggest a closely related topic for the next question to either reinforce her knowledge or address her weak point.
  `,
});


const analyzePerformanceFlow = ai.defineFlow(
  {
    name: 'analyzePerformanceFlow',
    inputSchema: PerformanceAnalysisInputSchema,
    outputSchema: PerformanceAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
