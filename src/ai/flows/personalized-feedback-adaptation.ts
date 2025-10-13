'use server';

/**
 * @fileOverview A flow for analyzing a student's answer to generate personalized feedback.
 *
 * This file defines the core AI flow for adaptive learning. It analyzes a student's
 * quiz answer, provides personalized feedback adapted to their learning style,
 * identifies areas for improvement, and suggests a topic for the next question.
 * It also includes a special case for generating a dynamic greeting on the dashboard.
 *
 * - analyzePerformanceAndAdapt - The main function to trigger the analysis.
 * - PerformanceAnalysisInput - The Zod schema for the input.
 * - PerformanceAnalysisOutput - The Zod schema for the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the schema for the input of the performance analysis flow.
 */
const PerformanceAnalysisInputSchema = z.object({
  question: z.string().describe('The question that was asked.'),
  studentAnswer: z.string().describe('The answer provided by the student.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  topic: z.string().describe('The topic of the question.'),
  learningStyle: z.string().optional().describe('The dominant learning style of the user (V, A, R, or K).'),
});
export type PerformanceAnalysisInput = z.infer<typeof PerformanceAnalysisInputSchema>;

/**
 * Defines the schema for the output of the performance analysis flow.
 */
const PerformanceAnalysisOutputSchema = z.object({
  feedback: z.string().describe('Specific, personalized feedback on why the student\'s answer was right or wrong.'),
  areasForImprovement: z.string().describe('The key concept or skill the student should focus on based on their answer.'),
  adaptedQuestionTopic: z.string().describe('A suggested topic for the next question to reinforce the area of improvement.'),
});
export type PerformanceAnalysisOutput = z.infer<typeof PerformanceAnalysisOutputSchema>;

/**
 * Analyzes a student's answer to a quiz question to provide personalized, adaptive feedback.
 * This flow is the core of the adaptive learning tutor. It also handles a special case
 * for generating a personalized greeting on the dashboard.
 *
 * @param {PerformanceAnalysisInput} input - The context of the question and answer, or a special 'dashboard_greeting' request.
 * @returns {Promise<PerformanceAnalysisOutput>} A promise that resolves to the personalized feedback and next steps.
 */
export async function analyzePerformanceAndAdapt(input: PerformanceAnalysisInput): Promise<PerformanceAnalysisOutput> {
  // This special case handles the dynamic greeting message on the dashboard.
  // It provides a welcoming and personalized message to the user when they first land on the page.
  if (input.question === 'dashboard_greeting') {
      const greetingPrompt = `You are Vairyx, an encouraging AI tutor. Create a short, personalized greeting for Kimberly. Her learning style is {{learningStyle}}. 
      Acknowledge her style with a small tip. For example, if she is Visual, say something like "¡Qué bueno verte, Kimberly! He visto que ya has estado estudiando. Para seguir avanzando, y ya que sé que eres una aprendiz **visual**, te sugiero que hoy nos centremos en el concepto de **Memoria a Largo Plazo**, que complementa lo que ya viste. Podríamos hacer un mapa mental."
      Adapt the suggestion based on the style (A: 'podríamos repasarlo en voz alta', R: 'podríamos escribir los puntos clave', K: 'podríamos usar un ejemplo práctico'). Be concise and encouraging.`;
      
      const { text } = await ai.generate({
        prompt: greetingPrompt.replace('{{learningStyle}}', input.learningStyle || 'general'),
      });

      return {
          feedback: text,
          areasForImprovement: 'Continuar con el plan de estudio.',
          adaptedQuestionTopic: 'Memoria a Largo Plazo'
      };
  }
  // For all other cases, proceed with the standard performance analysis flow.
  return analyzePerformanceFlow(input);
}


const prompt = ai.definePrompt({
  name: 'performanceAnalysisPrompt',
  input: {schema: PerformanceAnalysisInputSchema},
  output: {schema: PerformanceAnalysisOutputSchema},
  prompt: `You are an expert AI tutor for a psychology student named Kimberly. Her dominant learning style is {{learningStyle}}.
  Your task is to analyze her answer to a practice question and provide adaptive feedback.

  Topic: {{topic}}
  Question: "{{question}}"
  Correct Answer: "{{correctAnswer}}"
  Kimberly's Answer: "{{studentAnswer}}"

  Analyze her answer and generate the following in Spanish:
  1.  **feedback**: Provide concise, encouraging, and specific feedback. If she was wrong, explain the core misunderstanding. If she was right, reinforce the concept. **Crucially, adapt your explanation to her learning style.** For a Visual learner, say "Imagina que..."; for a Kinesthetic learner, use a real-world analogy. For an Auditory learner, phrase it conversationally. For a Reading/Writing learner, be direct and definitional.
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
