// src/lib/database.ts
// ========================================
// PSICOGUÍA - CONFIGURACIÓN GENERAL DE BASE DE DATOS
// ========================================

import { initializeDatabase, createSampleQuiz, isDatabaseInitialized } from './database-init';
import { loadAllDataFromJSON, getDataStats } from './data-loader';
import { UserService, ContentService, QuizService, ProgressService, StudySessionService, NotificationService } from './database-services';

/**
 * Configuración principal de la base de datos PsicoGuía
 */
export class DatabaseManager {
  private static instance: DatabaseManager;
  private initialized = false;

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Inicializar toda la base de datos
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('ℹ️ Base de datos ya inicializada');
      return;
    }

    try {
      console.log('🚀 Inicializando sistema de base de datos PsicoGuía...');

      // Verificar si ya está inicializada
      const isInitialized = await isDatabaseInitialized();

      if (!isInitialized) {
        // Inicializar con datos de muestra
        await initializeDatabase();
        console.log('✅ Base de datos inicializada con datos de muestra');

        // Cargar datos desde JSON
        await loadAllDataFromJSON();
        console.log('✅ Datos JSON cargados');

        // Crear quiz de muestra
        await createSampleQuiz();
        console.log('✅ Quiz de muestra creado');
      } else {
        console.log('✅ Base de datos ya contenía datos');
      }

      this.initialized = true;
      console.log('🎉 Sistema de base de datos PsicoGuía listo');

    } catch (error) {
      console.error('❌ Error inicializando base de datos:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de la base de datos
   */
  async getStats(): Promise<any> {
    try {
      const dataStats = await getDataStats();
      return {
        initialized: this.initialized,
        ...dataStats
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  /**
   * Resetear base de datos (solo para desarrollo)
   */
  async reset(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Reset solo disponible en desarrollo');
    }

    console.log('⚠️ Reseteando base de datos...');
    this.initialized = false;
    // Implementar reset si es necesario
  }
}

/**
 * Instancia global del administrador de base de datos
 */
export const dbManager = DatabaseManager.getInstance();

/**
 * Servicios de base de datos exportados
 */
export const dbServices = {
  users: UserService,
  content: ContentService,
  quizzes: QuizService,
  progress: ProgressService,
  sessions: StudySessionService,
  notifications: NotificationService
};

/**
 * Tipos de datos exportados
 */
export * from './database-types';
export * from './firestore-schema';

/**
 * Funciones de utilidad para la base de datos
 */
export const dbUtils = {
  initialize: () => dbManager.initialize(),
  getStats: () => dbManager.getStats(),
  reset: () => dbManager.reset()
};

export default {
  DatabaseManager,
  dbManager,
  dbServices,
  dbUtils
};
