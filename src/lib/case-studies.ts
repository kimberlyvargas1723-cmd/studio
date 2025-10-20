// src/lib/case-studies.ts
import type { GeneratedQuestion } from './types';

/**
 * @fileoverview
 * Este archivo contiene un banco de "casos de estudio" o mini-escenarios.
 * A diferencia de las preguntas de conocimiento directo, estos casos requieren
 * que el estudiante aplique un concepto teórico para identificar qué está
 * sucediendo en una situación práctica.
 *
 * Cada objeto es una `GeneratedQuestion` para poder ser procesado por el
 * componente de quiz existente, pero su naturaleza es más aplicada.
 */
export const caseStudiesPool: GeneratedQuestion[] = [
  {
    question: 'Un niño ve que su hermano es elogiado por guardar sus juguetes. Al día siguiente, el niño guarda sus propios juguetes por primera vez. Esto es un ejemplo de:',
    options: ['Condicionamiento Clásico', 'Aprendizaje Vicario', 'Refuerzo Negativo', 'Extinción'],
    correctAnswer: 'Aprendizaje Vicario',
    explanation: 'El aprendizaje vicario (u observacional), de Albert Bandura, ocurre cuando un individuo aprende observando las consecuencias de las acciones de otro (el "modelo").',
    topic: 'Aplicación de Conceptos',
  },
  {
    question: 'Una persona tiene un miedo intenso a los ascensores después de quedarse atrapada en uno. Ahora, el simple hecho de ver un edificio alto le genera ansiedad. El edificio alto se ha convertido en un:',
    options: ['Estímulo Incondicionado', 'Respuesta Condicionada', 'Estímulo Condicionado', 'Estímulo Neutro'],
    correctAnswer: 'Estímulo Condicionado',
    explanation: 'Originalmente, el edificio era un estímulo neutro. A través del condicionamiento clásico, se asoció con el estímulo incondicionado (quedarse atrapado), y ahora provoca una respuesta condicionada (ansiedad).',
    topic: 'Aplicación de Conceptos',
  },
    {
    question: 'Un adolescente deja de hacer sus tareas. Sus padres, para motivarlo, le dicen que no podrá usar videojuegos durante una semana. La acción de los padres es un ejemplo de:',
    options: ['Refuerzo Positivo', 'Refuerzo Negativo', 'Castigo Positivo', 'Castigo Negativo'],
    correctAnswer: 'Castigo Negativo',
    explanation: 'Se está retirando un estímulo agradable (videojuegos) con el objetivo de disminuir una conducta no deseada (no hacer tareas). Eso define al castigo negativo.',
    topic: 'Aplicación de Conceptos',
  },
  {
    question: 'Un empleado trabaja horas extra no porque disfrute su trabajo, sino para recibir un bono a fin de mes. Su motivación es principalmente:',
    options: ['Intrínseca', 'Extrínseca', 'Social', 'De Logro'],
    correctAnswer: 'Extrínseca',
    explanation: 'La motivación extrínseca se basa en recibir una recompensa externa (el bono), a diferencia de la intrínseca, que proviene del disfrute de la actividad en sí misma.',
    topic: 'Aplicación de Conceptos',
  },
  {
    question: 'Un estudiante cree firmemente que es "malo para las matemáticas". A pesar de estudiar, se pone muy nervioso en el examen y obtiene una mala calificación, lo que refuerza su creencia. Este ciclo es un ejemplo de:',
    options: ['Disonancia Cognitiva', 'Profecía Autocumplida', 'Sesgo de Confirmación', 'Efecto Halo'],
    correctAnswer: 'Profecía Autocumplida',
    explanation: 'Una profecía autocumplida ocurre cuando una creencia o expectativa (positiva o negativa) sobre una situación influye en nuestro comportamiento de una manera que hace que la expectativa se cumpla.',
    topic: 'Aplicación de Conceptos',
  },
  {
    question: 'Al entrar a una fiesta, te sientes incómodo y crees que "todos me están juzgando". En realidad, la mayoría de la gente está en sus propias conversaciones. Esta tendencia a sobreestimar cuánto los demás notan nuestra apariencia o comportamiento se llama:',
    options: ['Efecto de Falso Consenso', 'Error de Atribución', 'Efecto de Foco de Atención (Spotlight Effect)', 'Pensamiento de Grupo'],
    correctAnswer: 'Efecto de Foco de Atención (Spotlight Effect)',
    explanation: 'El efecto de foco de atención es la tendencia a sentir que somos el centro de atención y que los demás notan nuestras acciones y apariencia mucho más de lo que realmente lo hacen.',
    topic: 'Aplicación de Conceptos',
  },
  {
    question: 'Un niño llora porque su galleta se rompió en dos pedazos, pensando que ahora tiene "menos galleta". Según Piaget, este niño aún no ha desarrollado el concepto de:',
    options: ['Permanencia del Objeto', 'Egocentrismo', 'Conservación', 'Pensamiento Abstracto'],
    correctAnswer: 'Conservación',
    explanation: 'La conservación es la comprensión de que la cantidad de una sustancia no cambia aunque su forma o apariencia se altere. Es una habilidad clave de la etapa de operaciones concretas.',
    topic: 'Aplicación de Conceptos',
  },
  {
    question: 'Una persona que está a dieta se come una caja entera de donas. Luego, se justifica a sí misma diciendo: "Bueno, tuve un día muy estresante y necesitaba un desahogo para poder seguir con la dieta mañana". Este es un mecanismo de defensa llamado:',
    options: ['Proyección', 'Negación', 'Racionalización', 'Sublimación'],
    correctAnswer: 'Racionalización',
    explanation: 'La racionalización es la creación de explicaciones lógicas o socialmente aceptables para un comportamiento que en realidad fue impulsado por motivos inaceptables o irracionales, para así reducir la ansiedad.',
    topic: 'Aplicación de Conceptos',
  },
  {
    question: 'En una reunión, todos los miembros del equipo están de acuerdo con una mala idea propuesta por el líder, porque nadie quiere ser "el que lleve la contraria" y alterar la armonía del grupo. Este fenómeno se conoce como:',
    options: ['Conformidad', 'Obediencia', 'Polarización de Grupo', 'Pensamiento de Grupo (Groupthink)'],
    correctAnswer: 'Pensamiento de Grupo (Groupthink)',
    explanation: 'El groupthink ocurre cuando el deseo de cohesión y unanimidad en un grupo anula la evaluación realista de alternativas, llevando a decisiones irracionales o disfuncionales.',
    topic: 'Aplicación de Conceptos',
  },
    {
    question: 'Un gerente tiende a evaluar a un empleado como excelente en todas las áreas de su trabajo solo porque es muy puntual y carismático. Esta tendencia a que una característica positiva influya en la percepción de todas las demás se llama:',
    options: ['Efecto Halo', 'Sesgo de Autocomplacencia', 'Estereotipo', 'Efecto de Primacía'],
    correctAnswer: 'Efecto Halo',
    explanation: 'El efecto halo es un sesgo cognitivo en el que la impresión general de una persona (o marca, o producto) influye en los sentimientos y pensamientos del observador acerca de las entidades específicas de esa persona.',
    topic: 'Aplicación de Conceptos',
  },
];
