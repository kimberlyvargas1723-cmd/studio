/**
 * Firebase Cloud Functions for PsicoGuía
 *
 * Functions for educational features:
 * - Quiz validation and scoring
 * - User progress tracking
 * - Achievement notifications
 * - Study session analytics
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// ================================
// QUIZ VALIDATION FUNCTIONS
// ================================

/**
 * Validates and scores quiz submissions
 * Callable function for secure quiz grading
 */
exports.validateQuizSubmission = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { quizId, answers, userId } = data;

  try {
    // Get quiz data from Firestore
    const quizDoc = await admin.firestore().collection('quizzes').doc(quizId).get();
    if (!quizDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Quiz not found');
    }

    const quizData = quizDoc.data();

    // Get questions data
    const questionIds = quizData.questions || [];
    const questions = [];

    for (const questionId of questionIds) {
      const questionDoc = await admin.firestore().collection('questions').doc(questionId).get();
      if (questionDoc.exists) {
        questions.push({ id: questionDoc.id, ...questionDoc.data() });
      }
    }

    // Calculate score
    let correctAnswers = 0;
    const results = [];

    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) correctAnswers++;

      results.push({
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? 1 : 0
      });
    });

    const score = (correctAnswers / questions.length) * 100;
    const passed = score >= (quizData.passingScore || 70);

    // Save attempt to database
    const attemptRef = admin.firestore().collection('quizzes').doc(quizId).collection('attempts').doc();
    await attemptRef.set({
      userId: context.auth.uid,
      answers,
      score,
      percentage: score,
      correctAnswers,
      totalQuestions: questions.length,
      passed,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      results
    });

    // Update user progress
    await updateUserProgress(context.auth.uid, quizId, score, passed);

    return {
      score,
      passed,
      correctAnswers,
      totalQuestions: questions.length,
      results,
      message: passed ? '¡Felicitaciones! Aprobaste el quiz.' : 'Sigue practicando, ¡puedes mejorar!'
    };

  } catch (error) {
    console.error('Error validating quiz:', error);
    throw new functions.https.HttpsError('internal', 'Error processing quiz submission');
  }
});

// ================================
// USER PROGRESS FUNCTIONS
// ================================

/**
 * Updates user progress after quiz completion
 */
async function updateUserProgress(userId, quizId, score, passed) {
  const userRef = admin.firestore().collection('users').doc(userId);

  // Update quiz attempts count and average score
  const userDoc = await userRef.get();
  const userData = userDoc.data() || {};

  const quizAttempts = (userData.quizAttempts || 0) + 1;
  const totalScore = (userData.totalScore || 0) + score;
  const averageScore = totalScore / quizAttempts;

  await userRef.update({
    quizAttempts,
    totalScore,
    averageScore,
    lastQuizDate: admin.firestore.FieldValue.serverTimestamp(),
    // Update specific quiz progress
    [`quizProgress.${quizId}`]: {
      attempts: (userData.quizProgress?.[quizId]?.attempts || 0) + 1,
      bestScore: Math.max(userData.quizProgress?.[quizId]?.bestScore || 0, score),
      lastAttempt: admin.firestore.FieldValue.serverTimestamp(),
      passed: passed || userData.quizProgress?.[quizId]?.passed || false
    }
  });

  // Check for achievements
  await checkAchievements(userId, quizAttempts, averageScore, passed);
}

// ================================
// ACHIEVEMENT SYSTEM
// ================================

/**
 * Checks and awards achievements
 */
async function checkAchievements(userId, quizAttempts, averageScore, justPassed) {
  const achievements = [];
  const userRef = admin.firestore().collection('users').doc(userId);
  const achievementsRef = userRef.collection('achievements');

  // First quiz achievement
  if (quizAttempts === 1) {
    achievements.push({
      id: 'first_quiz',
      title: 'Primer Paso',
      description: 'Completaste tu primer quiz',
      icon: '🎯',
      category: 'milestone',
      unlockedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  // High scorer achievement
  if (averageScore >= 90) {
    const existing = await achievementsRef.where('id', '==', 'high_scorer').get();
    if (existing.empty) {
      achievements.push({
        id: 'high_scorer',
        title: 'Genio Psicológico',
        description: 'Mantén un promedio de 90% o más',
        icon: '🧠',
        category: 'accuracy',
        unlockedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }

  // Quiz master achievement
  if (quizAttempts >= 10) {
    const existing = await achievementsRef.where('id', '==', 'quiz_master').get();
    if (existing.empty) {
      achievements.push({
        id: 'quiz_master',
        title: 'Master del Conocimiento',
        description: 'Completaste 10 quizzes',
        icon: '👑',
        category: 'completion',
        unlockedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }

  // First pass achievement
  if (justPassed) {
    const existing = await achievementsRef.where('id', '==', 'first_pass').get();
    if (existing.empty) {
      achievements.push({
        id: 'first_pass',
        title: '¡Aprobado!',
        description: 'Aprobaste tu primer quiz',
        icon: '✅',
        category: 'milestone',
        unlockedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }

  // Save achievements
  for (const achievement of achievements) {
    await achievementsRef.doc(achievement.id).set(achievement);
  }

  // Send notifications for new achievements
  if (achievements.length > 0) {
    await sendAchievementNotification(userId, achievements);
  }
}

// ================================
// NOTIFICATION SYSTEM
// ================================

/**
 * Sends achievement notifications (would integrate with FCM)
 */
async function sendAchievementNotification(userId, achievements) {
  // In a real implementation, this would send push notifications via FCM
  // For now, we'll just log and store in Firestore

  console.log(`🏆 New achievements for user ${userId}:`, achievements.map(a => a.title));

  const notificationRef = admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('notifications')
    .doc();

  await notificationRef.set({
    type: 'achievement',
    title: '¡Nuevo logro desbloqueado!',
    message: `Felicitaciones: ${achievements.map(a => a.title).join(', ')}`,
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    data: { achievements }
  });
}

// ================================
// STUDY ANALYTICS FUNCTIONS
// ================================

/**
 * Scheduled function to generate weekly study reports
 */
exports.generateWeeklyReports = functions.pubsub
  .schedule('every monday 09:00')
  .timeZone('America/Mexico_City')
  .onRun(async (context) => {
    console.log('📊 Generating weekly study reports...');

    try {
      // Get all active users from last week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const usersSnapshot = await admin.firestore()
        .collection('users')
        .where('lastQuizDate', '>', weekAgo)
        .get();

      const reports = [];

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();

        // Calculate weekly stats
        const weeklyStats = await calculateWeeklyStats(userId, weekAgo);

        if (weeklyStats.quizzesTaken > 0) {
          reports.push({
            userId,
            userName: userData.displayName || 'Estudiante',
            ...weeklyStats
          });
        }
      }

      console.log(`📧 Sending ${reports.length} weekly reports`);

      // In production, this would send emails via SendGrid or similar
      // For now, we'll store reports in Firestore
      for (const report of reports) {
        await admin.firestore().collection('weeklyReports').add({
          ...report,
          generatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      return null;

    } catch (error) {
      console.error('Error generating weekly reports:', error);
      throw error;
    }
  });

/**
 * Helper function to calculate weekly statistics
 */
async function calculateWeeklyStats(userId, sinceDate) {
  const quizAttempts = await admin.firestore()
    .collectionGroup('attempts')
    .where('userId', '==', userId)
    .where('submittedAt', '>', sinceDate)
    .get();

  let totalScore = 0;
  let quizzesPassed = 0;
  const scores = [];

  quizAttempts.forEach(doc => {
    const data = doc.data();
    totalScore += data.score || 0;
    scores.push(data.score || 0);
    if (data.passed) quizzesPassed++;
  });

  const quizzesTaken = quizAttempts.size;
  const averageScore = quizzesTaken > 0 ? totalScore / quizzesTaken : 0;

  return {
    quizzesTaken,
    quizzesPassed,
    averageScore: Math.round(averageScore * 100) / 100,
    highestScore: Math.max(...scores, 0),
    lowestScore: Math.min(...scores, 100),
    period: 'weekly'
  };
}

// ================================
// ERROR HANDLING & MONITORING
// ================================

/**
 * Global error handler for functions
 */
exports.handleFunctionError = functions.https.onCall(async (data, context) => {
  console.error('Function error:', data);

  // Log error details for monitoring
  await admin.firestore().collection('functionErrors').add({
    function: data.functionName,
    error: data.error,
    userId: context.auth?.uid,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  return { acknowledged: true };
});
