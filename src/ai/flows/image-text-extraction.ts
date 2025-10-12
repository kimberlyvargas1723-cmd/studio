'use server';

/**
 * @fileOverview An AI flow that uses a multimodal model (Gemini Pro Vision)
 * to extract text content from an image provided as a data URI.
 *
 * - extractTextFromImage - A function that handles the text extraction process.
 * - ImageTextExtractionInput - The input type for the extractTextFromImage function.
 * - ImageTextExtractionOutput - The return type for the extractTextFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageTextExtractionInputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "A photo of content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageTextExtractionInput = z.infer<typeof ImageTextExtractionInputSchema>;

const ImageTextExtractionOutputSchema = z.object({
  textContent: z.string().describe('The extracted text content from the image.'),
});
export type ImageTextExtractionOutput = z.infer<typeof ImageTextExtractionOutputSchema>;

/**
 * Extracts text from the provided image using an AI model.
 * @param {ImageTextExtractionInput} input - The image to be processed.
 * @returns {Promise<ImageTextExtractionOutput>} A promise that resolves to the extracted text.
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
        { text: 'Extrae todo el texto de esta imagen. Si la imagen contiene texto mal escrito o con errores, corrígelo e incluye solo el texto corregido en tu respuesta.' },
      ],
      config: { temperature: 0.1 },
    });
    
    return { textContent: text };
  }
);
