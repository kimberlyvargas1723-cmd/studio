// import { enableFirebaseTelemetry } from "@genkit-ai/firebase";
// import { vertexAI } from '@genkit-ai/vertexai'; // Temporalmente comentado;
import { genkit } from "genkit";
import { z } from "zod";

// Habilitar telemetría de Firebase - DISABLED for client-side compatibility
// enableFirebaseTelemetry();

// Configurar Genkit con Vertex AI (recomendado para Firebase)
// Note: This configuration is disabled for client-side builds to avoid Node.js module errors
export const ai = genkit({
  plugins: [
    // vertexAI({
    //   // La API key se configura automáticamente cuando se despliega en Firebase
    //   // Para desarrollo local, usar variable de entorno
    //   apiKey: process.env.GOOGLE_GENAI_API_KEY || 'fake-key-for-dev'
    // })
  ],
});

// Configuración educativa para JvairyX - Ahora con ML Kit integration
export const AI_EDUCATIONAL_CONFIG = {
  model: "gemini-1.5-flash",
  temperature: 0.7,
  maxTokens: 2000,
  systemPrompt: `Eres JvairyX, una IA educativa avanzada especializada en psicología y aprendizaje adaptativo con capacidades de Machine Learning.

  Capacidades principales:
  - Analizar texto e imágenes usando ML Kit para extraer información educativa
  - Generar explicaciones adaptadas al estilo de aprendizaje del estudiante
  - Crear resúmenes de videos de YouTube sobre psicología
  - Generar flashcards automáticas de conceptos clave
  - Analizar patrones de estudio usando ML y dar recomendaciones personalizadas
  - Predecir rendimiento en exámenes basado en datos históricos
  - Proporcionar estrategias de aprendizaje personalizadas usando ML
  - Detectar estados emocionales y adaptar el contenido emocionalmente
  - Facilitar debates colaborativos sobre temas psicológicos
  - Procesar notas manuscritas y convertirlas en contenido searchable
  - Generar quizzes adaptativos basados en análisis de contenido

  Usa datos de ML Kit para enriquecer tus respuestas:
  - Si el usuario sube una imagen, analiza su contenido para contextualizar
  - Si hay texto, identifica temas clave y genera preguntas
  - Adapta el nivel de dificultad basado en predicciones de rendimiento

  Siempre responde en español, de manera clara, educativa y motivadora.`,
};

// Flujos educativos con ML Kit integration
export const educationalFlows = {
  // Análisis de contenido con ML Kit
  analyzeStudyMaterial: ai.defineFlow(
    {
      name: "analyzeStudyMaterial",
      inputSchema: z.object({
        content: z.string(),
        contentType: z.enum(["text", "image", "audio"]),
        userLevel: z.enum(["beginner", "intermediate", "advanced"]),
        userId: z.string(),
      }),
      outputSchema: z.object({
        keyConcepts: z.array(z.string()),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]),
        recommendations: z.array(z.string()),
        quizQuestions: z.array(
          z.object({
            question: z.string(),
            options: z.array(z.string()),
            correctAnswer: z.number(),
            explanation: z.string(),
          }),
        ),
      }),
    },
    async ({ content, contentType, userLevel, userId }) => {
      // Use ML Kit to analyze content
      let analysis: { labels: string[]; text: string } = {
        labels: [],
        text: "",
      };

      if (contentType === "image") {
        // Simulate ML Kit image analysis
        analysis = {
          labels: ["psychology", "brain", "learning"],
          text: "Imagen relacionada con psicología cognitiva",
        };
      } else {
        analysis = {
          labels: content.split(" ").slice(0, 5), // Simple keyword extraction
          text: content,
        };
      }

      // Generate personalized response based on ML analysis
      const prompt = `Analiza el siguiente contenido educativo: "${content}"
      Tipo: ${contentType}
      Nivel del estudiante: ${userLevel}
      Análisis ML: ${JSON.stringify(analysis)}

      Genera:
      1. Conceptos clave identificados
      2. Nivel de dificultad adaptado
      3. Recomendaciones personalizadas
      4. 3 preguntas de quiz con opciones y explicaciones`;

      const response = await ai.generate({
        model: "gemini-1.5-flash",
        prompt,
        config: AI_EDUCATIONAL_CONFIG,
      });

      // Parse and structure response
      const parsedResponse = JSON.parse(response.text);

      return {
        keyConcepts: parsedResponse.keyConcepts || analysis.labels,
        difficulty: parsedResponse.difficulty || userLevel,
        recommendations: parsedResponse.recommendations || [],
        quizQuestions: parsedResponse.quizQuestions || [],
      };
    },
  ),

  // Predicción de rendimiento con ML
  predictPerformance: ai.defineFlow(
    {
      name: "predictPerformance",
      inputSchema: z.object({
        userId: z.string(),
        topic: z.string(),
        historicalScores: z.array(z.number()),
        studyTime: z.number(),
      }),
      outputSchema: z.object({
        predictedScore: z.number(),
        confidence: z.number(),
        recommendations: z.array(z.string()),
        suggestedStudyTime: z.number(),
      }),
    },
    async ({ userId, topic, historicalScores, studyTime }) => {
      // Simulate ML prediction based on historical data
      const avgScore =
        historicalScores.reduce((sum, score) => sum + score, 0) /
        historicalScores.length;
      const trend =
        historicalScores.length > 1
          ? (historicalScores[historicalScores.length - 1] -
              historicalScores[0]) /
            historicalScores.length
          : 0;

      const predictedScore = Math.min(100, Math.max(0, avgScore + trend * 10));
      const confidence = Math.min(0.95, 0.5 + historicalScores.length * 0.1);

      const prompt = `Predice el rendimiento del estudiante en ${topic}:
      Promedio histórico: ${avgScore}%
      Tendencia: ${trend > 0 ? "mejorando" : "bajando"}
      Tiempo de estudio: ${studyTime} minutos
      Puntaje predicho: ${predictedScore}%

      Genera recomendaciones para mejorar el rendimiento.`;

      const response = await ai.generate({
        model: "gemini-1.5-flash",
        prompt,
        config: AI_EDUCATIONAL_CONFIG,
      });

      return {
        predictedScore,
        confidence,
        recommendations: response.text.split("\n").filter((r) => r.trim()),
        suggestedStudyTime: Math.max(
          30,
          studyTime + (100 - predictedScore) * 2,
        ),
      };
    },
  ),

  // Generación de quizzes adaptativos con ML
  generateAdaptiveQuiz: ai.defineFlow(
    {
      name: "generateAdaptiveQuiz",
      inputSchema: z.object({
        topic: z.string(),
        userLevel: z.enum(["beginner", "intermediate", "advanced"]),
        questionCount: z.number(),
        weakAreas: z.array(z.string()),
        userId: z.string(),
      }),
      outputSchema: z.object({
        questions: z.array(
          z.object({
            id: z.string(),
            question: z.string(),
            options: z.array(z.string()),
            correctAnswer: z.number(),
            explanation: z.string(),
            difficulty: z.enum(["beginner", "intermediate", "advanced"]),
            topic: z.string(),
          }),
        ),
        adaptiveLevel: z.enum(["beginner", "intermediate", "advanced"]),
      }),
    },
    async ({ topic, userLevel, questionCount, weakAreas, userId }) => {
      // Adjust difficulty based on ML analysis
      let adaptiveLevel = userLevel;
      if (weakAreas.length > 3) {
        adaptiveLevel = "beginner"; // Focus on basics if many weak areas
      } else if (weakAreas.length === 0) {
        adaptiveLevel = "advanced"; // Challenge if no weak areas
      }

      const prompt = `Genera ${questionCount} preguntas adaptativas sobre ${topic} para nivel ${adaptiveLevel}.
      Áreas débiles del estudiante: ${weakAreas.join(", ")}
      Enfócate en: ${weakAreas.length > 0 ? weakAreas[0] : "conceptos generales"}

      Cada pregunta debe tener:
      - 4 opciones
      - Respuesta correcta
      - Explicación detallada
      - Dificultad y tema

      Formato JSON estructurado.`;

      const response = await ai.generate({
        model: "gemini-1.5-flash",
        prompt,
        config: AI_EDUCATIONAL_CONFIG,
      });

      const questions = JSON.parse(response.text);

      return {
        questions,
        adaptiveLevel,
      };
    },
  ),

  // Análisis de notas manuscritas con ML Kit
  analyzeHandwrittenNotes: ai.defineFlow(
    {
      name: "analyzeHandwrittenNotes",
      inputSchema: z.object({
        imageData: z.string(), // Base64 image
        userId: z.string(),
        context: z.string(),
      }),
      outputSchema: z.object({
        extractedText: z.string(),
        keyTopics: z.array(z.string()),
        studyRecommendations: z.array(z.string()),
        flashcards: z.array(
          z.object({
            front: z.string(),
            back: z.string(),
          }),
        ),
      }),
    },
    async ({ imageData, userId, context }) => {
      // Simulate ML Kit text extraction
      const mockExtractedText =
        "Texto extraído de la imagen: Conceptos de psicología cognitiva, memoria y aprendizaje.";

      const prompt = `Analiza las siguientes notas manuscritas: "${mockExtractedText}"
      Contexto: ${context}
      Usuario: ${userId}

      Extrae:
      1. Texto completo
      2. Temas clave
      3. Recomendaciones de estudio
      4. 5 flashcards para reforzar conceptos

      Responde en formato JSON.`;

      const response = await ai.generate({
        model: "gemini-1.5-flash",
        prompt,
        config: AI_EDUCATIONAL_CONFIG,
      });

      const analysis = JSON.parse(response.text);

      return {
        extractedText: analysis.extractedText || mockExtractedText,
        keyTopics: analysis.keyTopics || ["psicología cognitiva", "memoria"],
        studyRecommendations: analysis.studyRecommendations || [],
        flashcards: analysis.flashcards || [],
      };
    },
  ),
};

// Función para obtener configuración adaptativa
export function getAdaptiveConfig(userLevel: string, learningStyle: string) {
  const baseConfig = AI_EDUCATIONAL_CONFIG;

  // Adjust temperature based on learning style
  let temperature = baseConfig.temperature;
  if (learningStyle === "visual") temperature = 0.6; // More structured
  if (learningStyle === "kinesthetic") temperature = 0.8; // More creative

  // Adjust max tokens based on level
  let maxTokens = baseConfig.maxTokens;
  if (userLevel === "beginner") maxTokens = 1000;
  if (userLevel === "advanced") maxTokens = 3000;

  return {
    ...baseConfig,
    temperature,
    maxTokens,
    adaptivePrompt: `Estilo de aprendizaje: ${learningStyle}
    Nivel: ${userLevel}
    Adapta tu respuesta a estas características.`,
  };
}
