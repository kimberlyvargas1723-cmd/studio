// src/lib/flashcard-decks.ts
import type { GeneratedQuestion } from './types';

/**
 * @fileoverview
 * Este archivo contiene mazos de flashcards pre-hechos. A diferencia de las
 * preguntas de quiz, las flashcards son para la retención activa y se centran
 * en definiciones y conceptos clave.
 */

// Reutilizamos el tipo `GeneratedQuestion` pero lo pensamos como `Flashcard`
// question -> anverso de la tarjeta
// answer -> reverso de la tarjeta
type Flashcard = {
  question: string;
  answer: string;
};

type FlashcardDeck = {
    title: string;
    deck: Flashcard[];
}

export const defaultFlashcardDeck: FlashcardDeck = {
    title: 'Mazo de Fundamentos de Psicología',
    deck: [
    {
        question: '¿Qué es la Serotonina?',
        answer: 'Un neurotransmisor clave en la regulación del estado de ánimo, el sueño y el apetito. Niveles bajos se asocian con la depresión.',
    },
    {
        question: '¿Qué es la Dopamina?',
        answer: 'Un neurotransmisor crucial para el sistema de recompensa y placer del cerebro, asociado con la motivación y las adicciones.',
    },
    {
        question: 'Define el Sistema Nervioso Simpático.',
        answer: 'La parte del sistema nervioso autónomo que prepara al cuerpo para la acción: la respuesta de "lucha o huida".',
    },
    {
        question: 'Define el Sistema Nervioso Parasimpático.',
        answer: 'La parte del sistema nervioso autónomo que calma al cuerpo y conserva energía: la respuesta de "descanso y digestión".',
    },
    {
        question: 'Función principal del Lóbulo Frontal.',
        answer: 'Razonamiento, planificación, toma de decisiones y control de impulsos (el "CEO" del cerebro).',
    },
    {
        question: 'Función principal del Hipocampo.',
        answer: 'Esencial para la formación de nuevos recuerdos a largo plazo.',
    },
    {
        question: 'Función principal de la Amígdala.',
        answer: 'El centro de procesamiento de emociones, especialmente el miedo y la agresión.',
    },
    {
        question: '¿Qué es el Condicionamiento Clásico?',
        answer: 'Un tipo de aprendizaje donde se asocia un estímulo neutro con uno incondicionado para generar una respuesta condicionada (Experimento de Pávlov).',
    },
    {
        question: '¿Qué es el Condicionamiento Operante?',
        answer: 'Un tipo de aprendizaje donde el comportamiento se fortalece o debilita por sus consecuencias (refuerzos o castigos). Asociado con B.F. Skinner.',
    },
    {
        question: 'Define Refuerzo Negativo.',
        answer: 'Aumentar una conducta al eliminar un estímulo aversivo o desagradable. NO es un castigo.',
    },
    {
        question: 'Define la etapa de "Operaciones Formales" de Piaget.',
        answer: 'La etapa final (11+ años) donde se desarrolla la capacidad para el pensamiento abstracto, hipotético y deductivo.',
    },
    {
        question: 'Define la crisis de "Identidad vs. Confusión de Roles" de Erikson.',
        answer: 'La crisis psicosocial de la adolescencia, donde el individuo busca forjar su propio sentido de quién es y a dónde va en la vida.',
    },
    {
        question: '¿Qué es el mecanismo de defensa de "Racionalización"?',
        answer: 'Crear explicaciones lógicas y socialmente aceptables para un comportamiento que en realidad fue impulsado por motivos inaceptables o irracionales.',
    },
    {
        question: '¿Qué son los rasgos del modelo "Big Five" u OCEAN?',
        answer: 'Apertura a la experiencia, Responsabilidad (Conscientiousness), Extraversión, Amabilidad (Agreeableness) y Neuroticismo.',
    },
    {
        question: '¿Qué es el Error Fundamental de Atribución?',
        answer: 'La tendencia a sobreestimar la influencia de la personalidad y subestimar el poder de la situación al explicar el comportamiento de OTRAS personas.',
    },
    ]
};
