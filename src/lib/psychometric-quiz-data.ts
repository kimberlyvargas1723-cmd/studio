// src/lib/psychometric-quiz-data.ts
import type { GeneratedQuestion } from './types';

/**
 * @fileoverview
 * Proporciona un banco de preguntas estáticas para el examen psicométrico.
 * Estas preguntas están diseñadas para evaluar el razonamiento abstracto,
 * numérico y verbal a través de diferentes tipos de problemas.
 *
 * Los tipos de preguntas incluyen:
 * - **Series Numéricas:** Identificar el patrón en una secuencia de números.
 * - **Analogías Verbales:** Encontrar la relación lógica entre pares de palabras.
 * - **Razonamiento Abstracto:** Resolver problemas lógicos basados en figuras, secuencias o escenarios hipotéticos.
 *
 * Este banco de preguntas se utiliza en la simulación del examen psicométrico
 * para ofrecer una práctica realista y cronometrada.
 */
export const psychometricQuizPool: GeneratedQuestion[] = [
  // --- Series Numéricas ---
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
  {
    question: '¿Qué par de números continúa la serie: 4, 8, 6, 12, 10, 20, ___ , ___?',
    options: ['18, 36', '18, 16', '20, 40', '16, 32'],
    correctAnswer: '18, 36',
    explanation: 'Es una serie dual. El primer patrón es `x2` y el segundo es `-2`. (4*2=8, 8-2=6, 6*2=12, 12-2=10, 10*2=20, 20-2=18, 18*2=36).',
    topic: 'Examen Psicométrico',
  },

  // --- Analogías Verbales ---
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
  {
    question: 'Abogado es a Ley como Médico es a ___',
    options: ['Hospital', 'Medicina', 'Paciente', 'Bisturí'],
    correctAnswer: 'Medicina',
    explanation: 'La relación es entre un profesional y su campo de conocimiento o ciencia que aplica.',
    topic: 'Examen Psicométrico',
  },

  // --- Razonamiento Abstracto (descrito en texto) ---
  {
    question: 'Un cuadrado se divide en 4 cuadrados más pequeños. En cada turno, uno de los cuadrados pequeños se rota 90 grados en sentido horario. Si empezamos con una flecha apuntando hacia arriba en el cuadrado superior izquierdo, ¿hacia dónde apuntará después de 3 turnos si la rotación sigue el orden: superior izquierdo, superior derecho, inferior derecho?',
    options: ['Derecha', 'Abajo', 'Izquierda', 'Arriba'],
    correctAnswer: 'Derecha',
    explanation: 'Turno 1 (sup-izq): La flecha rota 90° y ahora apunta a la DERECHA. Turno 2 (sup-der): Rota el cuadrado superior derecho, la flecha original no se ve afectada. Turno 3 (inf-der): Rota el cuadrado inferior derecho, la flecha original no se ve afectada. Por lo tanto, la flecha sigue apuntando a la derecha.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Un círculo, un cuadrado y un triángulo entran en una caja en ese orden. Si se sacan uno por uno al azar, ¿cuál es la probabilidad de que salgan en el orden inverso (triángulo, cuadrado, círculo)?',
    options: ['1/3', '1/6', '1/9', '1/2'],
    correctAnswer: '1/6',
    explanation: 'Hay 3! (3 factorial) maneras de ordenar las 3 figuras: 3 * 2 * 1 = 6. Solo una de esas 6 combinaciones posibles es el orden inverso exacto.',
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
  {
    question: 'Una secuencia de figuras muestra un reloj. La primera marca las 3:00. La segunda marca las 3:45. La tercera marca las 4:30. ¿Qué hora marcará la cuarta figura?',
    options: ['5:00', '5:15', '5:30', '6:00'],
    correctAnswer: '5:15',
    explanation: 'La secuencia avanza en intervalos de 45 minutos. (3:00 + 45min = 3:45; 3:45 + 45min = 4:30; 4:30 + 45min = 5:15).',
    topic: 'Examen Psicométrico',
  },
];
