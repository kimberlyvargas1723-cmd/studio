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
    question: 'Cuando aprendes algo nuevo y complejo, como la diferencia entre el condicionamiento clásico y el operante, ¿qué prefieres hacer primero?',
    options: [
      { style: 'V', text: 'Ver un diagrama o un video que compare ambos procesos con ejemplos visuales.' },
      { style: 'A', text: 'Escuchar a un profesor o un podcast que lo explique detalladamente.' },
      { style: 'R', text: 'Leer la definición de ambos conceptos en un libro de texto y tomar apuntes.' },
      { style: 'K', text: 'Pensar en un ejemplo real de tu vida para cada tipo de condicionamiento.' },
    ],
  },
  {
    id: 'q2',
    question: 'Al estudiar para un examen de psicología, ¿qué técnica te resulta más efectiva?',
    options: [
      { style: 'V', text: 'Crear mapas mentales de las teorías de la personalidad y usar colores para diferenciar autores.' },
      { style: 'A', text: 'Repetir los conceptos en voz alta o explicárselos a alguien como si fueras el profesor.' },
      { style: 'R', text: 'Hacer resúmenes muy detallados y listas con los puntos clave de cada tema.' },
      { style: 'K', text: 'Hacer muchos exámenes de práctica y aplicar los conceptos a casos hipotéticos.' },
    ],
  },
  {
    id: 'q3',
    question: 'Si tienes que memorizar las partes del cerebro y sus funciones, ¿cómo lo haces más fácilmente?',
    options: [
      { style: 'V', text: 'Asocio cada parte con una imagen o un color en un esquema del cerebro.' },
      { style:- 'A', text: 'Invento una canción o una rima con los nombres y funciones.' },
      { style: 'R', text: 'Escribo una y otra vez cada parte y su función en una lista.' },
      { style: 'K', text: 'Me toco la parte de la cabeza donde se ubicaría aproximadamente cada lóbulo mientras estudio.' },
    ],
  },
    {
    id: 'q4',
    question: 'En una clase sobre trastornos de ansiedad, ¿a qué le prestas más atención?',
    options: [
      { style: 'V', text: 'A las diapositivas con gráficos estadísticos y al lenguaje corporal del ponente.' },
      { style: 'A', text: 'Al tono de voz con el que se describen los casos y a las discusiones en clase.' },
      { style: 'R', text: 'Tomo apuntes detallados de los criterios diagnósticos del DSM-5 que se mencionan.' },
      { style: 'K', text: 'Me imagino cómo se sentiría una persona con ese trastorno en una situación cotidiana.' },
    ],
  },
  {
    id: 'q5',
    question: '¿Qué tipo de recurso de estudio sobre las etapas de Piaget te parecería más útil?',
    options: [
      { style: 'V', text: 'Una línea de tiempo infográfica con dibujos que representen cada etapa.' },
      { style: 'A', text: 'Un podcast donde psicólogos debaten la relevancia actual de la teoría de Piaget.' },
      { style: 'R', text: 'El capítulo original del libro de Piaget donde describe las etapas.' },
      { style: 'K', text: 'Un video de un experimento real con niños en cada una de las etapas.' },
    ],
  },
];
