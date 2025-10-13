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
    question: '¿Qué número continúa la serie: 2, 5, 11, 23, 47, ___?',
    options: ['95', '94', '93', '101'],
    correctAnswer: '95',
    explanation: 'El patrón es multiplicar por 2 y sumar 1. (2*2+1=5, 5*2+1=11, 11*2+1=23, 23*2+1=47, 47*2+1=95).',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Encuentra el siguiente número en la serie: 1, 1, 2, 3, 5, 8, 13, ___',
    options: ['21', '20', '23', '19'],
    correctAnswer: '21',
    explanation: 'Es la secuencia de Fibonacci, donde cada número es la suma de los dos anteriores (8 + 13 = 21).',
    topic: 'Examen Psicométrico',
  },
  {
    question: '¿Qué número sigue en la secuencia: 100, 99, 96, 91, 84, ___?',
    options: ['75', '77', '79', '81'],
    correctAnswer: '75',
    explanation: 'El patrón es restar números impares consecutivos: 100 (-1) = 99, 99 (-3) = 96, 96 (-5) = 91, 91 (-7) = 84, 84 (-9) = 75.',
    topic: 'Examen Psicométrico',
  },
  {
    question: '¿Qué número sigue en la secuencia: 3, 4, 6, 9, 13, 18, ___?',
    options: ['24', '23', '25', '26'],
    correctAnswer: '24',
    explanation: 'La diferencia entre los números aumenta en 1 cada vez (+1, +2, +3, +4, +5, +6). 18+6=24.',
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
    question: '¿Qué par de números continúa la serie: 4, 8, 6, 12, 10, 20, 18, ___ , ___?',
    options: ['36, 34', '16, 32', '36, 18', '20, 40'],
    correctAnswer: '36, 34',
    explanation: 'Es una serie dual. El primer patrón es `x2` y el segundo es `-2`. (4*2=8, 8-2=6, 6*2=12, 12-2=10, 10*2=20, 20-2=18, 18*2=36, 36-2=34).',
    topic: 'Examen Psicométrico',
  },
  {
    question: '¿Qué número falta en la secuencia: 4, 9, 16, ___, 36, 49?',
    options: ['25', '24', '30', '28'],
    correctAnswer: '25',
    explanation: 'La serie consiste en los cuadrados de números consecutivos, empezando desde 2 (2², 3², 4², 5², 6², 7²). El número que falta es 5², que es 25.',
    topic: 'Examen Psicométrico',
  },
   {
    question: '¿Qué número sigue en la serie: 81, 27, 9, 3, ___?',
    options: ['1', '0', '1/3', '3/2'],
    correctAnswer: '1',
    explanation: 'Cada número es el resultado de dividir el anterior entre 3.',
    topic: 'Examen Psicométrico',
  },
  {
    question: '¿Qué número continúa la secuencia: 2, 6, 12, 20, 30, 42, ___?',
    options: ['56', '52', '60', '64'],
    correctAnswer: '56',
    explanation: 'La diferencia entre los números aumenta en 2 cada vez: +4, +6, +8, +10, +12, ... El siguiente aumento es +14. 42 + 14 = 56.',
    topic: 'Examen Psicométrico',
  },

  // --- Analogías Verbales ---
  {
    question: 'Poema es a Poeta como Partitura es a ___',
    options: ['Música', 'Compositor', 'Instrumento', 'Orquesta'],
    correctAnswer: 'Compositor',
    explanation: 'La analogía es de obra a autor. Un poeta crea un poema; un compositor crea una partitura.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Glándula es a Hormona como Músculo es a ___',
    options: ['Hueso', 'Contracción', 'Proteína', 'Cuerpo'],
    correctAnswer: 'Contracción',
    explanation: 'La relación es de órgano a su principal producto o función. Una glándula produce hormonas; un músculo produce contracción (movimiento).',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Metáfora es a Lenguaje como Algoritmo es a ___',
    options: ['Matemáticas', 'Computadora', 'Programación', 'Problema'],
    correctAnswer: 'Programación',
    explanation: 'La relación es de herramienta/concepto a su campo de aplicación. La metáfora es una herramienta del lenguaje; un algoritmo es una herramienta de la programación.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Telescopio es a Astrónomo como Microscopio es a ___',
    options: ['Científico', 'Laboratorio', 'Biólogo', 'Célula'],
    correctAnswer: 'Biólogo',
    explanation: 'La analogía es de herramienta a profesional que la utiliza típicamente. Un astrónomo usa un telescopio; un biólogo usa un microscopio.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Prólogo es a Libro como Obertura es a ___',
    options: ['Música', 'Ópera', 'Concierto', 'Acto'],
    correctAnswer: 'Ópera',
    explanation: 'La relación es de parte introductoria a la obra completa. Un prólogo introduce un libro; una obertura introduce una ópera.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Evaporación es a Agua como Sublimación es a ___',
    options: ['Gas', 'Hielo', 'Fuego', 'Aire'],
    correctAnswer: 'Hielo',
    explanation: 'La relación es de proceso de cambio de estado al estado inicial de la materia. La evaporación es el paso de líquido (agua) a gas. La sublimación es el paso de sólido (hielo) a gas.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Capítulo es a Novela como Escena es a ___',
    options: ['Teatro', 'Película', 'Actor', 'Obra de teatro'],
    correctAnswer: 'Obra de teatro',
    explanation: 'Un capítulo es una división de una novela. Una escena es una división de una obra de teatro.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Certeza es a Duda como Conocimiento es a ___',
    options: ['Ignorancia', 'Inteligencia', 'Sabiduría', 'Estudio'],
    correctAnswer: 'Ignorancia',
    explanation: 'La relación es de antónimos. Certeza es lo opuesto a Duda. Conocimiento es lo opuesto a Ignorancia.',
    topic: 'Examen Psicométrico',
  },

  // --- Razonamiento Abstracto (descrito en texto) ---
  {
    question: 'Tres amigas, Ana, Berta y Carla, usan sombreros de diferente color (rojo, azul, verde). Ana no tiene el sombrero rojo. Berta no tiene el sombrero rojo ni el azul. ¿De qué color es el sombrero de Carla?',
    options: ['Rojo', 'Verde', 'Azul', 'No se puede saber'],
    correctAnswer: 'Rojo',
    explanation: 'Si Berta no tiene el rojo ni el azul, debe tener el verde. Si Ana no tiene el rojo (y el verde ya está tomado por Berta), debe tener el azul. Por eliminación, Carla debe tener el sombrero rojo.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Un reloj se retrasa 4 minutos cada hora. Si se pone en hora exacta a las 8:00 AM, ¿qué hora marcará cuando en realidad sean las 1:00 PM del mismo día?',
    options: ['12:40 PM', '12:35 PM', '12:45 PM', '12:50 PM'],
    correctAnswer: '12:40 PM',
    explanation: 'De 8:00 AM a 1:00 PM han pasado 5 horas. El reloj se habrá retrasado 5 horas * 4 minutos/hora = 20 minutos. Por lo tanto, en lugar de la 1:00 PM (13:00), marcará las 12:40 PM.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Si todos los psicólogos son analíticos y ninguna persona analítica es impulsiva, ¿qué conclusión es necesariamente cierta?',
    options: ['Ningún psicólogo es impulsivo.', 'Algunos psicólogos son impulsivos.', 'Todos los impulsivos son psicólogos.', 'Ninguna de las anteriores es cierta.'],
    correctAnswer: 'Ningún psicólogo es impulsivo.',
    explanation: 'Es un silogismo lógico. Si A (psicólogos) -> B (analíticos), y B -> no C (no impulsivos), entonces se concluye que A -> no C (Ningún psicólogo es impulsivo).',
    topic: 'Examen Psicométrico',
  },
    {
    question: 'Tienes 5 cajas. La caja A tiene más canicas que la B. La caja C tiene menos que la D. La caja B tiene más que la D. La caja E tiene más que la A. ¿Qué caja tiene menos canicas?',
    options: ['Caja A', 'Caja B', 'Caja C', 'Caja D'],
    correctAnswer: 'Caja C',
    explanation: 'Ordenando la información: E > A > B > D > C. La caja C es la que tiene menos canicas.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Una figura es un círculo dividido en 4. El cuadrante superior derecho está sombreado. En la siguiente figura, el sombreado se mueve un espacio en sentido antihorario. ¿Qué cuadrante estará sombreado en la cuarta figura?',
    options: ['Superior derecho', 'Inferior derecho', 'Superior izquierdo', 'Inferior izquierdo'],
    correctAnswer: 'Inferior derecho',
    explanation: 'Fig 1: Sup-Der. Fig 2: Sup-Izq (movimiento 1). Fig 3: Inf-Izq (movimiento 2). Fig 4: Inf-Der (movimiento 3).',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'En un código secreto, cada letra se sustituye por la que está dos posiciones adelante en el alfabeto. ¿Cómo se escribiría "MENTE"?',
    options: ['OGPVG', 'OGPUG', 'OFPVG', 'NFPUG'],
    correctAnswer: 'OGPVG',
    explanation: 'El patrón es +2 a cada letra. M+2=O, E+2=G, N+2=P, T+2=V, E+2=G. El resultado es OGPVG.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Un padre tiene 30 años y su hijo 3. ¿Dentro de cuántos años la edad del padre será el cuádruple de la edad del hijo?',
    options: ['3 años', '5 años', '6 años', '9 años'],
    correctAnswer: '6 años',
    explanation: 'Sea x los años que pasarán. La ecuación es 30 + x = 4 * (3 + x). Resolviendo: 30 + x = 12 + 4x -> 18 = 3x -> x = 6.',
    topic: 'Examen Psicométrico',
  },
  {
    question: 'Un cuadrado se divide en 9 cuadrados iguales. El cuadrado central se sombrea. Luego, cada uno de los 8 cuadrados restantes se divide en 9, y sus cuadrados centrales se sombrean. ¿Qué figura se describe?',
    options: ['Un círculo', 'Un fractal (Alfombra de Sierpinski)', 'Un tablero de ajedrez', 'Una espiral'],
    correctAnswer: 'Un fractal (Alfombra de Sierpinski)',
    explanation: 'Este proceso de subdivisión y eliminación recursiva es la construcción de un fractal conocido como la Alfombra de Sierpinski.',
    topic: 'Examen Psicométrico',
  },
];
