import type { StudyResource, PracticeQuestion, PerformanceData } from './types';

export const studyResources: StudyResource[] = [
  {
    title: 'Concurso de Ingreso a Licenciatura (Psicología)',
    url: 'https://psicologia.uanl.mx/tramites/concurso-de-ingreso-a-licenciatura/',
    category: 'General',
  },
  {
    title: 'Concurso de Ingreso a Licenciatura (UANL)',
    url: 'https://www.uanl.mx/tramites/concurso-de-ingreso-a-licenciatura/',
    category: 'General',
  },
  {
    title: 'Guía para el Examen Psicométrico',
    url: 'https://psicologia.uanl.mx/tramites/guia-para-el-examen-psicometrico',
    category: 'Psicometría',
  },
  {
    title: 'Guía para el sustentante EXANI-II',
    url: 'https://www.uanl.mx/wp-content/uploads/2023/02/EXANI-II_Guia-para-el-sustentante_2023_compressed.pdf',
    category: 'EXANI-II',
  },
  {
    title: 'Módulos específicos EXANI-II (Psicología)',
    url: 'https://www.uanl.mx/wp-content/uploads/2022/09/Modulos-especificos-del-EXANI-II_Psicologia-1-1.pdf',
    category: 'Psicología',
  },
  {
    title: 'Profe Autónoma - Facultad de Psicología',
    url: 'https://tuprofeautonoma.com.mx/uanl-facultad-de-psicologia',
    category: 'Recursos Adicionales',
  },
];

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 'ps-01',
    topic: 'Psicología Cognitiva',
    question: '¿Qué teórico propuso la idea de las "inteligencias múltiples"?',
    options: ['Jean Piaget', 'Lev Vygotsky', 'Howard Gardner', 'B.F. Skinner'],
    correctAnswer: 'Howard Gardner',
    explanation: 'Howard Gardner es conocido por su teoría de las inteligencias múltiples, que sugiere que la inteligencia no es una entidad única, sino un conjunto de varias habilidades distintas.',
  },
  {
    id: 'ps-02',
    topic: 'Psicología Social',
    question: 'El experimento de la prisión de Stanford, ¿qué fenómeno psicológico investigaba principalmente?',
    options: [
      'La obediencia a la autoridad',
      'El poder de los roles sociales',
      'El conformismo grupal',
      'La disonancia cognitiva',
    ],
    correctAnswer: 'El poder de los roles sociales',
    explanation: 'El experimento de Philip Zimbardo demostró cómo las personas adoptan rápidamente los roles sociales que se les asignan, incluso si estos roles entran en conflicto con su moral personal.',
  },
  {
    id: 'rd-01',
    topic: 'Comprensión Lectora',
    question: '¿Cuál es el propósito principal de un párrafo de introducción en un ensayo?',
    options: [
      'Resumir todo el texto',
      'Presentar la tesis y el tema principal',
      'Ofrecer ejemplos detallados',
      'Concluir los argumentos',
    ],
    correctAnswer: 'Presentar la tesis y el tema principal',
    explanation: 'La introducción debe captar el interés del lector y establecer claramente el tema que se va a tratar y la postura o argumento principal (tesis).',
  },
  {
    id: 'ma-01',
    topic: 'Pensamiento Matemático',
    question: 'Si un artículo con un precio de $500 tiene un descuento del 20%, ¿cuál es el precio final?',
    options: ['$100', '$480', '$400', '$450'],
    correctAnswer: '$400',
    explanation: 'El descuento es el 20% de $500, que es (0.20 * 500) = $100. El precio final es el precio original menos el descuento: $500 - $100 = $400.',
  },
  {
    id: 'ps-03',
    topic: 'Bases Biológicas de la Conducta',
    question: '¿Qué parte del cerebro está más asociada con la regulación de las emociones como el miedo y la agresión?',
    options: [
        'El hipocampo',
        'El lóbulo frontal',
        'El cerebelo',
        'La amígdala',
    ],
    correctAnswer: 'La amígdala',
    explanation: 'La amígdala, parte del sistema límbico, juega un papel crucial en el procesamiento y la memoria de las reacciones emocionales, especialmente el miedo y la ira.',
  }
];

export const initialPerformance: PerformanceData[] = [
  { topic: 'Psicología Cognitiva', correct: 8, incorrect: 2 },
  { topic: 'Psicología Social', correct: 6, incorrect: 4 },
  { topic: 'Comprensión Lectora', correct: 9, incorrect: 1 },
  { topic: 'Pensamiento Matemático', correct: 5, incorrect: 5 },
  { topic: 'Bases Biológicas de la Conducta', correct: 7, incorrect: 3 },
];
