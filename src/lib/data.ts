import type { StudyResource, PracticeQuestion, PerformanceData } from './types';

export const studyResources: StudyResource[] = [
  {
    title: 'Bases Biológicas de la Conducta',
    category: 'Fundamentos de Psicología',
    type: 'internal',
    source: 'src/lib/estudio/bases-biologicas.md',
  },
  {
    title: 'Condicionamiento Clásico (Lectura)',
    category: 'Procesos Psicológicos',
    type: 'internal',
    source: 'src/lib/lecturas/condicionamiento-clasico.md',
  },
    {
    title: 'Pensamiento Matemático: Porcentajes',
    category: 'EXANI-II General',
    type: 'internal',
    source: 'src/lib/estudio/pensamiento-matematico-porcentajes.md',
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
  { topic: 'Psicología Cognitiva', correct: 0, incorrect: 0 },
  { topic: 'Psicología Social', correct: 0, incorrect: 0 },
  { topic: 'Bases Biológicas de la Conducta', correct: 0, incorrect: 0 },
  { topic: 'Psicometría', correct: 0, incorrect: 0 },
  { topic: 'EXANI-II', correct: 0, incorrect: 0 }
];
