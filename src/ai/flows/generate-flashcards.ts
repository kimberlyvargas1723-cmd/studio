// src/ai/flows/generate-flashcards.ts
'use server';
/**
 * @fileOverview Un flujo de IA para generar tarjetas de memoria (flashcards) a partir de un texto.
 *
 * Este flujo toma un bloque de texto sobre un tema específico y lo convierte
 * en un conjunto de preguntas y respuestas cortas, ideales para el estudio activo.
 *
 * - `generateFlashcards`: La función principal que invoca el flujo.
 */

import { ai } from '@/ai/genkit';
import {
  FlashcardGenerationInputSchema,
  type FlashcardGenerationInput,
  FlashcardGenerationOutputSchema,
  type FlashcardGenerationOutput,
} from '@/ai/schemas';

/**
 * Genera un conjunto de flashcards (pregunta/respuesta) a partir de un texto.
 * @param {FlashcardGenerationInput} input - El contenido y el tema del texto.
 * @returns {Promise<FlashcardGenerationOutput>} Una promesa que resuelve con un array de flashcards.
 */
export async function generateFlashcards(input: FlashcardGenerationInput): Promise<FlashcardGenerationOutput> {
  return generateFlashcardsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: { schema: FlashcardGenerationInputSchema },
  output: { schema: FlashcardGenerationOutputSchema },
  prompt: `Eres un experto en técnicas de estudio y estás creando tarjetas de memoria (flashcards) para Kimberly.
  Tu tarea es leer el siguiente texto sobre "{{topic}}" y extraer los conceptos, definiciones y datos más importantes para convertirlos en un conjunto de preguntas y respuestas.

  REGLAS:
  1.  Cada flashcard debe tener una pregunta (anverso) y una respuesta (reverso).
  2.  Las preguntas deben ser claras y directas.
  3.  Las respuestas deben ser concisas y precisas.
  4.  Genera entre 5 y 10 flashcards, enfocándote en la información más crucial para un examen.
  5.  Todo el contenido debe estar en español.

  Texto de entrada:
  "{{content}}"
  
  Genera ahora las flashcards.`,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: FlashcardGenerationInputSchema,
    outputSchema: FlashcardGenerationOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
