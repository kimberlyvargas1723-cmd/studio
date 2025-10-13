// src/lib/flashcard-decks.ts

/**
 * @fileoverview
 * Este archivo contiene una biblioteca de mazos de flashcards pre-hechos.
 * A diferencia de las preguntas de quiz, las flashcards son para la retención activa y se centran
 * en definiciones y conceptos clave. Ahora incluye múltiples mazos especializados.
 */

// Reutilizamos el tipo `GeneratedQuestion` pero lo pensamos como `Flashcard`
// question -> anverso de la tarjeta
// answer -> reverso de la tarjeta
export type Flashcard = {
  question: string;
  answer: string;
};

export type FlashcardDeck = {
    id: string;
    title: string;
    description: string;
    deck: Flashcard[];
}

const fundamentosDeck: FlashcardDeck = {
    id: 'fundamentos',
    title: 'Fundamentos de Psicología',
    description: 'Conceptos clave de Neurociencia, Desarrollo, y Teorías de la Personalidad.',
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

const metodologiaDeck: FlashcardDeck = {
    id: 'metodologia',
    title: 'Metodología y Estadística',
    description: 'Conceptos esenciales sobre investigación, variables y análisis de datos.',
    deck: [
        {
            question: 'Variable Independiente (VI)',
            answer: 'La variable que el investigador manipula o cambia para observar su efecto en otra variable. Es la "causa".'
        },
        {
            question: 'Variable Dependiente (VD)',
            answer: 'La variable que se mide para ver cómo cambia en respuesta a la manipulación de la variable independiente. Es el "efecto".'
        },
        {
            question: 'Investigación Correlacional',
            answer: 'Tipo de investigación que mide la relación entre dos variables, pero NO puede determinar una relación de causa y efecto.'
        },
        {
            question: 'Correlación Positiva',
            answer: 'Una relación en la que dos variables se mueven en la misma dirección: si una aumenta, la otra también.'
        },
        {
            question: 'Correlación Negativa',
            answer: 'Una relación en la que dos variables se mueven en direcciones opuestas: si una aumenta, la otra disminuye.'
        },
        {
            question: 'Grupo de Control',
            answer: 'En un experimento, el grupo que no recibe el tratamiento o la manipulación experimental. Sirve como base de comparación.'
        },
        {
            question: 'Asignación Aleatoria',
            answer: 'Procedimiento que asegura que cada participante tiene la misma oportunidad de ser asignado a cualquier grupo de un experimento.'
        },
        {
            question: 'Significancia Estadística (p < 0.05)',
            answer: 'Indica que es poco probable (menos del 5% de probabilidad) que los resultados de un estudio se deban al azar.'
        }
    ]
};


const exaniSkillsDeck: FlashcardDeck = {
    id: 'exani-skills',
    title: 'Habilidades del EXANI-II',
    description: 'Conceptos clave de Redacción Indirecta y Pensamiento Matemático.',
    deck: [
        {
            question: 'Concordancia Verbal',
            answer: 'La correspondencia en número (singular/plural) y persona entre el núcleo del sujeto y el verbo de una oración.'
        },
        {
            question: 'Uso del Punto y Coma (;)',
            answer: 'Se usa para separar dos oraciones relacionadas que podrían ser independientes, especialmente si ya contienen comas. Es una pausa mayor que la coma.'
        },
        {
            question: 'PEMDAS / Jerarquía de Operaciones',
            answer: 'El orden para resolver operaciones: Paréntesis, Exponentes, Multiplicación/División (de izq. a der.), Adición/Sustracción (de izq. a der.).'
        },
        {
            question: 'Regla de Tres Inversa',
            answer: 'Se aplica cuando dos cantidades tienen una relación inversa (si una aumenta, la otra disminuye). Ej: más trabajadores, menos tiempo.'
        },
        {
            question: 'Mediana',
            answer: 'El valor que se encuentra exactamente en el medio de un conjunto de datos ORDENADO de menor a mayor.'
        },
        {
            question: 'Moda',
            answer: 'El valor que aparece con mayor frecuencia en un conjunto de datos.'
        }
    ]
};

export const allFlashcardDecks: FlashcardDeck[] = [
    fundamentosDeck,
    metodologiaDeck,
    exaniSkillsDeck,
];
