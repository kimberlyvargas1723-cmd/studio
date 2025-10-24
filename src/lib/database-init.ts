// src/lib/database-init.ts
// ========================================
// PSICOGUÍA - INICIALIZACIÓN DE BASE DE DATOS
// ========================================

import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Question, StudyTopic, Quiz } from './database-types';

/**
 * Datos iniciales para poblar la base de datos
 */
const INITIAL_DATA = {
  topics: [
    {
      id: 'sistema_nervioso',
      title: 'Sistema Nervioso',
      description: 'Estructura y funcionamiento del sistema nervioso humano',
      module: 'psicologia',
      subtopics: [
        'Neuronas y sinapsis',
        'Sistema nervioso central',
        'Sistema nervioso periférico',
        'Funciones principales'
      ],
      difficulty: 'basico',
      estimatedTime: 45,
      prerequisites: [],
      resources: [
        {
          id: 'sn_video_1',
          type: 'video',
          title: 'El Sistema Nervioso - Introducción',
          description: 'Video explicativo básico del sistema nervioso',
          url: 'https://example.com/video-sistema-nervioso',
          duration: 600,
          tags: ['sistema nervioso', 'neuronas', 'basico']
        }
      ]
    },
    {
      id: 'sistema_endocrino',
      title: 'Sistema Endócrino',
      description: 'Glándulas endocrinas y sus hormonas',
      module: 'psicologia',
      subtopics: [
        'Glándulas principales',
        'Hormonas y funciones',
        'Regulación hormonal',
        'Sistema nervioso vs endocrino'
      ],
      difficulty: 'basico',
      estimatedTime: 35,
      prerequisites: [],
      resources: []
    },
    {
      id: 'procesos_psicologicos',
      title: 'Procesos Psicológicos',
      description: 'Memoria, atención, aprendizaje y pensamiento',
      module: 'psicologia',
      subtopics: [
        'Tipos de memoria',
        'Atención y concentración',
        'Estilos de aprendizaje',
        'Pensamiento y resolución de problemas'
      ],
      difficulty: 'intermedio',
      estimatedTime: 60,
      prerequisites: ['sistema_nervioso'],
      resources: []
    },
    {
      id: 'corrientes_psicologicas',
      title: 'Corrientes Psicológicas',
      description: 'Principales escuelas y enfoques en psicología',
      module: 'psicologia',
      subtopics: [
        'Conductismo',
        'Psicoanálisis',
        'Humanismo',
        'Cognitivismo'
      ],
      difficulty: 'intermedio',
      estimatedTime: 75,
      prerequisites: ['procesos_psicologicos'],
      resources: []
    },
    {
      id: 'motivacion_emocion',
      title: 'Motivación y Emoción',
      description: 'Teorías de la motivación y componentes emocionales',
      module: 'psicologia',
      subtopics: [
        'Teorías de la motivación',
        'Jerarquía de necesidades',
        'Componentes de la emoción',
        'Regulación emocional'
      ],
      difficulty: 'avanzado',
      estimatedTime: 55,
      prerequisites: ['procesos_psicologicos'],
      resources: []
    }
  ] as StudyTopic[],

  questions: [
    {
      id: 'q_sn_001',
      topicId: 'sistema_nervioso',
      module: 'psicologia',
      type: 'multiple_choice',
      difficulty: 'facil',
      question: '¿Cuál es la unidad básica del sistema nervioso?',
      options: ['Glándula', 'Neurona', 'Músculo', 'Hueso'],
      correctAnswer: 1,
      explanation: 'La neurona es la célula especializada en transmitir información nerviosa.',
      tags: ['sistema nervioso', 'neuronas', 'basico'],
      timesAnswered: 0,
      successRate: 0,
      createdAt: new Date()
    },
    {
      id: 'q_sn_002',
      topicId: 'sistema_nervioso',
      module: 'psicologia',
      type: 'multiple_choice',
      difficulty: 'medio',
      question: '¿Qué estructura conecta el cerebro con la médula espinal?',
      options: ['Tálamo', 'Tronco encefálico', 'Cerebelo', 'Lóbulo frontal'],
      correctAnswer: 1,
      explanation: 'El tronco encefálico conecta el cerebro con la médula espinal y controla funciones vitales.',
      tags: ['sistema nervioso', 'estructura', 'medio'],
      timesAnswered: 0,
      successRate: 0,
      createdAt: new Date()
    },
    {
      id: 'q_pp_001',
      topicId: 'procesos_psicologicos',
      module: 'psicologia',
      type: 'multiple_choice',
      difficulty: 'medio',
      question: '¿Qué tipo de memoria almacena información temporal para procesamiento inmediato?',
      options: ['Memoria sensorial', 'Memoria de trabajo', 'Memoria episódica', 'Memoria semántica'],
      correctAnswer: 1,
      explanation: 'La memoria de trabajo mantiene información temporalmente para manipularla y usarla.',
      tags: ['procesos psicologicos', 'memoria', 'medio'],
      timesAnswered: 0,
      successRate: 0,
      createdAt: new Date()
    },
    {
      id: 'q_pp_002',
      topicId: 'procesos_psicologicos',
      module: 'psicologia',
      type: 'multiple_choice',
      difficulty: 'facil',
      question: '¿Qué estilo de aprendizaje prefiere el uso de diagramas y visuales?',
      options: ['Auditivo', 'Visual', 'Cinestésico', 'Lectura-escritura'],
      correctAnswer: 1,
      explanation: 'Los estudiantes visuales aprenden mejor con diagramas, gráficos y representaciones visuales.',
      tags: ['procesos psicologicos', 'estilos aprendizaje', 'facil'],
      timesAnswered: 0,
      successRate: 0,
      createdAt: new Date()
    }
  ] as Question[]
};

/**
 * Inicializar la base de datos con datos de muestra
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🚀 Iniciando inicialización de base de datos...');

    // Crear batch para operaciones eficientes
    const batch = writeBatch(db);

    // Inicializar temas
    console.log('📚 Inicializando temas de estudio...');
    for (const topic of INITIAL_DATA.topics) {
      const topicRef = doc(db, 'topics', topic.id);
      batch.set(topicRef, {
        ...topic,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Inicializar preguntas
    console.log('❓ Inicializando banco de preguntas...');
    for (const question of INITIAL_DATA.questions) {
      const questionRef = doc(db, 'questions', question.id);
      batch.set(questionRef, question);
    }

    // Ejecutar batch
    await batch.commit();
    console.log('✅ Base de datos inicializada correctamente');

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
}

/**
 * Crear quiz de muestra para testing
 */
export async function createSampleQuiz(): Promise<string> {
  try {
    const quizId = `quiz_sample_${Date.now()}`;
    const quizRef = doc(db, 'quizzes', quizId);

    const sampleQuiz: Omit<Quiz, 'id' | 'createdAt'> = {
      title: 'Quiz de Prueba - Sistema Nervioso',
      description: 'Quiz de muestra para probar la funcionalidad del sistema',
      topicIds: ['sistema_nervioso'],
      questions: INITIAL_DATA.questions.filter(q => q.topicId === 'sistema_nervioso'),
      timeLimit: 30, // 30 minutos
      passingScore: 70,
      difficulty: 'basico',
      createdBy: 'system',
      isPublic: false,
      attempts: 0,
      averageScore: 0
    };

    await setDoc(quizRef, {
      ...sampleQuiz,
      id: quizId,
      createdAt: new Date()
    });

    console.log(`✅ Quiz de muestra creado: ${quizId}`);
    return quizId;

  } catch (error) {
    console.error('❌ Error creando quiz de muestra:', error);
    throw error;
  }
}

/**
 * Verificar si la base de datos ya está inicializada
 */
export async function isDatabaseInitialized(): Promise<boolean> {
  try {
    // Verificar si existe al menos un tema
    const topicsRef = collection(db, 'topics');
    const topicsSnap = await getDocs(topicsRef);

    return !topicsSnap.empty;
  } catch (error) {
    console.error('Error verificando inicialización:', error);
    return false;
  }
}

export default {
  initializeDatabase,
  createSampleQuiz,
  isDatabaseInitialized,
  INITIAL_DATA
};
