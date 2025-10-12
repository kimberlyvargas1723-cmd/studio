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
    title: 'Procesos Psicológicos Básicos',
    category: 'Fundamentos de Psicología',
    type: 'internal',
    source: 'procesos-psicologicos.md',
  },
  {
    title: 'Psicología del Desarrollo',
    category: 'Fundamentos de Psicología',
    type: 'internal',
    source: 'psicologia-desarrollo.md',
  },
    {
    title: 'Psicología Social',
    category: 'Fundamentos de Psicología',
    type: 'internal',
    source: 'psicologia-social.md',
  },
  {
    title: 'Psicometría: Confiabilidad y Validez',
    category: 'Metodología',
    type: 'internal',
    source: 'psicometria.md',
  },
  {
    title: 'Guía para el Examen Psicométrico UANL',
    category: 'Examen Psicométrico',
    type: 'internal',
    source: 'guia-psicometrico.md',
  },
  {
    title: 'Comprensión Lectora',
    category: 'Habilidades del EXANI-II',
    type: 'internal',
    source: 'comprension-lectora.md',
  },
  {
    title: 'Redacción Indirecta',
    category: 'Habilidades del EXANI-II',
    type: 'internal',
    source: 'redaccion-indirecta.md',
  },
  {
    title: 'Pensamiento Matemático',
    category: 'Habilidades del EXANI-II',
    type: 'internal',
    source: 'pensamiento-matematico.md',
  },
   {
    title: 'Inglés (Diagnóstico)',
    category: 'Habilidades del EXANI-II',
    type: 'internal',
    source: 'ingles.md',
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
    id: 'ps-01',
    topic: 'Psicología Social',
    question: 'El experimento de la prisión de Stanford, de Philip Zimbardo, es un famoso estudio sobre:',
    options: ['La obediencia a la autoridad', 'El poder de los roles sociales y las situaciones', 'La difusión de la responsabilidad', 'La formación de estereotipos'],
    correctAnswer: 'El poder de los roles sociales y las situaciones',
    explanation: 'El experimento demostró cómo personas comunes, al ser asignadas a roles de "prisionero" o "guardia", rápidamente internalizaron esos roles hasta extremos preocupantes, mostrando el poder que tiene la situación para influir en el comportamiento.',
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
    id: 'cl-01',
    topic: 'Comprensión Lectora',
    question: 'En un texto argumentativo, ¿cuál es el propósito principal del autor al presentar datos estadísticos?',
    options: ['Entretener al lector', 'Apelar a las emociones del lector', 'Darle un respaldo objetivo a su tesis', 'Mostrar su amplio conocimiento del tema'],
    correctAnswer: 'Darle un respaldo objetivo a su tesis',
    explanation: 'En un texto argumentativo, los datos, estadísticas y hechos objetivos se utilizan como evidencia para fortalecer la tesis o argumento principal del autor y convencer al lector de su validez.',
  },
  {
    id: 'ri-01',
    topic: 'Redacción Indirecta',
    question: 'Elija la opción que sustituye la palabra subrayada con el término más preciso: "El niño **hizo** un berrinche en la tienda".',
    options: ['realizó', 'ejecutó', 'protagonizó', 'produjo'],
    correctAnswer: 'protagonizó',
    explanation: 'Aunque las otras opciones son verbos de acción, "protagonizó" es la palabra que mejor captura la naturaleza dramática y central del niño en la acción del berrinche, siendo la opción con mayor precisión léxica.',
  },
  {
    id: 'pmat-01',
    topic: 'Pensamiento Matemático',
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
  { topic: 'Procesos Psicológicos Básicos', correct: 0, incorrect: 0 },
  { topic: 'Psicología del Desarrollo', correct: 0, incorrect: 0 },
  { topic: 'Psicología Social', correct: 0, incorrect: 0 },
  { topic: 'Psicometría', correct: 0, incorrect: 0 },
  { topic: 'Examen Psicométrico', correct: 0, incorrect: 0 },
  { topic: 'Comprensión Lectora', correct: 0, incorrect: 0 },
  { topic: 'Redacción Indirecta', correct: 0, incorrect: 0 },
  { topic: 'Pensamiento Matemático', correct: 0, incorrect: 0 },
  { topic: 'Inglés (Diagnóstico)', correct: 0, incorrect: 0 }
];
