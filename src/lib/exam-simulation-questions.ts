// src/lib/exam-simulation-questions.ts
import type { GeneratedQuestion } from './types';

/**
 * @fileoverview
 * Este archivo contiene un banco de preguntas estáticas y realistas, diseñadas
 * para simular el examen de conocimientos EXANI-II para la carrera de Psicología.
 * Las preguntas cubren las áreas temáticas más relevantes, incluyendo:
 * - Fundamentos de Psicología (Bases Biológicas, Procesos Básicos, Desarrollo, Social).
 * - Habilidades Generales del EXANI-II (Comprensión Lectora, Redacción Indirecta, Inglés).
 * - Pensamiento Matemático y Estadística.
 *
 * Estas preguntas se utilizan en la pestaña "Simulacro de Examen" para proporcionar
 * una práctica cronometrada y de formato similar al examen real.
 */
export const examQuestionPool: GeneratedQuestion[] = [
  // --- Bases Biológicas de la Conducta (4) ---
  {
    question: '¿Qué neurotransmisor está principalmente implicado en la regulación del estado de ánimo, el sueño y el apetito?',
    options: ['Dopamina', 'Acetilcolina', 'Serotonina', 'GABA'],
    correctAnswer: 'Serotonina',
    explanation: 'La serotonina es un neurotransmisor clave en la modulación de funciones como el humor, el ciclo sueño-vigilia y la ingesta de alimentos.',
    topic: 'Bases Biológicas de la Conducta',
  },
  {
    question: 'La parte del sistema nervioso autónomo que prepara al cuerpo para la acción en situaciones de estrés ("lucha o huida") es el sistema:',
    options: ['Nervioso Central', 'Somático', 'Parasimpático', 'Simpático'],
    correctAnswer: 'Simpático',
    explanation: 'El sistema nervioso simpático acelera el ritmo cardíaco, aumenta la presión arterial y desvía la sangre a los músculos, preparando al cuerpo para una respuesta de emergencia.',
    topic: 'Bases Biológicas de la Conducta',
  },
   {
    question: '¿Qué estructura cerebral es esencial para la formación de nuevos recuerdos a largo plazo?',
    options: ['Amígdala', 'Hipocampo', 'Tálamo', 'Cerebelo'],
    correctAnswer: 'Hipocampo',
    explanation: 'El hipocampo juega un papel crucial en la consolidación de la información de la memoria a corto plazo a la memoria a largo plazo.',
    topic: 'Bases Biológicas de la Conducta',
  },
  {
    question: 'El área de Broca, ubicada en el lóbulo frontal izquierdo, está fundamentalmente asociada con:',
    options: ['La comprensión del lenguaje', 'La producción del habla', 'El procesamiento visual', 'La memoria espacial'],
    correctAnswer: 'La producción del habla',
    explanation: 'El daño en el área de Broca suele provocar una afasia motora, que dificulta o imposibilita la articulación de palabras y la formación de oraciones.',
    topic: 'Bases Biológicas de la Conducta',
  },

  // --- Procesos Psicológicos Básicos (4) ---
  {
    question: 'En el condicionamiento operante, el refuerzo negativo consiste en:',
    options: ['Presentar un estímulo aversivo para disminuir una conducta.', 'Eliminar un estímulo placentero para disminuir una conducta.', 'Eliminar un estímulo aversivo para aumentar una conducta.', 'Presentar un estímulo placentero para aumentar una conducta.'],
    correctAnswer: 'Eliminar un estímulo aversivo para aumentar una conducta.',
    explanation: 'El refuerzo negativo fortalece una respuesta al eliminar algo desagradable después de que la respuesta ocurre (ej. abrocharse el cinturón para que deje de sonar la alarma).',
    topic: 'Procesos Psicológicos Básicos',
  },
  {
    question: 'La capacidad de mantener y manipular información en la mente por un corto período de tiempo se conoce como:',
    options: ['Memoria semántica', 'Memoria episódica', 'Memoria procedimental', 'Memoria de trabajo (operativa)'],
    correctAnswer: 'Memoria de trabajo (operativa)',
    explanation: 'La memoria de trabajo es un sistema de capacidad limitada que nos permite retener y trabajar con información temporalmente para realizar tareas cognitivas complejas.',
    topic: 'Procesos Psicológicos Básicos',
  },
   {
    question: 'El fenómeno de la "ceguera por falta de atención" demuestra que:',
    options: ['La atención es ilimitada', 'Solo podemos atender a estímulos auditivos', 'Podemos no percibir objetos claramente visibles si nuestra atención está en otra parte', 'La visión periférica es más precisa que la central'],
    correctAnswer: 'Podemos no percibir objetos claramente visibles si nuestra atención está en otra parte',
    explanation: 'Este fenómeno, demostrado en experimentos como el del "gorila invisible", prueba que la atención es un recurso selectivo y limitado.',
    topic: 'Procesos Psicológicos Básicos',
  },
  {
    question: 'La pirámide de Maslow es una teoría sobre:',
    options: ['Las etapas del desarrollo cognitivo', 'Los rasgos de la personalidad', 'La jerarquía de las necesidades humanas', 'Los mecanismos de defensa del yo'],
    correctAnswer: 'La jerarquía de las necesidades humanas',
    explanation: 'Abraham Maslow propuso que las necesidades humanas están organizadas en una jerarquía, desde las fisiológicas básicas hasta la autorrealización.',
    topic: 'Procesos Psicológicos Básicos',
  },
  
  // --- Psicología del Desarrollo y Social (5) ---
  {
    question: 'Según Erik Erikson, la principal crisis psicosocial que enfrenta un adolescente es:',
    options: ['Confianza vs. Desconfianza', 'Iniciativa vs. Culpa', 'Laboriosidad vs. Inferioridad', 'Identidad vs. Confusión de roles'],
    correctAnswer: 'Identidad vs. Confusión de roles',
    explanation: 'Durante la adolescencia, la tarea fundamental es desarrollar un sentido coherente de quién es uno y cuál es su lugar en el mundo.',
    topic: 'Psicología del Desarrollo',
  },
   {
    question: 'El concepto de "permanencia del objeto", desarrollado por Piaget, se adquiere típicamente durante la etapa:',
    options: ['Sensoriomotora', 'Preoperacional', 'De operaciones concretas', 'De operaciones formales'],
    correctAnswer: 'Sensoriomotora',
    explanation: 'La permanencia del objeto es la comprensión de que los objetos continúan existiendo incluso cuando no pueden ser vistos, oídos o tocados, y es un logro clave de la primera etapa del desarrollo.',
    topic: 'Psicología del Desarrollo',
  },
  {
    question: 'El "error fundamental de atribución" es la tendencia a explicar el comportamiento de otras personas basándose más en... que en...:',
    options: ['Factores situacionales; rasgos de personalidad', 'Rasgos de personalidad; factores situacionales', 'El estado de ánimo; la intención', 'La intención; el estado de ánimo'],
    correctAnswer: 'Rasgos de personalidad; factores situacionales',
    explanation: 'Tendemos a sobrestimar la influencia de la personalidad (atribuciones internas) y subestimar la influencia de la situación (atribuciones externas) al juzgar a los demás.',
    topic: 'Psicología Social',
  },
  {
    question: 'El experimento de conformidad de Solomon Asch demostró que las personas a menudo:',
    options: ['Se rebelan contra la autoridad', 'Toman decisiones más arriesgadas en grupo', 'Se ajustan a la opinión mayoritaria del grupo, incluso si es incorrecta', 'Ayudan más a otros cuando están solas'],
    correctAnswer: 'Se ajustan a la opinión mayoritaria del grupo, incluso si es incorrecta',
    explanation: 'Los participantes negaban la evidencia de sus propios ojos para conformarse con las respuestas incorrectas dadas por los cómplices del experimentador.',
    topic: 'Psicología Social',
  },
  {
    question: 'El "efecto espectador" (bystander effect) sugiere que la probabilidad de que alguien ayude a una persona en apuros...',
    options: ['Aumenta con el número de personas presentes', 'Disminuye con el número de personas presentes', 'No se ve afectada por el número de personas', 'Depende únicamente de la personalidad del individuo'],
    correctAnswer: 'Disminuye con el número de personas presentes',
    explanation: 'El efecto espectador ocurre porque la responsabilidad de ayudar se difumina entre todos los presentes, haciendo que cada individuo se sienta menos responsable de actuar.',
    topic: 'Psicología Social',
  },

  // --- Habilidades EXANI-II (Comprensión Lectora, Redacción Indirecta, Inglés) (6) ---
  {
    question: 'Identifica la opción que presenta un error en la concordancia verbal: "La manada de lobos, a pesar del frío, corrían por el bosque".',
    options: ['La manada de lobos', 'a pesar del frío', 'corrían por el bosque', 'No hay error'],
    correctAnswer: 'corrían por el bosque',
    explanation: 'El núcleo del sujeto es "manada" (singular), por lo tanto, el verbo debe ser "corría" para concordar en número.',
    topic: 'Redacción Indirecta',
  },
  {
    question: 'Seleccione el conector que establece una relación de consecuencia en la siguiente frase: "Estudió toda la noche; _____, aprobó el examen con una excelente calificación".',
    options: ['sin embargo', 'aunque', 'por lo tanto', 'además'],
    correctAnswer: 'por lo tanto',
    explanation: '"Por lo tanto" es un conector ilativo o consecutivo que indica que lo que sigue es una consecuencia de lo anterior.',
    topic: 'Redacción Indirecta',
  },
   {
    question: 'Según el contexto, ¿cuál es el significado de la palabra "subrepticiamente" en la frase: "El detective observaba subrepticiamente al sospechoso desde el otro lado de la calle"?',
    options: ['Abiertamente', 'Con enojo', 'De forma oculta y sigilosa', 'Con desinterés'],
    correctAnswer: 'De forma oculta y sigilosa',
    explanation: 'Subrepticio significa que se hace o se toma algo de manera oculta, a escondidas o disimuladamente.',
    topic: 'Comprensión Lectora',
  },
  {
    question: '¿Cuál es el propósito principal de un texto argumentativo?',
    options: ['Narrar una historia', 'Describir un objeto o lugar', 'Informar sobre un hecho de manera objetiva', 'Persuadir o convencer al lector de una opinión'],
    correctAnswer: 'Persuadir o convencer al lector de una opinión',
    explanation: 'El texto argumentativo utiliza razonamientos, pruebas y ejemplos para defender una tesis y convencer al lector de su validez.',
    topic: 'Comprensión Lectora',
  },
  {
    question: 'Elija la opción que reemplace la palabra "cosa" con un término más preciso: "La honestidad es una cosa muy importante en una amistad".',
    options: ['característica', 'cualidad', 'situación', 'herramienta'],
    correctAnswer: 'cualidad',
    explanation: 'Cualidad es el término más preciso para referirse a un rasgo o atributo positivo de una persona o relación, mientras que "cosa" es demasiado vago.',
    topic: 'Redacción Indirecta',
  },
  {
    question: 'In the sentence "The effects of the new policy were immediately apparent," what is the best synonym for "apparent"?',
    options: ['hidden', 'confusing', 'obvious', 'delayed'],
    correctAnswer: 'obvious',
    explanation: '"Apparent" in this context means clearly visible or understood; obvious.',
    topic: 'Inglés',
  },

  // --- Pensamiento Matemático y Psicométrico (8) ---
  {
    question: 'Un coche recorre 240 km con 12 litros de gasolina. ¿Cuántos kilómetros podrá recorrer con 9 litros?',
    options: ['180 km', '200 km', '160 km', '150 km'],
    correctAnswer: '180 km',
    explanation: 'Primero, calculamos el rendimiento: 240 km / 12 litros = 20 km/l. Luego, multiplicamos por los nuevos litros: 20 km/l * 9 litros = 180 km.',
    topic: 'Pensamiento Matemático',
  },
  {
    question: '¿Cuál es el siguiente elemento en la serie: A1, C3, E5, G7, ___?',
    options: ['H8', 'I9', 'H9', 'I8'],
    correctAnswer: 'I9',
    explanation: 'La serie alterna letras saltándose una (A, C, E, G, I) y números impares consecutivos (1, 3, 5, 7, 9).',
    topic: 'Simulacro General',
  },
  {
    question: 'Si el 30% de un número es 45, ¿cuál es el número?',
    options: ['150', '135', '100', '200'],
    correctAnswer: '150',
    explanation: 'Se puede resolver con una regla de tres: Si 45 es el 30%, ¿cuánto (x) es el 100%? x = (45 * 100) / 30 = 150.',
    topic: 'Pensamiento Matemático',
  },
   {
    question: 'En un grupo de 60 estudiantes, 35 tocan la guitarra y 25 tocan el piano. Si 10 estudiantes tocan ambos instrumentos, ¿cuántos no tocan ninguno?',
    options: ['10', '5', '0', '15'],
    correctAnswer: '10',
    explanation: 'Total que toca al menos uno = (Solo Guitarra) + (Solo Piano) + (Ambos) = (35-10) + (25-10) + 10 = 25 + 15 + 10 = 50. Los que no tocan ninguno son 60 - 50 = 10.',
    topic: 'Probabilidad y Estadística',
  },
  {
    question: 'Dedo es a Mano como Hoja es a ___',
    options: ['Árbol', 'Verde', 'Rama', 'Raíz'],
    correctAnswer: 'Rama',
    explanation: 'La analogía es de parte a todo. Un dedo es parte de una mano; una hoja es parte de una rama (y esta a su vez del árbol, pero rama es la conexión más directa).',
    topic: 'Simulacro General',
  },
  {
    question: 'Calcula la media (promedio) de los siguientes números: 10, 15, 20, 25, 30.',
    options: ['15', '25', '20', '18'],
    correctAnswer: '20',
    explanation: 'Se suman todos los valores (10+15+20+25+30 = 100) y se divide entre la cantidad de valores (5). 100 / 5 = 20.',
    topic: 'Probabilidad y Estadística',
  },
   {
    question: 'Una figura es un triángulo. La siguiente es un cuadrado. La siguiente es un pentágono. ¿Qué figura sigue en la secuencia?',
    options: ['Círculo', 'Hexágono', 'Octágono', 'Triángulo'],
    correctAnswer: 'Hexágono',
    explanation: 'La secuencia aumenta el número de lados de la figura en uno cada vez (3, 4, 5, 6).',
    topic: 'Simulacro General',
  },
  {
    question: 'El precio de un producto aumentó de $80 a $100. ¿Cuál fue el porcentaje de aumento?',
    options: ['20%', '25%', '15%', '30%'],
    correctAnswer: '25%',
    explanation: 'El aumento fue de $20. Para encontrar el porcentaje de aumento, se divide el aumento por el precio original y se multiplica por 100: (20 / 80) * 100 = 0.25 * 100 = 25%.',
    topic: 'Pensamiento Matemático',
  },
];
