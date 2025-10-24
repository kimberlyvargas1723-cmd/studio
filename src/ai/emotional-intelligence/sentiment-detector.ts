/**
 * @fileoverview Sentiment Detection Module for Vairyx
 *
 * This module analyzes student messages to detect emotional states including:
 * - Stress/anxiety levels
 * - Frustration or confusion
 * - Motivation and enthusiasm
 * - Fatigue and cognitive load
 * - Confidence levels
 */

export type EmotionalState =
  | 'anxious'
  | 'frustrated'
  | 'confused'
  | 'motivated'
  | 'tired'
  | 'confident'
  | 'overwhelmed'
  | 'neutral'
  | 'excited'
  | 'discouraged';

export type SentimentIntensity = 'low' | 'medium' | 'high';

export interface SentimentAnalysis {
  primaryEmotion: EmotionalState;
  intensity: SentimentIntensity;
  confidence: number; // 0-1 scale
  indicators: string[]; // Words/patterns that triggered detection
  needsBreak: boolean;
  needsEncouragement: boolean;
  needsSimplification: boolean;
}

/**
 * Linguistic patterns for detecting different emotional states
 */
const SENTIMENT_PATTERNS = {
  anxious: {
    keywords: [
      'nervios', 'nerviosa', 'ansiedad', 'preocup', 'miedo', 'temo',
      'estres', 'presión', 'agobio', 'tenso', 'tensa', 'angustia'
    ],
    phrases: [
      'no sé si', 'qué pasa si', 'y si no', 'tengo miedo',
      'me da miedo', 'estoy nerviosa', 'me preocupa'
    ],
    punctuation: ['?!', '!!!'],
  },
  frustrated: {
    keywords: [
      'frustrad', 'molest', 'irritad', 'enojad', 'harta', 'harto',
      'cansad', 'dificil', 'complicado', 'imposible', 'nunca'
    ],
    phrases: [
      'no entiendo', 'no puedo', 'no me sale', 'ya no puedo',
      'esto es imposible', 'no lo logro', 'siempre me equivoco'
    ],
    punctuation: ['!', '!!'],
  },
  confused: {
    keywords: [
      'confund', 'confus', 'duda', 'insegur', 'perdid', 'enredad',
      'lio', 'mescolanza', 'revoltijo', 'caos'
    ],
    phrases: [
      'no entiendo', 'no comprendo', 'no sé', 'qué significa',
      'cómo funciona', 'por qué', 'no me queda claro', 'explica'
    ],
    punctuation: ['???', '??'],
  },
  motivated: {
    keywords: [
      'motiv', 'emocionad', 'entusiasm', 'ganas', 'energía', 'ánimo',
      'list', 'prepar', 'enfocad', 'determinad', 'vamos'
    ],
    phrases: [
      'voy a lograrlo', 'puedo hacerlo', 'estoy lista', 'quiero aprender',
      'me gusta', 'interesante', 'vamos', 'a por ello'
    ],
    punctuation: ['!'],
  },
  tired: {
    keywords: [
      'cansad', 'agotad', 'exhaust', 'fatiga', 'sueño', 'dormir',
      'descanso', 'pausa', 'mucho', 'demasiado', 'rendid'
    ],
    phrases: [
      'estoy cansada', 'necesito descansar', 'mucho tiempo',
      'ya llevo horas', 'no puedo más', 'me duele la cabeza',
      'necesito un break', 'ya me cansé'
    ],
    punctuation: [],
  },
  confident: {
    keywords: [
      'segur', 'confiad', 'capaz', 'sé que', 'claro', 'entendido',
      'perfecto', 'excelente', 'bien', 'domino', 'controlo'
    ],
    phrases: [
      'lo entiendo', 'tiene sentido', 'ya lo sé', 'está claro',
      'lo tengo', 'fácil', 'lo domino', 'sin problema'
    ],
    punctuation: [],
  },
  overwhelmed: {
    keywords: [
      'abrumad', 'sobrepas', 'mucho', 'demasiado', 'tanto', 'agobio',
      'saturad', 'colapso', 'desbord', 'no puedo con todo'
    ],
    phrases: [
      'es mucho', 'demasiado', 'no puedo con todo', 'me siento abrumada',
      'son muchas cosas', 'no me da tiempo', 'es demasiado'
    ],
    punctuation: ['!!!'],
  },
  excited: {
    keywords: [
      'emocionad', 'genial', 'increíble', 'super', 'súper', 'wow',
      'guau', 'fantástico', 'asombroso', 'feliz', 'contenta'
    ],
    phrases: [
      'qué genial', 'me encanta', 'esto es increíble', 'super bien',
      'qué bueno', 'me fascina', 'esto me gusta'
    ],
    punctuation: ['!', '!!'],
  },
  discouraged: {
    keywords: [
      'desanim', 'desmotiv', 'deprimi', 'triste', 'mal', 'pésimo',
      'fracas', 'fallad', 'rendid', 'inútil', 'no sirvo'
    ],
    phrases: [
      'no puedo', 'no sirvo', 'soy mala', 'nunca voy a', 'no lo voy a lograr',
      'me rindo', 'para qué', 'no vale la pena', 'ya no quiero'
    ],
    punctuation: ['...'],
  },
};

/**
 * Analyzes message text to detect emotional state
 */
export function detectSentiment(message: string): SentimentAnalysis {
  const normalizedMessage = message.toLowerCase().trim();
  const scores: Record<EmotionalState, { score: number; indicators: string[] }> = {
    anxious: { score: 0, indicators: [] },
    frustrated: { score: 0, indicators: [] },
    confused: { score: 0, indicators: [] },
    motivated: { score: 0, indicators: [] },
    tired: { score: 0, indicators: [] },
    confident: { score: 0, indicators: [] },
    overwhelmed: { score: 0, indicators: [] },
    neutral: { score: 0, indicators: [] },
    excited: { score: 0, indicators: [] },
    discouraged: { score: 0, indicators: [] },
  };

  // Check each emotion pattern
  for (const [emotion, patterns] of Object.entries(SENTIMENT_PATTERNS)) {
    const emotionKey = emotion as EmotionalState;

    // Check keywords
    for (const keyword of patterns.keywords) {
      if (normalizedMessage.includes(keyword)) {
        scores[emotionKey].score += 2;
        scores[emotionKey].indicators.push(keyword);
      }
    }

    // Check phrases (higher weight)
    for (const phrase of patterns.phrases) {
      if (normalizedMessage.includes(phrase)) {
        scores[emotionKey].score += 3;
        scores[emotionKey].indicators.push(`"${phrase}"`);
      }
    }

    // Check punctuation patterns
    for (const punct of patterns.punctuation) {
      if (message.includes(punct)) {
        scores[emotionKey].score += 1;
        scores[emotionKey].indicators.push(punct);
      }
    }
  }

  // Question density (indicates confusion or seeking clarification)
  const questionCount = (message.match(/\?/g) || []).length;
  if (questionCount >= 2) {
    scores.confused.score += questionCount;
    scores.confused.indicators.push(`${questionCount} preguntas`);
  }

  // Message length and complexity (can indicate overwhelm or detailed understanding)
  const wordCount = normalizedMessage.split(/\s+/).length;
  if (wordCount > 50) {
    scores.overwhelmed.score += 1;
  }

  // Find dominant emotion
  const sortedEmotions = Object.entries(scores)
    .filter(([_, data]) => data.score > 0)
    .sort((a, b) => b[1].score - a[1].score);

  if (sortedEmotions.length === 0) {
    return {
      primaryEmotion: 'neutral',
      intensity: 'low',
      confidence: 1.0,
      indicators: [],
      needsBreak: false,
      needsEncouragement: false,
      needsSimplification: false,
    };
  }

  const [primaryEmotion, emotionData] = sortedEmotions[0];
  const totalScore = Object.values(scores).reduce((sum, data) => sum + data.score, 0);
  const confidence = emotionData.score / totalScore;

  // Determine intensity
  let intensity: SentimentIntensity = 'low';
  if (emotionData.score >= 6) intensity = 'high';
  else if (emotionData.score >= 3) intensity = 'medium';

  // Determine action flags
  const needsBreak = ['tired', 'overwhelmed', 'frustrated'].includes(primaryEmotion) && intensity !== 'low';
  const needsEncouragement = ['discouraged', 'frustrated', 'anxious'].includes(primaryEmotion);
  const needsSimplification = ['confused', 'overwhelmed', 'frustrated'].includes(primaryEmotion) && intensity !== 'low';

  return {
    primaryEmotion: primaryEmotion as EmotionalState,
    intensity,
    confidence,
    indicators: emotionData.indicators,
    needsBreak,
    needsEncouragement,
    needsSimplification,
  };
}

/**
 * Tracks emotional patterns over time to identify trends
 */
export class EmotionalTrendTracker {
  private history: Array<{ timestamp: number; sentiment: SentimentAnalysis }> = [];
  private readonly maxHistory = 10; // Keep last 10 interactions

  addSentiment(sentiment: SentimentAnalysis): void {
    this.history.push({
      timestamp: Date.now(),
      sentiment,
    });

    // Keep only recent history
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  /**
   * Detects if student is showing sustained negative emotions
   */
  isShowingSustainedStress(): boolean {
    if (this.history.length < 3) return false;

    const recentEmotions = this.history.slice(-3);
    const negativeEmotions: EmotionalState[] = ['anxious', 'frustrated', 'overwhelmed', 'discouraged'];

    return recentEmotions.every(h => negativeEmotions.includes(h.sentiment.primaryEmotion));
  }

  /**
   * Detects if student has been studying for too long without positive feedback
   */
  needsMotivationalBoost(): boolean {
    if (this.history.length < 4) return false;

    const recent = this.history.slice(-4);
    const positiveEmotions: EmotionalState[] = ['motivated', 'confident', 'excited'];

    return !recent.some(h => positiveEmotions.includes(h.sentiment.primaryEmotion));
  }

  /**
   * Gets the dominant emotional trend
   */
  getDominantTrend(): EmotionalState | null {
    if (this.history.length < 2) return null;

    const emotionCounts = this.history.reduce((acc, { sentiment }) => {
      acc[sentiment.primaryEmotion] = (acc[sentiment.primaryEmotion] || 0) + 1;
      return acc;
    }, {} as Record<EmotionalState, number>);

    const sorted = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1]);
    return sorted[0][0] as EmotionalState;
  }

  /**
   * Clears history (e.g., after a break or session end)
   */
  reset(): void {
    this.history = [];
  }

  getHistory(): Array<{ timestamp: number; sentiment: SentimentAnalysis }> {
    return [...this.history];
  }
}
