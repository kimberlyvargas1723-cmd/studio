// src/ai/flows/image-text-extraction.ts
'use server';
/**
 * @fileOverview AI flow for extracting and correcting text from an image.
 *
 * This file defines a flow that uses a multimodal model (Gemini Pro Vision)
 * to extract text from an image provided as a Data URI. It also corrects
 * any spelling or grammatical errors in the extracted text.
 *
 * - `extractTextFromImage`: The main function that handles the text extraction process.
 */

import { ai } from '@/ai/genkit';
import {
  ImageTextExtractionInputSchema,
  type ImageTextExtractionInput,
  ImageTextExtractionOutputSchema,
  type ImageTextExtractionOutput
} from '@/ai/schemas';

/**
 * Extracts text from the provided image using a multimodal AI model.
 * If the text in the image contains spelling or grammatical errors, the AI will correct them.
 * @param {ImageTextExtractionInput} input - An object containing the Data URI of the image.
 * @returns {Promise<ImageTextExtractionOutput>} A promise that resolves with the extracted and corrected text.
 */
export async function extractTextFromImage(input: ImageTextExtractionInput): Promise<ImageTextExtractionOutput> {
  return extractTextFromImageFlow(input);
}

const extractTextFromImageFlow = ai.defineFlow(
  {
    name: 'extractTextFromImageFlow',
    inputSchema: ImageTextExtractionInputSchema,
    outputSchema: ImageTextExtractionOutputSchema,
  },
  async input => {
    const { text } = await ai.generate({
      model: 'googleai/gemini-pro-vision',
      prompt: [
        { media: { url: input.imageUrl } },
        { text: 'Extrae todo el texto de esta imagen. Si la imagen contiene texto mal escrito o con errores gramaticales, corrígelo e incluye solo el texto corregido en tu respuesta. El formato debe ser Markdown.' },
      ],
      config: { temperature: 0.1 }, // Low temperature for more deterministic and accurate extraction.
    });
    
    return { textContent: text };
  }
);
