// src/lib/database-services.ts
// ========================================
// PSICOGUÍA - SERVICIOS DE BASE DE DATOS
// ========================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { FIRESTORE_PATHS } from './firestore-schema';
import {
  UserProfile,
  LearningProfile,
  StudyTopic,
  Question,
  Quiz,
  QuizAttempt,
  StudySession,
  UserProgress,
  TopicProgress,
  Achievement,
  Notification
} from './database-types';

/**
 * ========================================
 * SERVICIOS DE USUARIOS
 * ========================================
 */

export class UserService {
  /**
   * Crear perfil de usuario
   */
  static async createUserProfile(userId: string, profile: Omit<UserProfile, 'uid'>): Promise<void> {
    const userRef = doc(db, FIRESTORE_PATHS.USER_PROFILE(userId));
    await setDoc(userRef, {
      ...profile,
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now()
    });
  }

  /**
   * Obtener perfil de usuario
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const userRef = doc(db, FIRESTORE_PATHS.USER_PROFILE(userId));
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  }

  /**
   * Actualizar perfil de usuario
   */
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, FIRESTORE_PATHS.USER_PROFILE(userId));
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  /**
   * Obtener perfil de aprendizaje del usuario
   */
  static async getLearningProfile(userId: string): Promise<LearningProfile | null> {
    const userRef = doc(db, FIRESTORE_PATHS.USER_PROFILE(userId));
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return data.learningProfile as LearningProfile || null;
    }
    return null;
  }

  /**
   * Actualizar perfil de aprendizaje
   */
  static async updateLearningProfile(userId: string, profile: LearningProfile): Promise<void> {
    const userRef = doc(db, FIRESTORE_PATHS.USER_PROFILE(userId));
    await updateDoc(userRef, {
      learningProfile: profile,
      updatedAt: Timestamp.now()
    });
  }
}

/**
 * ========================================
 * SERVICIOS DE CONTENIDO
 * ========================================
 */

export class ContentService {
  /**
   * Obtener todos los temas de estudio
   */
  static async getAllTopics(): Promise<StudyTopic[]> {
    const topicsRef = collection(db, 'topics');
    const topicsSnap = await getDocs(topicsRef);

    return topicsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as StudyTopic));
  }

  /**
   * Obtener tema por ID
   */
  static async getTopicById(topicId: string): Promise<StudyTopic | null> {
    const topicRef = doc(db, FIRESTORE_PATHS.TOPIC(topicId));
    const topicSnap = await getDoc(topicRef);

    if (topicSnap.exists()) {
      return {
        id: topicSnap.id,
        ...topicSnap.data()
      } as StudyTopic;
    }
    return null;
  }

  /**
   * Obtener temas por módulo
   */
  static async getTopicsByModule(module: string): Promise<StudyTopic[]> {
    const topicsRef = collection(db, 'topics');
    const q = query(topicsRef, where('module', '==', module));
    const topicsSnap = await getDocs(q);

    return topicsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as StudyTopic));
  }

  /**
   * Obtener preguntas por tema
   */
  static async getQuestionsByTopic(topicId: string, limitCount: number = 50): Promise<Question[]> {
    const questionsRef = collection(db, 'questions');
    const q = query(
      questionsRef,
      where('topicId', '==', topicId),
      orderBy('timesAnswered', 'desc'),
      limit(limitCount)
    );
    const questionsSnap = await getDocs(q);

    return questionsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Question));
  }

  /**
   * Obtener preguntas por dificultad
   */
  static async getQuestionsByDifficulty(difficulty: string, limitCount: number = 20): Promise<Question[]> {
    const questionsRef = collection(db, 'questions');
    const q = query(
      questionsRef,
      where('difficulty', '==', difficulty),
      orderBy('timesAnswered', 'asc'),
      limit(limitCount)
    );
    const questionsSnap = await getDocs(q);

    return questionsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Question));
  }
}

/**
 * ========================================
 * SERVICIOS DE QUIZZES
 * ========================================
 */

export class QuizService {
  /**
   * Crear un nuevo quiz
   */
  static async createQuiz(quiz: Omit<Quiz, 'id' | 'createdAt' | 'attempts' | 'averageScore'>): Promise<string> {
    const quizRef = doc(collection(db, 'quizzes'));
    const quizData: Quiz = {
      ...quiz,
      id: quizRef.id,
      attempts: 0,
      averageScore: 0,
      createdAt: Timestamp.now()
    };

    await setDoc(quizRef, quizData);
    return quizRef.id;
  }

  /**
   * Obtener quiz por ID
   */
  static async getQuizById(quizId: string): Promise<Quiz | null> {
    const quizRef = doc(db, FIRESTORE_PATHS.QUIZ(quizId));
    const quizSnap = await getDoc(quizRef);

    if (quizSnap.exists()) {
      return {
        id: quizSnap.id,
        ...quizSnap.data()
      } as Quiz;
    }
    return null;
  }

  /**
   * Obtener quizzes públicos
   */
  static async getPublicQuizzes(limitCount: number = 20): Promise<Quiz[]> {
    const quizzesRef = collection(db, 'quizzes');
    const q = query(
      quizzesRef,
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const quizzesSnap = await getDocs(q);

    return quizzesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Quiz));
  }

  /**
   * Guardar intento de quiz
   */
  static async saveQuizAttempt(quizId: string, attempt: Omit<QuizAttempt, 'id' | 'completedAt'>): Promise<string> {
    const attemptRef = doc(collection(db, FIRESTORE_PATHS.QUIZ_ATTEMPTS(quizId)));
    const attemptData: QuizAttempt = {
      ...attempt,
      id: attemptRef.id,
      completedAt: Timestamp.now()
    };

    await setDoc(attemptRef, attemptData);

    // Actualizar estadísticas del quiz
    await QuizService.updateQuizStats(quizId, attempt.score, attempt.percentage);

    return attemptRef.id;
  }

  /**
   * Actualizar estadísticas del quiz
   */
  private static async updateQuizStats(quizId: string, score: number, percentage: number): Promise<void> {
    const quizRef = doc(db, FIRESTORE_PATHS.QUIZ(quizId));
    const quizSnap = await getDoc(quizRef);

    if (quizSnap.exists()) {
      const currentData = quizSnap.data() as Quiz;
      const newAttempts = currentData.attempts + 1;
      const newAverageScore = ((currentData.averageScore * currentData.attempts) + percentage) / newAttempts;

      await updateDoc(quizRef, {
        attempts: increment(1),
        averageScore: newAverageScore
      });
    }
  }
}

/**
 * ========================================
 * SERVICIOS DE PROGRESO
 * ========================================
 */

export class ProgressService {
  /**
   * Obtener progreso general del usuario
   */
  static async getUserProgress(userId: string): Promise<UserProgress | null> {
    const progressRef = collection(db, FIRESTORE_PATHS.USER_PROGRESS(userId));
    const progressSnap = await getDocs(progressRef);

    if (!progressSnap.empty) {
      const topicsProgress = progressSnap.docs.map(doc => ({
        topicId: doc.id,
        ...doc.data()
      } as TopicProgress));

      // Calcular estadísticas generales
      const totalQuestions = topicsProgress.reduce((sum, topic) => sum + topic.questionsAnswered, 0);
      const totalCorrect = topicsProgress.reduce((sum, topic) => sum + topic.correctAnswers, 0);
      const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

      const longestStreak = Math.max(...topicsProgress.map(t => t.questionsAnswered), 0);
      const lastStudyDate = topicsProgress.length > 0
        ? new Date(Math.max(...topicsProgress.map(t => t.lastPracticed.getTime())))
        : new Date();

      return {
        userId,
        topicProgress: topicsProgress,
        totalQuestionsAnswered: totalQuestions,
        totalCorrectAnswers: totalCorrect,
        overallAccuracy,
        studyStreak: 0, // Calcular basado en sesiones
        longestStreak,
        totalStudyTime: 0, // Calcular de sesiones
        achievements: [], // Obtener de otra colección
        lastStudyDate
      };
    }
    return null;
  }

  /**
   * Actualizar progreso en un tema específico
   */
  static async updateTopicProgress(
    userId: string,
    topicId: string,
    correct: boolean,
    timeSpent: number
  ): Promise<void> {
    const progressRef = doc(db, FIRESTORE_PATHS.USER_TOPIC_PROGRESS(userId, topicId));
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      const currentData = progressSnap.data() as TopicProgress;
      const newQuestions = currentData.questionsAnswered + 1;
      const newCorrect = currentData.correctAnswers + (correct ? 1 : 0);
      const newAccuracy = (newCorrect / newQuestions) * 100;
      const newTime = currentData.timeSpent + timeSpent;

      await updateDoc(progressRef, {
        questionsAnswered: increment(1),
        correctAnswers: increment(correct ? 1 : 0),
        accuracyRate: newAccuracy,
        timeSpent: newTime,
        lastPracticed: Timestamp.now()
      });
    } else {
      // Crear nuevo registro de progreso
      await setDoc(progressRef, {
        topicId,
        questionsAnswered: 1,
        correctAnswers: correct ? 1 : 0,
        accuracyRate: correct ? 100 : 0,
        timeSpent: timeSpent,
        completed: false,
        lastPracticed: Timestamp.now()
      } as TopicProgress);
    }
  }
}

/**
 * ========================================
 * SERVICIOS DE SESIONES DE ESTUDIO
 * ========================================
 */

export class StudySessionService {
  /**
   * Iniciar nueva sesión de estudio
   */
  static async startStudySession(userId: string, topicId: string): Promise<string> {
    const sessionRef = doc(collection(db, FIRESTORE_PATHS.USER_SESSIONS(userId)));
    const sessionData: Omit<StudySession, 'id'> = {
      userId,
      topicId,
      startTime: Timestamp.now(),
      duration: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      focusScore: 100,
      notes: '',
      completed: false
    };

    await setDoc(sessionRef, sessionData);
    return sessionRef.id;
  }

  /**
   * Finalizar sesión de estudio
   */
  static async endStudySession(
    userId: string,
    sessionId: string,
    questionsAnswered: number,
    correctAnswers: number,
    notes: string
  ): Promise<void> {
    const sessionRef = doc(db, FIRESTORE_PATHS.USER_SESSION(userId, sessionId));
    const sessionSnap = await getDoc(sessionRef);

    if (sessionSnap.exists()) {
      const startTime = sessionSnap.data().startTime as Timestamp;
      const duration = Timestamp.now().seconds - startTime.seconds;
      const focusScore = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;

      await updateDoc(sessionRef, {
        duration,
        questionsAnswered,
        correctAnswers,
        focusScore,
        notes,
        completed: true
      });
    }
  }

  /**
   * Obtener sesiones de estudio del usuario
   */
  static async getUserStudySessions(userId: string, limitCount: number = 10): Promise<StudySession[]> {
    const sessionsRef = collection(db, FIRESTORE_PATHS.USER_SESSIONS(userId));
    const q = query(sessionsRef, orderBy('startTime', 'desc'), limit(limitCount));
    const sessionsSnap = await getDocs(q);

    return sessionsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as StudySession));
  }

  /**
   * Obtener tiempo total de estudio del usuario
   */
  static async getTotalStudyTime(userId: string): Promise<number> {
    const sessionsRef = collection(db, FIRESTORE_PATHS.USER_SESSIONS(userId));
    const q = query(sessionsRef, where('completed', '==', true));
    const sessionsSnap = await getDocs(q);

    return sessionsSnap.docs.reduce((total, doc) => {
      const session = doc.data() as StudySession;
      return total + session.duration;
    }, 0);
  }
}

/**
 * ========================================
 * SERVICIOS DE NOTIFICACIONES
 * ========================================
 */

export class NotificationService {
  /**
   * Crear notificación para usuario
   */
  static async createNotification(userId: string, notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<void> {
    const notificationRef = doc(collection(db, FIRESTORE_PATHS.USER_NOTIFICATIONS(userId)));
    await setDoc(notificationRef, {
      ...notification,
      id: notificationRef.id,
      read: false,
      createdAt: Timestamp.now()
    });
  }

  /**
   * Obtener notificaciones no leídas del usuario
   */
  static async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const notificationsRef = collection(db, FIRESTORE_PATHS.USER_NOTIFICATIONS(userId));
    const q = query(notificationsRef, where('read', '==', false), orderBy('createdAt', 'desc'));
    const notificationsSnap = await getDocs(q);

    return notificationsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Notification));
  }

  /**
   * Marcar notificación como leída
   */
  static async markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    const notificationRef = doc(db, FIRESTORE_PATHS.USER_NOTIFICATIONS(userId), notificationId);
    await updateDoc(notificationRef, { read: true });
  }
}

export default {
  UserService,
  ContentService,
  QuizService,
  ProgressService,
  StudySessionService,
  NotificationService
};
