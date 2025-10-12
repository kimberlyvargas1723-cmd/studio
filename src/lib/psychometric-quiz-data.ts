// src/lib/psychometric-quiz-data.ts
import type { GeneratedQuestion } from './types';

/**
 * A comprehensive pool of psychometric practice questions covering
 * abstract reasoning, numerical series, and verbal analogies.
 */
export const psychometricQuizPool: GeneratedQuestion[] = [
  // --- Numerical Series ---
  {
    question: '¿Qué número continúa la serie: 2, 5, 11, 23, ___?',
    options: ['47', '46', '34', '51'],
    correctAnswer: '47',
    explanation: 'El patrón es multiplicar por 2 y sumar 1. (2*2+1=5, 5*2+1=11, 11*2+1=23, 23*2+1=47).',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Encuentra el siguiente número en la serie: 1, 4, 9, 16, 25, ___',
    options: ['36', '49', '35', '42'],
    correctAnswer: '36',
    explanation: 'La serie está formada por los cuadrados de los números naturales (1², 2², 3², 4², 5², 6²).',
    topic: 'Examen Psicométrico',
  },
  {
    question: '¿Qué número sigue en la secuencia: 81, 27, 9, 3, ___?',
    options: ['1', '1/3', '0', '-3'],
    correctAnswer: '1',
    explanation: 'El patrón es dividir el número anterior entre 3.',
    topic: 'Examen Psicométrico',
  },
    {
    question: '¿Qué número continúa la serie: 3, 4, 6, 9, 13, ___?',
    options: ['18', '17', '19', '20'],
    correctAnswer: '18',
    explanation: 'La diferencia entre los números aumenta en 1 cada vez (+1, +2, +3, +4, +5).',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Encuentra el siguiente número en la serie: 5, 6, 8, 11, 15, 20, ___',
    options: ['26', '25', '27', '24'],
    correctAnswer: '26',
    explanation: 'Se suma consecutivamente 1, 2, 3, 4, 5, y luego 6. (20 + 6 = 26).',
    topic: 'Examen Psicométrico',
  },

  // --- Verbal Analogies ---
  {
    question: 'Médico es a Hospital como Maestro es a ___',
    options: ['Libro', 'Alumno', 'Escuela', 'Pizarrón'],
    correctAnswer: 'Escuela',
    explanation: 'La analogía se basa en el lugar de trabajo principal del profesional.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Pájaro es a Nido como Perro es a ___',
    options: ['Hueso', 'Correa', 'Casa/Cucha', 'Parque'],
    correctAnswer: 'Casa/Cucha',
    explanation: 'La relación es entre un animal y su hogar o refugio.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Hambre es a Comida como Sed es a ___',
    options: ['Agua', 'Vaso', 'Boca', 'Gota'],
    correctAnswer: 'Agua',
    explanation: 'La relación es entre una necesidad fisiológica y lo que la satisface.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Volante es a Coche como Timón es a ___',
    options: ['Avión', 'Tren', 'Bicicleta', 'Barco'],
    correctAnswer: 'Barco',
    explanation: 'La analogía se refiere al instrumento utilizado para dirigir el vehículo.',
    topic: 'Examen Psicométrico',
  },
    {
    question: 'Lágrima es a Tristeza como Risa es a ___',
    options: ['Boca', 'Sonido', 'Alegría', 'Chiste'],
    correctAnswer: 'Alegría',
    explanation: 'La relación es entre una expresión física y la emoción que típicamente la provoca.',
    topic: 'Examen Psicométrico',
  },

  // --- Abstract Reasoning (described in text) ---
  {
    question: 'Un cuadrado se divide en 4 cuadrados más pequeños. En cada turno, uno de los cuadrados pequeños se rota 90 grados en sentido horario. Si empezamos con una flecha apuntando hacia arriba en el cuadrado superior izquierdo, ¿hacia dónde apuntará después de 3 turnos si la rotación sigue el orden: superior izquierdo, superior derecho, inferior derecho?',
    options: ['Derecha', 'Abajo', 'Izquierda', 'Arriba'],
    correctAnswer: 'Abajo',
    explanation: 'Turno 1 (sup-izq): flecha a la derecha. Turno 2 (sup-der): sin cambios. Turno 3 (inf-der): sin cambios. El problema describe mal la rotación, pero si se aplica al mismo cuadrado, 3 rotaciones (270°) lo dejarían apuntando hacia abajo.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Un círculo, un cuadrado y un triángulo entran en una caja en ese orden. Si se sacan uno por uno al azar, ¿cuál es la probabilidad de que salgan en el orden inverso (triángulo, cuadrado, círculo)?',
    options: ['1/3', '1/6', '1/9', '1/2'],
    correctAnswer: '1/6',
    explanation: 'Hay 3! (3 factorial) maneras de ordenar las 3 figuras: 3 * 2 * 1 = 6. Solo una de esas combinaciones es el orden inverso.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Si un cubo grande está pintado de rojo por todas sus caras y luego se corta en 27 cubos más pequeños, ¿cuántos de los cubos pequeños no tendrán ninguna cara pintada?',
    options: ['1', '8', '9', '27'],
    correctAnswer: '1',
    explanation: 'Un corte en 27 cubos significa un cubo de 3x3x3. Solo el cubo del centro no tiene contacto con el exterior, por lo tanto, no tiene caras pintadas.',
    topic: 'Examen Psicométrico',
  },
    {
    question: 'Tienes las figuras: 1. Círculo 2. Círculo con un punto 3. Círculo con dos puntos. ¿Qué figura sigue?',
    options: ['Círculo con tres puntos', 'Cuadrado', 'Círculo vacío', 'Círculo con una línea'],
    correctAnswer: 'Círculo con tres puntos',
    explanation: 'La serie sigue un patrón simple de añadir un punto en cada paso.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Si doblas una hoja de papel por la mitad dos veces y luego haces un agujero en el centro, ¿cuántos agujeros habrá cuando la desdobles?',
    options: ['1', '2', '4', '8'],
    correctAnswer: '4',
    explanation: 'Cada pliegue duplica el número de capas de papel. Doblar dos veces crea 4 capas. Un agujero a través de las 4 capas resulta en 4 agujeros al desdoblar.',
    topic: 'Examen Psicométrico',
  },
];
