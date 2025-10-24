// src/lib/firestore-schema.ts
// ========================================
// PSICOGUÍA - ESQUEMA DE FIRESTORE
// ========================================

/**
 * Estructura jerárquica de la base de datos Firestore para PsicoGuía
 *
 * ORGANIZACIÓN PRINCIPAL:
 * - /users/{userId}/ - Perfiles de usuario y datos personales
 * - /topics/ - Temas de estudio (colección global)
 * - /questions/ - Banco de preguntas (colección global)
 * - /quizzes/ - Quizzes y exámenes simulados
 * - /analytics/ - Datos analíticos y reportes
 */

export const FIRESTORE_COLLECTIONS = {
  // ========== COLECCIONES PRINCIPALES ==========
  USERS: 'users',
  TOPICS: 'topics',
  QUESTIONS: 'questions',
  QUIZZES: 'quizzes',
  ANALYTICS: 'analytics',

  // ========== SUBCOLECCIONES ==========
  USER_SESSIONS: 'studySessions',
  USER_PROGRESS: 'progress',
  USER_FEEDBACK: 'feedback',
  USER_NOTIFICATIONS: 'notifications',
  USER_ACHIEVEMENTS: 'achievements',

  QUIZ_ATTEMPTS: 'attempts',
  QUIZ_QUESTIONS: 'questions',
} as const;

/**
 * ESTRUCTURA DE DOCUMENTOS EN FIRESTORE
 *
 * /users/{userId}
 * ├── profile (documento principal)
 * ├── studySessions/{sessionId}
 * ├── progress/{topicId}
 * ├── feedback/{feedbackId}
 * ├── notifications/{notificationId}
 * └── achievements/{achievementId}
 *
 * /topics/{topicId} (documento global)
 *
 * /questions/{questionId} (documento global)
 *
 * /quizzes/{quizId}
 * ├── attempts/{attemptId}
 * └── questions/{questionId} (referencias)
 *
 * /analytics/{userId}
 * └── daily/{date}
 *     └── weekly/{week}
 *         └── monthly/{month}
 */

export const FIRESTORE_PATHS = {
  // Usuarios
  USER_PROFILE: (userId: string) => `users/${userId}`,
  USER_SESSIONS: (userId: string) => `users/${userId}/studySessions`,
  USER_SESSION: (userId: string, sessionId: string) => `users/${userId}/studySessions/${sessionId}`,
  USER_PROGRESS: (userId: string) => `users/${userId}/progress`,
  USER_TOPIC_PROGRESS: (userId: string, topicId: string) => `users/${userId}/progress/${topicId}`,
  USER_FEEDBACK: (userId: string) => `users/${userId}/feedback`,
  USER_NOTIFICATIONS: (userId: string) => `users/${userId}/notifications`,
  USER_ACHIEVEMENTS: (userId: string) => `users/${userId}/achievements`,

  // Contenido global
  TOPIC: (topicId: string) => `topics/${topicId}`,
  QUESTION: (questionId: string) => `questions/${questionId}`,

  // Quizzes
  QUIZ: (quizId: string) => `quizzes/${quizId}`,
  QUIZ_ATTEMPTS: (quizId: string) => `quizzes/${quizId}/attempts`,
  QUIZ_ATTEMPT: (quizId: string, attemptId: string) => `quizzes/${quizId}/attempts/${attemptId}`,

  // Analytics
  USER_ANALYTICS: (userId: string) => `analytics/${userId}`,
  USER_DAILY_ANALYTICS: (userId: string, date: string) => `analytics/${userId}/daily/${date}`,
  USER_WEEKLY_ANALYTICS: (userId: string, week: string) => `analytics/${userId}/weekly/${week}`,
  USER_MONTHLY_ANALYTICS: (userId: string, month: string) => `analytics/${userId}/monthly/${month}`,
} as const;

/**
 * ÍNDICES RECOMENDADOS PARA FIRESTORE
 *
 * Estos índices mejorarán el rendimiento de las consultas más comunes.
 * Se deben crear desde la consola de Firebase.
 */
export const FIRESTORE_INDEXES = [
  // Consultas por usuario y fecha
  {
    collection: 'users/{userId}/studySessions',
    fields: ['startTime', 'completed']
  },

  // Consultas por tópico y dificultad
  {
    collection: 'questions',
    fields: ['topicId', 'difficulty', 'timesAnswered']
  },

  // Consultas de progreso por usuario
  {
    collection: 'users/{userId}/progress',
    fields: ['lastPracticed', 'accuracyRate']
  },

  // Consultas de analytics
  {
    collection: 'analytics/{userId}/daily',
    fields: ['date', 'studyTime']
  }
];

/**
 * REGLAS DE SEGURIDAD DE FIRESTORE (firestore.rules)
 *
 * Se deben implementar estas reglas para proteger los datos.
 */
export const FIRESTORE_SECURITY_RULES = `
// Reglas de seguridad para PsicoGuía
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ========== USUARIOS ==========
    match /users/{userId} {
      // Solo el propietario puede leer/escribir su perfil
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Subcolecciones de usuario
      match /studySessions/{sessionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /progress/{topicId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /feedback/{feedbackId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /notifications/{notificationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /achievements/{achievementId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // ========== CONTENIDO GLOBAL ==========
    match /topics/{topicId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.auth.token.role in ['teacher', 'admin'];
    }

    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.auth.token.role in ['teacher', 'admin'];
    }

    // ========== QUIZZES ==========
    match /quizzes/{quizId} {
      allow read: if request.auth != null &&
        (resource.data.isPublic == true ||
         resource.data.createdBy == request.auth.uid);

      allow write: if request.auth != null &&
        resource.data.createdBy == request.auth.uid;

      // Intentos de quiz
      match /attempts/{attemptId} {
        allow read, write: if request.auth != null &&
          request.auth.uid == resource.data.userId;
      }
    }

    // ========== ANALYTICS ==========
    match /analytics/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`;

export default {
  FIRESTORE_COLLECTIONS,
  FIRESTORE_PATHS,
  FIRESTORE_INDEXES,
  FIRESTORE_SECURITY_RULES
};
