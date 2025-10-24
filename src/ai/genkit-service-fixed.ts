import { IntegratedAISystem } from '../../CACHE/index';

// Sistema Genkit AI integrado con el CACHE
export class GenkitAIService {
  private integratedSystem: IntegratedAISystem;

  constructor() {
    this.integratedSystem = new IntegratedAISystem();
  }

  // Servicio para resumir videos de YouTube
  async summarizeYouTubeVideo(videoUrl: string, userId: string) {
    try {
      // Usar el sistema integrado para obtener perfil del usuario
      const userProfile = await this.getUserProfile(userId);

      // Importar dinámicamente el flow de Genkit
      const { generateYouTubeSummary } = await import('./educational-flows');

      // Ejecutar el flow de Genkit
      const summaryResult = await generateYouTubeSummary({
        videoUrl,
        learningStyle: userProfile.learningStyle as 'visual' | 'auditory' | 'kinesthetic' | 'reading',
        userLevel: userProfile.level as 'beginner' | 'intermediate' | 'advanced'
      });

      // Guardar en cache
      await this.integratedSystem.aiCache.saveToCache(
        `youtube-${videoUrl}-${userId}`,
        summaryResult
      );

      // Generar audio del resumen
      const { textToSpeechFlow } = await import('./educational-flows');
      const audioResult = await textToSpeechFlow({
        text: summaryResult.summary,
        voice: 'female',
        speed: 1.0,
        language: 'es-MX'
      });

      return {
        ...summaryResult,
        audioUrl: audioResult.audioUrl,
        generatedAt: new Date().toISOString(),
        userId
      };
    } catch (error) {
      console.error('Error en GenkitAIService.summarizeYouTubeVideo:', error);
      throw new Error('No se pudo generar el resumen del video');
    }
  }

  // Servicio para análisis predictivo de aprendizaje
  async analyzeStudentPerformance(userId: string) {
    try {
      const userHistory = await this.getUserHistory(userId);
      const currentPerformance = await this.getCurrentPerformance(userId);
      const emotionalState = await this.integratedSystem.emotionalIntelligence.analyzeEmotionalState(userId);

      const { analyzeLearningPatterns } = await import('./educational-flows');

      const analysis = await analyzeLearningPatterns({
        userHistory,
        currentPerformance,
        emotionalState: emotionalState.mood
      });

      // Guardar análisis en cache
      await this.integratedSystem.aiCache.saveToCache(
        `analysis-${userId}`,
        analysis
      );

      return analysis;
    } catch (error) {
      console.error('Error en GenkitAIService.analyzeStudentPerformance:', error);
      return {
        insights: ['Error al analizar rendimiento'],
        recommendations: ['Contactar soporte técnico'],
        predictedPerformance: 50,
        adaptiveStrategy: 'Revisar configuración del sistema'
      };
    }
  }

  // Servicio para generar estrategias pedagógicas
  async generateTeachingStrategies(topic: string, userId: string) {
    try {
      const userProfile = await this.getUserProfile(userId);
      const learningObjectives = await this.getLearningObjectives(topic);

      const { generateTeachingStrategies: generateStrategies } = await import('./educational-flows');

      const strategies = await generateStrategies({
        topic,
        studentProfile: userProfile,
        learningObjectives
      });

      return strategies;
    } catch (error) {
      console.error('Error en GenkitAIService.generateTeachingStrategies:', error);
      return {
        strategies: [{
          name: 'Estrategia Básica',
          description: 'Revisar conceptos fundamentales',
          implementation: 'Estudiar teoría básica',
          expectedOutcomes: ['Comprensión básica adquirida']
        }],
        assessmentMethods: ['Quiz teórico']
      };
    }
  }

  // Métodos auxiliares
  private async getUserProfile(userId: string) {
    // Integrar con Firestore para obtener perfil real
    return {
      learningStyle: 'visual' as const,
      level: 'intermediate' as const,
      preferences: {}
    };
  }

  private async getUserHistory(userId: string) {
    // Integrar con Firestore para historial real
    return [];
  }

  private async getCurrentPerformance(userId: string) {
    // Integrar con Firestore para rendimiento actual
    return {};
  }

  private async getLearningObjectives(topic: string) {
    // Definir objetivos de aprendizaje por tema
    const objectives: Record<string, string[]> = {
      'psicologia': ['Comprender bases biopsicosociales', 'Identificar procesos psicológicos'],
      'aprendizaje': ['Diferenciar estilos de aprendizaje', 'Aplicar estrategias pedagógicas']
    };

    return objectives[topic] || ['Comprender conceptos básicos'];
  }
}

// Instancia global del servicio
export const genkitAIService = new GenkitAIService();
