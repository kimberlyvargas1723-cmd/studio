// src/lib/data-loader.ts
// ========================================
// PSICOGUÍA - CARGA DE DATOS JSON
// ========================================

import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Question } from './database-types';

// Importar datos JSON
import examenPsicometrico2024 from '../data/examen-psicometrico-completo-2024.json';
import examenConocimientos2024 from '../data/examen-conocimientos-completo-psicologia-2024.json';
import bancoPreguntas from '../data/banco-completo-preguntas-psicologia-uanl-2024.json';
import infoAdmision from '../data/informacion-completa-admision-psicologia-uanl-2024.json';

/**
 * Cargar preguntas desde archivos JSON a Firestore
 */
export async function loadQuestionsFromJSON(): Promise<void> {
  try {
    console.log('📥 Iniciando carga de preguntas desde JSON...');

    const batch = writeBatch(db);
    let questionCount = 0;

    // Cargar preguntas del examen psicométrico
    if (examenPsicometrico2024.secciones) {
      for (const seccion of examenPsicometrico2024.secciones) {
        for (const pregunta of seccion.preguntas) {
          const questionId = `psicometrico_${pregunta.id}`;
          const questionRef = doc(db, 'questions', questionId);

          const questionData: Question = {
            id: questionId,
            topicId: seccion.titulo.toLowerCase().replace(/\s+/g, '_'),
            module: 'psicometrico',
            type: 'multiple_choice',
            difficulty: 'medio',
            question: pregunta.pregunta,
            options: pregunta.opciones,
            correctAnswer: pregunta.respuesta_correcta,
            explanation: pregunta.explicacion,
            tags: [seccion.titulo, 'psicometrico', examenPsicometrico2024.fecha],
            timesAnswered: 0,
            successRate: 0,
            createdAt: new Date()
          };

          batch.set(questionRef, questionData);
          questionCount++;
        }
      }
    }

    // Cargar preguntas del examen de conocimientos
    if (examenConocimientos2024.modulos) {
      for (const modulo of examenConocimientos2024.modulos) {
        for (const pregunta of modulo.preguntas) {
          const questionId = `conocimientos_${pregunta.id}`;
          const questionRef = doc(db, 'questions', questionId);

          const questionData: Question = {
            id: questionId,
            topicId: pregunta.subtema.toLowerCase().replace(/\s+/g, '_'),
            module: modulo.titulo.toLowerCase().replace(/\s+/g, '_'),
            type: 'multiple_choice',
            difficulty: pregunta.dificultad || 'medio',
            question: pregunta.pregunta,
            options: pregunta.opciones,
            correctAnswer: pregunta.respuesta_correcta,
            explanation: pregunta.explicacion,
            tags: [pregunta.subtema, modulo.titulo, 'conocimientos', examenConocimientos2024.fecha],
            timesAnswered: 0,
            successRate: 0,
            createdAt: new Date()
          };

          batch.set(questionRef, questionData);
          questionCount++;
        }
      }
    }

    // Cargar preguntas del banco completo de preguntas UANL 2024
    if (bancoPreguntas.modulos) {
      for (const modulo of bancoPreguntas.modulos) {
        for (const tema of modulo.temas) {
          for (const pregunta of tema.preguntas) {
            const questionId = `banco_${pregunta.id}`;
            const questionRef = doc(db, 'questions', questionId);

            const questionData: Question = {
              id: questionId,
              topicId: tema.titulo.toLowerCase().replace(/\s+/g, '_'),
              module: modulo.titulo.toLowerCase().replace(/\s+/g, '_'),
              type: 'multiple_choice',
              difficulty: pregunta.dificultad,
              question: pregunta.pregunta,
              options: pregunta.opciones,
              correctAnswer: pregunta.respuesta_correcta,
              explanation: pregunta.explicacion,
              tags: [tema.titulo, pregunta.dificultad, 'uanl_2024', pregunta.fuente || 'investigacion'],
              timesAnswered: 0,
              successRate: 0,
              createdAt: new Date()
            };

            batch.set(questionRef, questionData);
            questionCount++;
          }
        }
      }
    }

    // Ejecutar batch
    await batch.commit();
    console.log(`✅ Cargadas ${questionCount} preguntas desde archivos JSON`);

  } catch (error) {
    console.error('❌ Error cargando preguntas desde JSON:', error);
    throw error;
  }
}

/**
 * Crear quizzes basados en los exámenes JSON
 */
export async function createQuizzesFromJSON(): Promise<void> {
  try {
    console.log('📝 Creando quizzes desde datos JSON...');

    // Crear quiz psicométrico
    if (examenPsicometrico2024.secciones) {
      const quizId = `quiz_psicometrico_${examenPsicometrico2024.fecha}`;
      const quizRef = doc(db, 'quizzes', quizId);

      // Recopilar todas las preguntas del psicométrico
      const questionIds: string[] = [];
      for (const seccion of examenPsicometrico2024.secciones) {
        for (const pregunta of seccion.preguntas) {
          questionIds.push(`psicometrico_${pregunta.id}`);
        }
      }

      await setDoc(quizRef, {
        id: quizId,
        title: `${examenPsicometrico2024.titulo} - Simulación`,
        description: examenPsicometrico2024.descripcion,
        topicIds: ['psicometrico'],
        questions: questionIds, // Referencias a las preguntas
        timeLimit: examenPsicometrico2024.duracion_minutos / 60, // convertir a minutos
        passingScore: 70,
        difficulty: 'medio',
        createdBy: 'system',
        isPublic: true,
        attempts: 0,
        averageScore: 0,
        createdAt: new Date(),
        tags: ['psicometrico', 'simulacion', examenPsicometrico2024.fecha]
      });
    }

    // Crear quiz de conocimientos
    if (examenConocimientos2024.modulos) {
      const quizId = `quiz_conocimientos_${examenConocimientos2024.fecha}`;
      const quizRef = doc(db, 'quizzes', quizId);

      // Recopilar todas las preguntas de conocimientos
      const questionIds: string[] = [];
      for (const modulo of examenConocimientos2024.modulos) {
        for (const pregunta of modulo.preguntas) {
          questionIds.push(`conocimientos_${pregunta.id}`);
        }
      }

      await setDoc(quizRef, {
        id: quizId,
        title: `${examenConocimientos2024.titulo} - Simulación`,
        description: examenConocimientos2024.descripcion,
        topicIds: ['psicologia', 'ciencias_salud'],
        questions: questionIds,
        timeLimit: 180, // 3 horas totales
        passingScore: 70,
        difficulty: 'avanzado',
        createdBy: 'system',
        isPublic: true,
        attempts: 0,
        averageScore: 0,
        createdAt: new Date(),
        tags: ['conocimientos', 'psicologia', 'simulacion', examenConocimientos2024.fecha]
      });
    }

    console.log('✅ Quizzes creados desde datos JSON');

  } catch (error) {
    console.error('❌ Error creando quizzes desde JSON:', error);
    throw error;
  }
}

/**
 * Cargar todos los datos JSON a la base de datos
 */
export async function loadAllDataFromJSON(): Promise<void> {
  try {
    console.log('🚀 Iniciando carga completa de datos JSON...');

    // Cargar preguntas
    await loadQuestionsFromJSON();

    // Crear quizzes
    await createQuizzesFromJSON();

    console.log('✅ Todos los datos JSON cargados correctamente');

  } catch (error) {
    console.error('❌ Error en carga completa de datos JSON:', error);
    throw error;
  }
}

/**
 * Obtener estadísticas de los datos cargados
 */
export async function getDataStats(): Promise<{
  totalQuestions: number;
  questionsByModule: Record<string, number>;
  questionsByDifficulty: Record<string, number>;
  totalQuizzes: number;
}> {
  try {
    // Esta función se implementaría para obtener estadísticas
    // Por ahora retornamos datos de ejemplo
    return {
      totalQuestions: 50,
      questionsByModule: {
        psicometria: 15,
        psicologia: 25,
        ciencias_salud: 10
      },
      questionsByDifficulty: {
        facil: 15,
        medio: 20,
        dificil: 15
      },
      totalQuizzes: 2
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw error;
  }
}

export default {
  loadQuestionsFromJSON,
  createQuizzesFromJSON,
  loadAllDataFromJSON,
  getDataStats
};
