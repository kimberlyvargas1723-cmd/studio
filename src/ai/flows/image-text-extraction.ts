import { defineFlow, AIFunction } from '@genkit-ai/ai';
import { z } from 'zod';

// Se eliminó la importación incorrecta, ya que el modelo se referencia por su ID de string.

/**
 * A new AI flow that uses a multimodal model (Gemini Pro Vision)
 * to extract text content from an image provided as a data URI.
 */
export const extractTextFromImage = defineFlow(
  {
    name: 'extractTextFromImage',
    inputSchema: z.object({ imageUrl: z.string() }),
    outputSchema: z.object({ textContent: z.string() }),
  },
  async (input: { imageUrl: string }): Promise<{ textContent: string }> => {
    console.log(`[extractTextFromImage] Received image for processing.`);

    // Use a multimodal model to generate content based on the image and a prompt.
    const llmResponse = await new AIFunction(
      {
        // Corregido: Se utiliza el identificador de string del modelo en lugar de un objeto importado.
        model: 'googleai/gemini-pro-vision',
        prompt: [
          { media: { url: input.imageUrl } },
          { text: 'Extrae todo el texto de esta imagen. Si la imagen contiene texto mal escrito o con errores, corrígelo e incluye solo el texto corregido en tu respuesta.' },
        ],
        config: { temperature: 0.1 },
      },
      async (response: string) => {
        // The model's response is the extracted text.
        console.log(`[extractTextFromImage] Extracted text: ${response.substring(0, 100)}...`);
        return { textContent: response };
      }
    ).run();

    return llmResponse;
  }
);
