/**
 * Advanced Analytics Service for PsicoGuía
 * Enhanced Firestore analytics for personalized learning insights
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  increment,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserAnalytics {
  userId: string;
  totalStudyTime: number; // minutes
  totalQuizzesCompleted: number;
  averageScore: number;
  weakTopics: string[];
  strongTopics: string[];
  studyStreak: number;
  lastActive: Timestamp;
  learningStyle: string;
  engagementScore: number;
}

export interface StudySession {
  id: string;
  userId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  topics: string[];
  materialsAccessed: string[];
  quizAttempts: number;
  totalStudyTime: number; // minutes
  focusScore: number; // 0-100
  notes: string;
  device: string;
  location?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number; // minutes
  difficulty: string;
  topic: string;
  timestamp: Timestamp;
  answers: { questionId: string; selected: number; correct: number; time: number }[];
}

export interface ContentRecommendation {
  userId: string;
  recommendedTopics: { topicId: string; score: number; reason: string }[];
  recommendedMaterials: { materialId: string; type: string; priority: string }[];
  lastUpdated: Timestamp;
}

/**
 * Record a new study session
 */
export async function recordStudySession(session: Omit<StudySession, 'id'>): Promise<void> {
  const sessionId = doc(collection(db, 'studySessions')).id;
  await setDoc(doc(db, 'studySessions', sessionId), {
    ...session,
    id: sessionId,
  });

  // Update user analytics
  await updateUserAnalytics(session.userId, {
    totalStudyTime: session.totalStudyTime,
    engagementScore: session.focusScore,
  });
}

/**
 * Record a quiz attempt
 */
export async function recordQuizAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<void> {
  await runTransaction(db, async (transaction) => {
    const attemptId = doc(collection(db, 'quizAttempts')).id;

    // Record the attempt
    transaction.set(doc(db, 'quizAttempts', attemptId), {
      ...attempt,
      id: attemptId,
    });

    // Update user analytics
    const userRef = doc(db, 'users', attempt.userId);
    const userDoc = await transaction.get(userRef);

    if (userDoc.exists()) {
      const currentData = userDoc.data();
      const performanceData = currentData.performanceData || [];

      // Update or add topic performance
      const topicIndex = performanceData.findIndex((p: any) => p.topic === attempt.topic);
      if (topicIndex >= 0) {
        performanceData[topicIndex].correct += attempt.correctAnswers;
        performanceData[topicIndex].incorrect += attempt.incorrectAnswers;
        performanceData[topicIndex].lastAttempted = attempt.timestamp;
      } else {
        performanceData.push({
          topic: attempt.topic,
          correct: attempt.correctAnswers,
          incorrect: attempt.incorrectAnswers,
          lastAttempted: attempt.timestamp,
        });
      }

      transaction.update(userRef, {
        performanceData,
        totalQuizAttempts: increment(1),
        lastQuizAttempt: attempt.timestamp,
      });
    }

    // Update topic stats
    const topicRef = doc(db, 'topicStats', attempt.topic);
    const topicDoc = await transaction.get(topicRef);

    if (topicDoc.exists()) {
      transaction.update(topicRef, {
        totalAttempts: increment(1),
        totalCorrect: increment(attempt.correctAnswers),
        totalIncorrect: increment(attempt.incorrectAnswers),
        averageScore: increment(attempt.score),
        lastAttempted: attempt.timestamp,
      });
    } else {
      transaction.set(topicRef, {
        topic: attempt.topic,
        totalAttempts: 1,
        totalCorrect: attempt.correctAnswers,
        totalIncorrect: attempt.incorrectAnswers,
        averageScore: attempt.score,
        lastAttempted: attempt.timestamp,
      });
    }
  });
}

/**
 * Update user analytics
 */
export async function updateUserAnalytics(
  userId: string,
  updates: Partial<UserAnalytics>
): Promise<void> {
  const analyticsRef = doc(db, 'userAnalytics', userId);
  await setDoc(analyticsRef, {
    userId,
    ...updates,
    lastUpdated: Timestamp.now(),
  }, { merge: true });
}

/**
 * Get advanced analytics for a user
 */
export async function getUserAdvancedAnalytics(userId: string): Promise<UserAnalytics | null> {
  const analyticsRef = doc(db, 'userAnalytics', userId);
  const analyticsDoc = await getDoc(analyticsRef);

  if (analyticsDoc.exists()) {
    return analyticsDoc.data() as UserAnalytics;
  }
  return null;
}

/**
 * Get recent study sessions for a user
 */
export async function getRecentStudySessions(
  userId: string,
  limitCount: number = 10
): Promise<StudySession[]> {
  const sessionsQuery = query(
    collection(db, 'studySessions'),
    where('userId', '==', userId),
    orderBy('startTime', 'desc'),
    limit(limitCount)
  );

  const sessionsSnapshot = await getDocs(sessionsQuery);
  return sessionsSnapshot.docs.map(doc => doc.data() as StudySession);
}

/**
 * Get quiz performance trends
 */
export async function getQuizPerformanceTrends(
  userId: string,
  days: number = 30
): Promise<QuizAttempt[]> {
  const cutoffDate = Timestamp.fromDate(new Date(Date.now() - days * 24 * 60 * 60 * 1000));

  const attemptsQuery = query(
    collection(db, 'quizAttempts'),
    where('userId', '==', userId),
    where('timestamp', '>=', cutoffDate),
    orderBy('timestamp', 'desc')
  );

  const attemptsSnapshot = await getDocs(attemptsQuery);
  return attemptsSnapshot.docs.map(doc => doc.data() as QuizAttempt);
}

/**
 * Generate content recommendations based on performance
 */
export async function generateContentRecommendations(userId: string): Promise<void> {
  const analytics = await getUserAdvancedAnalytics(userId);

  if (!analytics) return;

  const recommendations: ContentRecommendation = {
    userId,
    recommendedTopics: [],
    recommendedMaterials: [],
    lastUpdated: Timestamp.now(),
  };

  // Recommend weak topics
  for (const weakTopic of analytics.weakTopics.slice(0, 3)) {
    recommendations.recommendedTopics.push({
      topicId: weakTopic,
      score: 0.3, // Low score indicates needs improvement
      reason: 'weak_performance',
    });
  }

  // Recommend related topics based on strong performance
  for (const strongTopic of analytics.strongTopics.slice(0, 2)) {
    // Find related topics (simplified logic)
    const relatedTopics = await findRelatedTopics(strongTopic);
    for (const relatedTopic of relatedTopics.slice(0, 2)) {
      recommendations.recommendedTopics.push({
        topicId: relatedTopic,
        score: 0.7,
        reason: 'related_to_strong_performance',
      });
    }
  }

  // Save recommendations
  await setDoc(doc(db, 'contentRecommendations', userId), recommendations);
}

/**
 * Find related topics (simplified implementation)
 */
async function findRelatedTopics(topic: string): Promise<string[]> {
  // This would use a more sophisticated algorithm in production
  // For now, return a static list based on common psychology topics
  const topicRelations: { [key: string]: string[] } = {
    'Psicología Cognitiva': ['Neurociencia', 'Psicología del Aprendizaje'],
    'Psicoanálisis': ['Psicología Clínica', 'Teorías de la Personalidad'],
    'Psicología Social': ['Psicología de Grupos', 'Comportamiento Organizacional'],
    'Neurociencia': ['Psicología Biológica', 'Psicofarmacología'],
  };

  return topicRelations[topic] || [];
}

/**
 * Get leaderboard data (anonymous)
 */
export async function getLeaderboard(limitCount: number = 10): Promise<UserAnalytics[]> {
  const leaderboardQuery = query(
    collection(db, 'userAnalytics'),
    orderBy('averageScore', 'desc'),
    orderBy('totalStudyTime', 'desc'),
    limit(limitCount)
  );

  const leaderboardSnapshot = await getDocs(leaderboardQuery);
  return leaderboardSnapshot.docs.map(doc => doc.data() as UserAnalytics);
}

/**
 * Calculate daily study streaks
 */
export async function calculateStudyStreak(userId: string): Promise<number> {
  const sessions = await getRecentStudySessions(userId, 30);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);

    const hasSession = sessions.some(session =>
      session.startTime.toDate().toDateString() === checkDate.toDateString()
    );

    if (hasSession) {
      streak++;
    } else if (i === 0) {
      // If no session today, streak is broken
      break;
    }
  }

  // Update user analytics with new streak
  await updateUserAnalytics(userId, { studyStreak: streak });

  return streak;
}
