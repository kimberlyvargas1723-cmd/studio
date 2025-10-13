// src/ai/flows/generate-dashboard-greeting.ts
'use server';
/**
 * @fileOverview Flow to generate a personalized greeting for the user's dashboard.
 *
 * This flow creates a welcoming message for Kimberly, acknowledging her learning
 * style and providing a small, actionable tip to get her started.
 *
 * - `generateDashboardGreeting`: The main function to trigger the greeting generation.
 */

import { ai } from '@/ai/genkit';
import {
  DashboardGreetingInputSchema,
  type DashboardGreetingInput,
  DashboardGreetingOutputSchema,
  type DashboardGreetingOutput,
} from '@/ai/schemas';

/**
 * Generates a personalized dashboard greeting for the user.
 * @param {DashboardGreetingInput} input - The user's learning style.
 * @returns {Promise<DashboardGreetingOutput>} A promise that resolves with the generated greeting and a study suggestion.
 */
export async function generateDashboardGreeting(input: DashboardGreetingInput): Promise<DashboardGreetingOutput> {
  return generateDashboardGreetingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dashboardGreetingPrompt',
  input: { schema: DashboardGreetingInputSchema },
  output: { schema: DashboardGreetingOutputSchema },
  prompt: `You are Vairyx, an encouraging AI tutor. Create a short, personalized greeting for Kimberly. Her learning style is {{learningStyle}}. 
      Acknowledge her style with a small tip. For example, if she is Visual, say something like "¡Qué bueno verte, Kimberly! Ya que sé que eres una aprendiz **visual**, te sugiero que hoy nos centremos en el concepto de **Memoria a Largo Plazo**. Podríamos hacer un mapa mental para conectar las ideas clave."
      
      Adapt the suggestion based on the style:
      - For Auditory (A), suggest: 'podríamos repasarlo en voz alta'.
      - For Reading/Writing (R), suggest: 'podríamos escribir los puntos clave'.
      - For Kinesthetic (K), suggest: 'podríamos usar un ejemplo práctico'.
      - For General/undefined, provide a general encouraging message.
      
      Be concise and encouraging. Your output must be in Spanish.
      The 'greeting' field should contain the full welcome message.
      The 'suggestion' field should contain ONLY the name of the suggested topic (e.g., 'Memoria a Largo Plazo').`,
});

const generateDashboardGreetingFlow = ai.defineFlow(
  {
    name: 'generateDashboardGreetingFlow',
    inputSchema: DashboardGreetingInputSchema,
    outputSchema: DashboardGreetingOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
