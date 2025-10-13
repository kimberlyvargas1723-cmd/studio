// src/lib/learning-style-quiz.ts
import type { LearningStyleQuestion } from './types';

/**
 * @fileoverview
 * Contiene el banco de preguntas para el cuestionario de estilo de aprendizaje VARK.
 * Este cuestionario se utiliza para determinar el estilo de aprendizaje dominante
 * de un usuario, que puede ser Visual (V), Auditivo (A), Lectoescritor (R) o Kinestésico (K).
 *
 * Cada objeto de pregunta contiene:
 * - `id`: Un identificador único para la pregunta.
 * - `question`: El texto de la pregunta que se mostrará al usuario.
 * - `options`: Un array de 4 opciones, cada una asociada a un estilo VARK.
 */
export const learningStyleQuiz: LearningStyleQuestion[] = [
  {
    id: 'q1',
    question: 'Cuando aprendes algo nuevo y complejo, ¿qué prefieres hacer primero?',
    options: [
      { style: 'V', text: 'Ver un diagrama o un video que lo explique.' },
      { style: 'A', text: 'Escuchar a un experto hablar sobre el tema.' },
      { style: 'R', text: 'Leer un artículo o un manual detallado.' },
      { style: 'K', text: 'Intentar hacerlo yo misma, experimentar directamente.' },
    ],
  },
  {
    id: 'q2',
    question: 'Al estudiar para un examen, ¿qué técnica te resulta más efectiva?',
    options: [
      { style: 'V', text: 'Crear mapas mentales y usar colores en mis apuntes.' },
      { style: 'A', text: 'Repetir los conceptos en voz alta o explicárselos a alguien.' },
      { style: 'R', text: 'Hacer resúmenes y listas de los puntos clave.' },
      { style: 'K', text: 'Hacer exámenes de práctica y aplicar los conocimientos.' },
    ],
  },
  {
    id: 'q3',
    question: 'Si tienes que recordar una lista de compras, ¿cómo lo haces más fácilmente?',
    options: [
      { style: 'V', text: 'Visualizo los productos en los pasillos del supermercado.' },
      { style: 'A', text: 'Repito la lista en mi cabeza como una canción.' },
      { style: 'R', text: 'La escribo en un papel o en el móvil.' },
      { style: 'K', text: 'Camino por mi casa y agarro objetos que me recuerden lo que necesito.' },
    ],
  },
    {
    id: 'q4',
    question: 'En una clase o conferencia, ¿a qué le prestas más atención?',
    options: [
      { style: 'V', text: 'A las diapositivas, gráficos y lenguaje corporal del ponente.' },
      { style: 'A', text: 'Al tono de voz, las anécdotas y las discusiones.' },
      { style: 'R', text: 'Tomo apuntes detallados de todo lo que se dice.' },
      { style: 'K', text: 'Me siento inquieta si solo escucho y prefiero participar o hacer algo.' },
    ],
  },
  {
    id: 'q5',
    question: '¿Qué tipo de recurso de estudio te parece más útil?',
    options: [
      { style: 'V', text: 'Infografías, documentales y videos explicativos.' },
      { style: 'A', text: 'Podcasts, audiolibros y debates grabados.' },
      { style: 'R', text: 'Libros de texto, artículos de investigación y glosarios.' },
      { style: 'K', text: 'Simuladores, experimentos y casos prácticos.' },
    ],
  },
];
