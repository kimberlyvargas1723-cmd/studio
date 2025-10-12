// src/lib/data.ts
import type { StudyResource, PracticeQuestion, PerformanceData } from './types';

/**
 * A list of available study resources, including internal content and external links.
 */
export const studyResources: StudyResource[] = [
  {
    title: 'Bases Biológicas de la Conducta',
    category: 'Fundamentos de Psicología',
    type: 'internal',
    source: 'bases-biologicas.md',
  },
  {
    title: 'Comprensión Lectora',
    category: 'EXANI-II General',
    type: 'internal',
    source: 'comprension-lectora.md',
  },
  {
    title: 'Condicionamiento Clásico (Lectura)',
    category: 'Procesos Psicológicos',
    type: 'internal',
    source: 'condicionamiento-clasico.md',
  },
  {
    title: 'Pensamiento Matemático: Porcentajes',
    category: 'EXANI-II General',
    type: 'internal',
    source: 'pensamiento-matematico-porcentajes.md',
  },
  {
    title: 'Módulos específicos EXANI-II (Psicología)',
    category: 'UANL Oficial (PDF)',
    type: 'url',
    source: 'https://www.uanl.mx/wp-content/uploads/2022/09/Modulos-especificos-del-EXANI-II_Psicologia-1-1.pdf',
  },
  {
    title: 'Guía para el sustentante EXANI-II (General)',
    category: 'UANL Oficial (PDF)',
    type: 'url',
    source: 'https://www.uanl.mx/wp-content/uploads/2023/02/EXANI-II_Guia-para-el-sustentante_2023_compressed.pdf'
  },
];

/**
 * A set of practice questions for the initial diagnostic quiz.
 */
export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 'bb-01',
    topic: 'Bases Biológicas de la Conducta',
    question: 'Una persona sufre un accidente y su lóbulo frontal resulta dañado. ¿Qué funciones cognitivas se verían más afectadas?',
    options: ['La audición y el lenguaje', 'La visión y el reconocimiento de caras', 'La planificación, toma de decisiones y personalidad', 'El equilibrio y la coordinación motora'],
    correctAnswer: 'La planificación, toma de decisiones y personalidad',
    explanation: 'El lóbulo frontal es conocido como el "centro ejecutivo" del cerebro, responsable de las funciones cognitivas superiores como la planificación, el razonamiento, la resolución de problemas y la regulación de la conducta social.',
  },
  {
    id: 'pd-01',
    topic: 'Psicología del Desarrollo',
    question: 'Según la teoría de Jean Piaget, ¿en qué etapa un niño desarrolla el pensamiento lógico sobre eventos concretos y comprende la conservación?',
    options: ['Etapa Sensoriomotora', 'Etapa Preoperacional', 'Etapa de Operaciones Concretas', 'Etapa de Operaciones Formales'],
    correctAnswer: 'Etapa de Operaciones Concretas',
    explanation: 'La etapa de Operaciones Concretas (aproximadamente de 7 a 11 años) se caracteriza por el desarrollo del pensamiento organizado y racional. La conservación (entender que la cantidad no cambia aunque la forma lo haga) es un hito clave de esta etapa.',
  },
  {
    id: 'pp-01',
    topic: 'Procesos Psicológicos Básicos',
    question: '¿Qué es el condicionamiento clásico?',
    options: [
      'Un aprendizaje basado en las consecuencias de la conducta (refuerzos o castigos).',
      'Un tipo de aprendizaje en el que un estímulo neutro llega a provocar una respuesta tras asociarse con un estímulo que la provoca naturalmente.',
      'El aprendizaje que ocurre al observar las acciones de otros.',
      'La reorganización súbita de la percepción de un problema para encontrar la solución (insight).',
    ],
    correctAnswer: 'Un tipo de aprendizaje en el que un estímulo neutro llega a provocar una respuesta tras asociarse con un estímulo que la provoca naturalmente.',
    explanation: 'Este es el famoso principio descubierto por Ivan Pavlov. El ejemplo clásico es un perro que saliva al oír una campana, porque ha aprendido a asociar la campana (estímulo condicionado) con la comida (estímulo incondicionado).',
  },
  {
    id: 'pm-01',
    topic: 'Psicometría',
    question: 'Si un test de inteligencia se aplica varias veces a la misma persona en condiciones similares y arroja resultados muy parecidos, se dice que el test tiene alta:',
    options: [
        'Validez',
        'Confiabilidad',
        'Sensibilidad',
        'Objetividad',
    ],
    correctAnswer: 'Confiabilidad',
    explanation: 'La confiabilidad (o fiabilidad) se refiere a la consistencia de una medida. Un test es confiable si produce resultados consistentes y estables a lo largo del tiempo y en diferentes aplicaciones.',
  },
  {
    id: 'ex-01',
    topic: 'EXANI-II',
    question: 'En una tienda, una camisa de $400 tiene un descuento del 25%. ¿Cuánto se debe pagar por ella?',
    options: [
        '$100',
        '$300',
        '$325',
        '$375',
    ],
    correctAnswer: '$300',
    explanation: 'El 25% de $400 es (0.25 * 400) = $100. Este es el monto del descuento. El precio final es el precio original menos el descuento: $400 - $100 = $300.',
  }
];

/**
 * The initial state for user performance data, with all scores set to zero.
 */
export const initialPerformance: PerformanceData[] = [
  { topic: 'Bases Biológicas de la Conducta', correct: 0, incorrect: 0 },
  { topic: 'Psicología del Desarrollo', correct: 0, incorrect: 0 },
  { topic: 'Procesos Psicológicos Básicos', correct: 0, incorrect: 0 },
  { topic: 'Psicometría', correct: 0, incorrect: 0 },
  { topic: 'EXANI-II', correct: 0, incorrect: 0 }
];
