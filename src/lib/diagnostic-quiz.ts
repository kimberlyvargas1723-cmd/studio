// src/lib/diagnostic-quiz.ts
import type { GeneratedQuiz } from './types';

/**
 * Predefined diagnostic quiz to assess the user's initial knowledge
 * across key areas of the entrance exam.
 */
export const diagnosticQuiz: GeneratedQuiz = {
  title: 'Quiz de Diagnóstico Inicial',
  topic: 'General',
  questions: [
    // Psychology Questions (5)
    {
      question: '¿Qué lóbulo del cerebro es el principal responsable de la planificación, la toma de decisiones y la personalidad?',
      options: ['Lóbulo Parietal', 'Lóbulo Temporal', 'Lóbulo Frontal', 'Lóbulo Occipital'],
      correctAnswer: 'Lóbulo Frontal',
      explanation: 'El lóbulo frontal es considerado el "CEO" del cerebro, encargado de las funciones ejecutivas superiores como planificar y regular la conducta.',
      topic: 'Bases Biológicas de la Conducta',
    },
    {
      question: 'Según la teoría de los "Cinco Grandes", ¿qué rasgo de personalidad se refiere a la tendencia de una persona a ser organizada, cuidadosa y disciplinada?',
      options: ['Apertura a la experiencia', 'Responsabilidad (Conscientiousness)', 'Extroversión', 'Amabilidad (Agreeableness)'],
      correctAnswer: 'Responsabilidad (Conscientiousness)',
      explanation: 'La responsabilidad o "Conscientiousness" es el rasgo que describe a las personas que son metódicas, organizadas y fiables.',
      topic: 'Personalidad',
    },
    {
      question: 'El famoso experimento de Pavlov con perros es un ejemplo de:',
      options: ['Condicionamiento Operante', 'Aprendizaje Observacional', 'Condicionamiento Clásico', 'Aprendizaje Latente'],
      correctAnswer: 'Condicionamiento Clásico',
      explanation: 'El condicionamiento clásico implica asociar un estímulo neutro (la campana) con un estímulo incondicionado (la comida) para provocar una respuesta condicionada (salivación).',
      topic: 'Procesos Psicológicos Básicos',
    },
    {
        question: 'Según la teoría de Jean Piaget, ¿en qué etapa los niños comienzan a pensar lógicamente sobre eventos concretos?',
        options: ['Etapa Sensoriomotora', 'Etapa Preoperacional', 'Etapa de Operaciones Concretas', 'Etapa de Operaciones Formales'],
        correctAnswer: 'Etapa de Operaciones Concretas',
        explanation: 'En la etapa de operaciones concretas (aprox. 7 a 11 años), los niños desarrollan el pensamiento lógico pero aún limitado a situaciones concretas y físicas.',
        topic: 'Psicología del Desarrollo'
    },
    {
        question: 'El experimento de la prisión de Stanford, dirigido por Philip Zimbardo, es un famoso estudio sobre:',
        options: ['La obediencia a la autoridad', 'El poder de los roles sociales', 'La difusión de la responsabilidad', 'La disonancia cognitiva'],
        correctAnswer: 'El poder de los roles sociales',
        explanation: 'El experimento demostró cómo personas comunes, al ser asignadas a roles de prisionero o guardia, internalizaron rápidamente esos roles hasta extremos peligrosos.',
        topic: 'Psicología Social'
    },
    // Reading Comprehension Questions (5)
    {
      question: 'En un texto, la idea principal se define como:',
      options: ['La oración con más palabras', 'El concepto más importante que el autor quiere transmitir', 'El primer párrafo del texto', 'Un ejemplo que apoya un argumento'],
      correctAnswer: 'El concepto más importante que el autor quiere transmitir',
      explanation: 'La idea principal es la tesis o el punto central del texto, aquello que el autor busca comunicar y argumentar primordialmente.',
      topic: 'Comprensión Lectora',
    },
    {
        question: '¿Cuál de las siguientes opciones es un ejemplo de una pregunta que requiere **Redacción Indirecta**?',
        options: ['¿Cuál es la capital de Francia?', 'Corrige la siguiente oración: "El perro corrieron rápido"', 'Selecciona el conector que mejor complete la frase', 'Resume el texto anterior'],
        correctAnswer: 'Selecciona el conector que mejor complete la frase',
        explanation: 'La redacción indirecta evalúa la capacidad de mejorar y dar cohesión a un texto, como al elegir los conectores lógicos adecuados, en lugar de solo corregir errores gramaticales directos.',
        topic: 'Redacción Indirecta',
    },
     {
        question: '¿Cuál de las siguientes palabras es un sinónimo de "inefable"?',
        options: ['Indescriptible', 'Evidente', 'Común', 'Predecible'],
        correctAnswer: 'Indescriptible',
        explanation: 'Inefable se refiere a algo que es tan increíble o grande que no puede ser descrito con palabras.',
        topic: 'Comprensión Lectora',
    },
    {
        question: 'Lee la siguiente frase: "A pesar de la lluvia, el evento se llevó a cabo". El conector "A pesar de" indica una relación de:',
        options: ['Causa', 'Consecuencia', 'Adición', 'Concesión u oposición'],
        correctAnswer: 'Concesión u oposición',
        explanation: 'Los conectores concesivos (como "a pesar de", "aunque", "si bien") introducen una objeción o dificultad a la idea principal, que no impide su cumplimiento.',
        topic: 'Redacción Indirecta',
    },
    {
        question: 'What does the phrase "break a leg" mean?',
        options: ['To wish someone good luck', 'To tell someone to be careful', 'To physically harm someone', 'To end a performance'],
        correctAnswer: 'To wish someone good luck',
        explanation: 'It is a common idiom in the theater world used to wish performers good luck before they go on stage.',
        topic: 'Inglés',
    },
    // Math Questions (5)
    {
      question: 'Si un artículo cuesta $150 y tiene un descuento del 20%, ¿cuál es el precio final?',
      options: ['$120', '$130', '$140', '$100'],
      correctAnswer: '$120',
      explanation: 'El descuento es 150 * 0.20 = $30. El precio final es 150 - 30 = $120.',
      topic: 'Pensamiento Matemático',
    },
    {
        question: 'En una bolsa hay 4 canicas rojas y 6 azules. ¿Cuál es la probabilidad de sacar una canica roja al azar?',
        options: ['4/6', '1/10', '4/10', '6/10'],
        correctAnswer: '4/10',
        explanation: 'La probabilidad se calcula como (casos favorables) / (casos totales). Hay 4 canicas rojas y un total de 10 canicas. Por lo tanto, la probabilidad es 4/10.',
        topic: 'Probabilidad y Estadística',
    },
    {
        question: '¿Cuál es el área de un círculo con un radio de 10 cm? (Usa π ≈ 3.14)',
        options: ['31.4 cm²', '62.8 cm²', '314 cm²', '100 cm²'],
        correctAnswer: '314 cm²',
        explanation: 'La fórmula del área es π * r². Entonces, el área es 3.14 * (10 * 10) = 3.14 * 100 = 314 cm².',
        topic: 'Pensamiento Matemático',
    },
    {
        question: 'Encuentra el siguiente número en la serie: 3, 6, 12, 24, ___',
        options: ['36', '48', '30', '42'],
        correctAnswer: '48',
        explanation: 'El patrón de la serie es multiplicar por 2 cada número para obtener el siguiente (3*2=6, 6*2=12, 12*2=24, 24*2=48).',
        topic: 'Examen Psicométrico',
    },
     {
        question: 'Si un tren viaja a 120 km/h, ¿cuánto tiempo tardará en recorrer 300 km?',
        options: ['2 horas', '2.5 horas', '3 horas', '3.5 horas'],
        correctAnswer: '2.5 horas',
        explanation: 'Tiempo = Distancia / Velocidad. Tiempo = 300 km / 120 km/h = 2.5 horas.',
        topic: 'Pensamiento Matemático',
    },
  ],
};
