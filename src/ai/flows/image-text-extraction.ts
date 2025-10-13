'use server';

/**
 * @fileOverview An AI flow that uses a multimodal model (Gemini Pro Vision)
 * to extract and correct text content from an image provided as a data URI.
 *
 * - extractTextFromImage - The main function that handles the text extraction process.
 * - ImageTextExtractionInput - The Zod schema for the input.
 * - ImageTextExtractionOutput - The Zod schema for the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the schema for the input 얼굴 the image text extraction flow.
 */
const ImageTextExtractionInputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "A photo of content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageTextExtractionInput = z.infer<typeof ImageTextExtractionInputSchema>;

/**
 * Defines the schema for the output of the image text extraction flow.
 */
const ImageTextExtractionOutputSchema = z.object({
  textContent: z.string().describe('The extracted and corrected text content from the image.'),
});
export type ImageTextExtractionOutput = z.infer<typeof ImageTextExtractionOutputSchema>;

/**
 * Extracts text from the provided image using a multimodal AI model.
 * If the text in the image contains spelling or grammatical errors, the AI will correct them.
 * @param {ImageTextExtractionInput} input - An object containing the image data URI.
 * @returns {Promise<ImageTextExtractionOutput>} A promise that resolves to the extracted and corrected text.
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
      config: { temperature: 0.1 }, // Low temperature for more deterministic, accurate extraction.
    });
    
    return { textContent: text };
  }
);
