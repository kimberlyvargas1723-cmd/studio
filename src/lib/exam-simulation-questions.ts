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
  // --- Bases Biológicas de la Conducta ---
  {
    question: '¿Qué neurotransmisor está principalmente implicado en la regulación del estado de ánimo, el sueño y el apetito, y es el objetivo de muchos fármacos antidepresivos como los ISRS?',
    options: ['Dopamina', 'Acetilcolina', 'Serotonina', 'GABA'],
    correctAnswer: 'Serotonina',
    explanation: 'La serotonina es un neurotransmisor clave en la modulación de funciones como el humor y el ciclo sueño-vigilia. Los Inhibidores Selectivos de la Recaptación de Serotonina (ISRS) son una clase común de antidepresivos.',
    topic: 'Bases Biológicas de la Conducta',
  },
  {
    question: 'La parte del sistema nervioso autónomo que se activa para calmar al cuerpo después de una situación de estrés ("descansar y digerir") es el sistema:',
    options: ['Nervioso Central', 'Somático', 'Parasimpático', 'Simpático'],
    correctAnswer: 'Parasimpático',
    explanation: 'El sistema nervioso parasimpático disminuye el ritmo cardíaco y activa la digestión, devolviendo al cuerpo a un estado de homeostasis después de la respuesta de "lucha o huida" del sistema simpático.',
    topic: 'Bases Biológicas de la Conducta',
  },
   {
    question: 'Una lesión en la amígdala cerebral probablemente resultaría en dificultades para:',
    options: ['Formar nuevos recuerdos', 'Procesar emociones, especialmente el miedo', 'Mantener el equilibrio y la coordinación', 'Comprender el lenguaje hablado'],
    correctAnswer: 'Procesar emociones, especialmente el miedo',
    explanation: 'La amígdala es una estructura clave del sistema límbico, fundamental para el procesamiento de las respuestas emocionales, sobre todo el miedo y la agresión.',
    topic: 'Bases Biológicas de la Conducta',
  },
  {
    question: 'El área de Wernicke, crucial para la comprensión del lenguaje, se encuentra predominantemente en el lóbulo:',
    options: ['Frontal', 'Parietal', 'Occipital', 'Temporal'],
    correctAnswer: 'Temporal',
    explanation: 'El área de Wernicke se ubica en el lóbulo temporal izquierdo y su función principal es la decodificación y comprensión del lenguaje tanto hablado como escrito.',
    topic: 'Bases Biológicas de la Conducta',
  },

  // --- Procesos Psicológicos Básicos ---
  {
    question: 'En el condicionamiento operante, el castigo negativo se define como:',
    options: ['Presentar un estímulo aversivo para disminuir una conducta.', 'Eliminar un estímulo placentero para disminuir una conducta.', 'Eliminar un estímulo aversivo para aumentar una conducta.', 'Presentar un estímulo placentero para aumentar una conducta.'],
    correctAnswer: 'Eliminar un estímulo placentero para disminuir una conducta.',
    explanation: 'El castigo negativo busca reducir la probabilidad de una conducta retirando un estímulo deseado o agradable. Por ejemplo, quitarle el celular a un adolescente por malas calificaciones.',
    topic: 'Procesos Psicológicos Básicos',
  },
  {
    question: 'La memoria episódica es un tipo de memoria a largo plazo que almacena:',
    options: ['Hechos y conocimiento general del mundo', 'Habilidades motoras y procedimientos', 'Experiencias personales y eventos autobiográficos', 'Información sensorial por un breve instante'],
    correctAnswer: 'Experiencias personales y eventos autobiográficos',
    explanation: 'La memoria episódica es nuestro "álbum de recortes" mental, donde guardamos los recuerdos de eventos específicos que nos ocurrieron, como el primer día de clases o unas vacaciones.',
    topic: 'Procesos Psicológicos Básicos',
  },
   {
    question: 'El concepto de "disonancia cognitiva" de Leon Festinger se refiere al malestar que una persona experimenta cuando:',
    options: ['No puede recordar información importante', 'Tiene dos o más creencias o actitudes contradictorias', 'Su grupo social no está de acuerdo con ella', 'Recibe un refuerzo intermitente por su conducta'],
    correctAnswer: 'Tiene dos o más creencias o actitudes contradictorias',
    explanation: 'La disonancia cognitiva es la tensión interna que surge al mantener dos ideas, creencias, o valores en conflicto, o cuando nuestra conducta contradice nuestras creencias.',
    topic: 'Procesos Psicológicos Básicos',
  },
  {
    question: 'Según la teoría de la autodeterminación, ¿cuáles son las tres necesidades psicológicas básicas que fomentan la motivación intrínseca?',
    options: ['Poder, afiliación y logro', 'Supervivencia, seguridad y amor', 'Autonomía, competencia y relación', 'Estima, autorrealización y pertenencia'],
    correctAnswer: 'Autonomía, competencia y relación',
    explanation: 'La teoría de la autodeterminación postula que la motivación y el bienestar óptimos se alcanzan cuando se satisfacen las necesidades de autonomía (sentirse libre), competencia (sentirse capaz) y relación (sentirse conectado a otros).',
    topic: 'Procesos Psicológicos Básicos',
  },
  
  // --- Psicología del Desarrollo y Social ---
  {
    question: 'Según la teoría del apego de John Bowlby, un niño con apego seguro muestra la siguiente conducta en el experimento de la "Situación Extraña":',
    options: ['Ignora a la madre cuando regresa', 'Se muestra muy angustiado cuando la madre se va y la rechaza a su regreso', 'Usa a la madre como una base segura para explorar y se consuela fácilmente a su regreso', 'No muestra ninguna diferencia de comportamiento si la madre está o no'],
    correctAnswer: 'Usa a la madre como una base segura para explorar y se consuela fácilmente a su regreso',
    explanation: 'Los niños con apego seguro exploran con confianza en presencia de su cuidador, muestran angustia moderada cuando se va, y buscan el contacto y se calman rápidamente a su regreso.',
    topic: 'Psicología del Desarrollo',
  },
   {
    question: 'Un niño observa que su hermano mayor es castigado por tomar una galleta sin permiso. Como resultado, el niño decide no tomar una galleta. Este es un ejemplo de:',
    options: ['Condicionamiento clásico', 'Refuerzo negativo', 'Aprendizaje vicario u observacional', 'Extinción de la conducta'],
    correctAnswer: 'Aprendizaje vicario u observacional',
    explanation: 'El aprendizaje vicario, concepto clave de la teoría del aprendizaje social de Albert Bandura, implica aprender al observar las consecuencias de las acciones de otros.',
    topic: 'Psicología del Desarrollo',
  },
  {
    question: 'El pensamiento de grupo (groupthink) es un fenómeno que ocurre cuando el deseo de armonía en un grupo de toma de decisiones...',
    options: ['...lleva a una evaluación más crítica de las alternativas.', '...anula la evaluación realista de cursos de acción alternativos.', '...fomenta la expresión de opiniones disidentes.', '...mejora la calidad final de la decisión.'],
    correctAnswer: '...anula la evaluación realista de cursos de acción alternativos.',
    explanation: 'El "groupthink" es una forma disfuncional de toma de decisiones donde los miembros del grupo suprimen sus dudas y desacuerdos para mantener la cohesión, lo que a menudo conduce a malas decisiones.',
    topic: 'Psicología Social',
  },
  {
    question: 'El "efecto de mera exposición" postula que, en general, las personas tienden a desarrollar una preferencia por estímulos simplemente porque...',
    options: ['...son nuevos y emocionantes.', '...son complejos y desafiantes.', '...están familiarizados con ellos.', '...son recomendados por una autoridad.'],
    correctAnswer: '...están familiarizados con ellos.',
    explanation: 'Este efecto psicológico describe nuestra tendencia a que nos guste más algo simplemente porque lo hemos visto o hemos estado expuestos a ello repetidamente.',
    topic: 'Psicología Social',
  },
  {
    question: '¿Cuál de las siguientes opciones describe mejor el "sesgo de autocomplacencia" (self-serving bias)?',
    options: ['La tendencia a culpar a otros por nuestros fracasos.', 'La tendencia a atribuir nuestros éxitos a factores internos y nuestros fracasos a factores externos.', 'La tendencia a sobreestimar nuestras propias habilidades.', 'La tendencia a recordar mejor la información que nos favorece.'],
    correctAnswer: 'La tendencia a atribuir nuestros éxitos a factores internos y nuestros fracasos a factores externos.',
    explanation: 'Es un mecanismo de protección del ego. Si sacamos un 10, es porque "soy inteligente" (factor interno). Si reprobamos, es porque "el examen era muy difícil" (factor externo).',
    topic: 'Psicología Social',
  },

  // --- Habilidades EXANI-II (Comprensión Lectora, Redacción Indirecta, Inglés) ---
  {
    question: '¿Qué opción sustituye la palabra subrayada por un sinónimo sin cambiar el sentido de la frase: "Fue una decisión _inopinada_ que sorprendió a todos"?',
    options: ['esperada', 'consultada', 'polémica', 'inesperada'],
    correctAnswer: 'inesperada',
    explanation: 'Inopinado significa que ocurre sin haber pensado en ello o sin esperarlo. Inesperado es el sinónimo perfecto.',
    topic: 'Redacción Indirecta',
  },
  {
    question: 'Seleccione la opción que utiliza correctamente el punto y coma (;):',
    options: ['La chaqueta es azul; los pantalones, grises.', 'La chaqueta es azul; y los pantalones son grises.', 'La chaqueta; es azul, los pantalones grises.', 'La chaqueta es azul, los pantalones; grises.'],
    correctAnswer: 'La chaqueta es azul; los pantalones, grises.',
    explanation: 'Se usa el punto y coma para separar dos oraciones yuxtapuestas (independientes pero relacionadas). En la segunda oración, la coma sustituye al verbo "son" (elipsis).',
    topic: 'Redacción Indirecta',
  },
   {
    question: 'Basado en el fragmento: "El positivismo, corriente filosófica iniciada por Auguste Comte, postula que el único conocimiento auténtico es el conocimiento científico, y que tal conocimiento solamente puede surgir de la afirmación de las teorías a través del método científico." ¿Qué se puede inferir sobre el positivismo?',
    options: ['Valora la especulación metafísica.', 'Considera la intuición como una fuente válida de conocimiento.', 'Rechaza cualquier conocimiento que no sea empíricamente verificable.', 'Fue desarrollado principalmente en el siglo XXI.'],
    correctAnswer: 'Rechaza cualquier conocimiento que no sea empíricamente verificable.',
    explanation: 'La frase "el único conocimiento auténtico es el científico" y que debe surgir del "método científico" implica que cualquier otra forma de conocimiento (metafísica, intuición) es descartada.',
    topic: 'Comprensión Lectora',
  },
  {
    question: 'Identifique el tipo de relación que guardan las siguientes dos frases: 1. Aumentó la inversión en educación. 2. Mejoraron los índices de alfabetización del país.',
    options: ['Causa - Efecto', 'Contraste', 'Comparación', 'Ejemplificación'],
    correctAnswer: 'Causa - Efecto',
    explanation: 'El aumento de la inversión (causa) tuvo como consecuencia o resultado la mejora de los índices de alfabetización (efecto).',
    topic: 'Comprensión Lectora',
  },
  {
    question: 'Elija la opción con la ortografía correcta: "El conferencista hizo ____ en la importancia de la _____.',
    options: ['énfasis - coheción', 'énfasis - cohesión', 'enfasis - coheción', 'enfasis - cohesión'],
    correctAnswer: 'énfasis - cohesión',
    explanation: '"Énfasis" es una palabra esdrújula y siempre lleva tilde. "Cohesión" se escribe con "h" intermedia y "s".',
    topic: 'Redacción Indirecta',
  },
  {
    question: 'The report highlighted the company\'s need to ____ its strategy to cope with the new market trends. Which word best fits the blank?',
    options: ['adapt', 'adopt', 'adept', 'addict'],
    correctAnswer: 'adapt',
    explanation: 'To "adapt" means to modify or adjust something for a new purpose or situation. "Adopt" means to take up or start to use. "Adept" is an adjective meaning skilled. "Addict" is a noun or verb related to addiction.',
    topic: 'Inglés',
  },

  // --- Pensamiento Matemático y Psicométrico ---
  {
    question: 'Un producto cuesta $500. Si se le aplica un descuento del 20% y luego al nuevo precio se le agrega el 16% de IVA, ¿cuál es el precio final?',
    options: ['$464', '$480', '$500', '$456'],
    correctAnswer: '$464',
    explanation: '1. Descuento: $500 * 0.20 = $100. Precio con descuento: $500 - $100 = $400. 2. IVA: $400 * 0.16 = $64. Precio final: $400 + $64 = $464.',
    topic: 'Pensamiento Matemático',
  },
  {
    question: '¿Cuál es el siguiente elemento en la serie: F2, G3, H5, J8, M13, ___?',
    options: ['P21', 'R21', 'P20', 'R20'],
    correctAnswer: 'R21',
    explanation: 'Son dos series combinadas. Números: La secuencia de Fibonacci (2, 3, 5, 8, 13, 21). Letras: El número de letras que se saltan sigue la secuencia de Fibonacci (F->G (0), G->H (0), H->J (1), J->M (2), M->R (4 -> 1+2+1)).',
    topic: 'Simulacro General',
  },
  {
    question: 'En un corral hay conejos y gallinas. Si se cuentan 35 cabezas y 94 patas, ¿cuántos conejos hay?',
    options: ['12', '15', '23', '10'],
    correctAnswer: '12',
    explanation: 'Es un sistema de ecuaciones. c + g = 35; 4c + 2g = 94. Despejando g = 35 - c. Sustituyendo: 4c + 2(35 - c) = 94 -> 4c + 70 - 2c = 94 -> 2c = 24 -> c = 12.',
    topic: 'Pensamiento Matemático',
  },
   {
    question: 'En una urna hay 4 bolas rojas, 5 azules y 1 verde. ¿Cuál es la probabilidad de sacar una bola roja o una bola verde?',
    options: ['1/2', '1/10', '4/10', '9/10'],
    correctAnswer: '1/2',
    explanation: 'La probabilidad de eventos mutuamente excluyentes se suma. P(Roja) = 4/10. P(Verde) = 1/10. P(Roja o Verde) = 4/10 + 1/10 = 5/10 = 1/2.',
    topic: 'Probabilidad y Estadística',
  },
  {
    question: 'Silla es a Madera como Ventana es a ___',
    options: ['Casa', 'Transparente', 'Vidrio', 'Cortina'],
    correctAnswer: 'Vidrio',
    explanation: 'La analogía es de objeto a su material principal constituyente. Una silla está hecha de madera; una ventana está hecha de vidrio.',
    topic: 'Simulacro General',
  },
  {
    question: 'El promedio de 5 números es 40. Si se retiran dos de esos números, cuyo promedio es 35, ¿cuál es el promedio de los 3 números restantes?',
    options: ['45', '43.33', '50', '40'],
    correctAnswer: '43.33',
    explanation: 'Suma original: 5 * 40 = 200. Suma de los números retirados: 2 * 35 = 70. Suma de los restantes: 200 - 70 = 130. Promedio de los restantes: 130 / 3 = 43.33.',
    topic: 'Probabilidad y Estadística',
  },
   {
    question: 'Una figura es un triángulo que apunta hacia arriba. La siguiente es el mismo triángulo apuntando a la derecha. La siguiente hacia abajo. ¿Hacia dónde apunta la siguiente figura?',
    options: ['Derecha', 'Arriba', 'Abajo', 'Izquierda'],
    correctAnswer: 'Izquierda',
    explanation: 'La figura rota 90 grados en sentido horario en cada paso. Arriba -> Derecha -> Abajo -> Izquierda.',
    topic: 'Simulacro General',
  },
  {
    question: 'Si tardo 3 horas en pintar una pared de 2x2 metros. ¿Cuánto tardaré en pintar una pared de 4x4 metros si mantengo el mismo ritmo?',
    options: ['6 horas', '9 horas', '12 horas', '24 horas'],
    correctAnswer: '12 horas',
    explanation: 'El área de la primera pared es 2*2 = 4 m². El área de la segunda es 4*4 = 16 m². El área es 4 veces mayor. Por lo tanto, tardaré 4 veces más tiempo: 3 horas * 4 = 12 horas.',
    topic: 'Pensamiento Matemático',
  },
];
