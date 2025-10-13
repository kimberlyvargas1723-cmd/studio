// src/ai/flows/generate-learning-strategy.ts
'use server';
/**
 * @fileOverview Flow to generate a personalized learning strategy based on the VARK model.
 *
 * This file defines the AI flow that takes a user's dominant learning style code
 * (V, A, R, or K) and generates a detailed, actionable learning strategy in Spanish.
 *
 * - `generateLearningStrategy`: The main function to trigger the strategy generation.
 */

import { ai } from '@/ai/genkit';
import {
  LearningStrategyInputSchema,
  type LearningStrategyInput,
  LearningStrategyOutputSchema,
  type LearningStrategyOutput
} from '@/ai/schemas';

/**
 * Generates a personalized learning strategy based on a dominant learning style.
 * @param {LearningStrategyInput} input - The user's dominant learning style code.
 * @returns {Promise<LearningStrategyOutput>} A promise that resolves with the full style name and the generated strategy.
 */
export async function generateLearningStrategy(input: LearningStrategyInput): Promise<LearningStrategyOutput> {
  return generateLearningStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLearningStrategyPrompt',
  input: { schema: LearningStrategyInputSchema },
  output: { schema: LearningStrategyOutputSchema },
  prompt: `You are an expert educational psychologist AI named Vairyx. You are creating a personalized learning strategy for Kimberly based on her dominant learning style from the VARK model.

Her dominant learning style is represented by the code: {{learningStyle}}.

Your task is to generate a comprehensive and encouraging learning strategy in Spanish, formatted in Markdown. The strategy should be highly specific and actionable.

Here are the mappings for the style codes:
- V: Visual
- A: Auditivo
- R: Lectoescritor
- K: Kinestésico

First, determine the full name of the style from the code and set it in the 'style' output field.

Then, for the 'strategy' output field, create a detailed guide with the following structure:
1.  **Título Principal:** "### Tu Superpoder: Aprendizaje [Nombre del Estilo]"
2.  **Introducción:** Una frase corta y motivadora sobre cómo aprovechar este superpoder.
3.  **Estrategias Clave (Bulleted List):** Proporciona al menos 4-5 estrategias de estudio súper específicas y prácticas, adaptadas al estilo de aprendizaje.
    -   **Para Visual (V):** Sugiere usar mapas mentales, diagramas de flujo, subrayar con códigos de colores, ver documentales, usar tarjetas de memoria (flashcards) con imágenes.
    -   **Para Auditivo (A):** Sugiere grabar resúmenes y escucharlos, explicar conceptos en voz alta, usar mnemotecnia con canciones o ritmos, debatir temas con otros.
    -   **Para Lectoescritor (R):** Sugiere reescribir apuntes en sus propias palabras, crear resúmenes y listas detalladas, buscar artículos y leer definiciones en diccionarios, enseñar el material por escrito.
    -   **Para Kinestésico (K):** Sugiere estudiar en bloques cortos con movimiento, asociar conceptos con acciones físicas, usar ejemplos de la vida real, construir modelos o dibujar para entender, y practicar con exámenes de simulación.
4.  **Conclusión:** Una frase final de ánimo.

Example for input 'V':
- style: "Visual"
- strategy: "### Tu Superpoder: Aprendizaje Visual..."

Generate the personalized strategy now.`,
});

const generateLearningStrategyFlow = ai.defineFlow(
  {
    name: 'generateLearningStrategyFlow',
    inputSchema: LearningStrategyInputSchema,
    outputSchema: LearningStrategyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
