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
      question: '¿Qué estructura del sistema límbico está más directamente relacionada con la formación de nuevos recuerdos a largo plazo?',
      options: ['Amígdala', 'Hipotálamo', 'Tálamo', 'Hipocampo'],
      correctAnswer: 'Hipocampo',
      explanation: 'El hipocampo es crucial para la consolidación de la información de la memoria a corto plazo a la memoria a largo plazo.',
      topic: 'Bases Biológicas de la Conducta',
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
        question: '¿Qué es una inferencia?',
        options: ['Encontrar información que está escrita directamente en el texto', 'Un resumen de todo el texto', 'Una conclusión a la que se llega basándose en la evidencia del texto y el razonamiento', 'La opinión personal del lector sobre el tema'],
        correctAnswer: 'Una conclusión a la que se llega basándose en la evidencia del texto y el razonamiento',
        explanation: 'Inferir es "leer entre líneas", es decir, deducir algo que no está explícitamente dicho pero que se sugiere en el texto.',
        topic: 'Comprensión Lectora',
    },
    {
        question: 'Si un autor utiliza un lenguaje predominantemente emotivo y subjetivo, ¿cuál es probablemente su propósito?',
        options: ['Informar de manera objetiva', 'Entretener con una historia', 'Persuadir al lector para que adopte su punto de vista', 'Describir un proceso científico'],
        correctAnswer: 'Persuadir al lector para que adopte su punto de vista',
        explanation: 'El uso de lenguaje cargado de emoción es una técnica retórica común para apelar a los sentimientos del lector y convencerlo de una opinión.',
        topic: 'Comprensión Lectora',
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
        topic: 'Comprensión Lectora',
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
        question: 'Resuelve la siguiente ecuación para x: 3x + 5 = 20',
        options: ['x = 3', 'x = 5', 'x = 7', 'x = 10'],
        correctAnswer: 'x = 5',
        explanation: 'Para resolver, resta 5 de ambos lados (3x = 15) y luego divide entre 3 (x = 5).',
        topic: 'Pensamiento Matemático',
    },
    {
        question: '¿Cuál es el área de un círculo con un radio de 10 cm? (Usa π ≈ 3.14)',
        options: ['31.4 cm²', '62.8 cm²', '314 cm²', '100 cm²'],
        correctAnswer: '314 cm²',
        explanation: 'La fórmula del área es π * r². Entonces, el área es 3.14 * (10 * 10) = 3.14 * 100 = 314 cm².',
        topic: 'Pensamiento Matemático',
    },
    {
        question: 'En una clase hay 15 hombres y 25 mujeres. ¿Qué porcentaje de la clase son hombres?',
        options: ['37.5%', '40%', '60%', '15%'],
        correctAnswer: '37.5%',
        explanation: 'El número total de estudiantes es 15 + 25 = 40. El porcentaje de hombres es (15 / 40) * 100 = 0.375 * 100 = 37.5%.',
        topic: 'Pensamiento Matemático',
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
