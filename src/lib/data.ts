// src/lib/data.ts
import type { StudyResource, PerformanceData } from './types';

/**
 * A list of available study resources, including internal content and external links.
 */
export const studyResources: StudyResource[] = [
  {
    title: 'Bases Biológicas de la Conducta',
    category: 'Fundamentos de Psicología',
    type: 'internal',
    source: 'bases-biologicas.md',
  },
  {
    title: 'Procesos Psicológicos Básicos',
    category: 'Fundamentos de Psicología',
    type: 'internal',
    source: 'procesos-psicologicos.md',
  },
  {
    title: 'Psicología del Desarrollo',
    category: 'Fundamentos de Psicología',
    type: 'internal',
    source: 'psicologia-desarrollo.md',
  },
    {
    title: 'Psicología Social',
    category: 'Fundamentos de Psicología',
    type: 'internal',
    source: 'psicologia-social.md',
  },
  {
    title: 'Psicometría',
    category: 'Metodología',
    type: 'internal',
    source: 'psicometria.md',
  },
  {
    title: 'Guía para el Examen Psicométrico',
    category: 'Examen Psicométrico',
    type: 'internal',
    source: 'guia-psicometrico.md',
  },
  {
    title: 'Comprensión Lectora',
    category: 'Habilidades del EXANI-II',
    type: 'internal',
    source: 'comprension-lectora.md',
  },
  {
    title: 'Redacción Indirecta',
    category: 'Habilidades del EXANI-II',
    type: 'internal',
    source: 'redaccion-indirecta.md',
  },
  {
    title: 'Pensamiento Matemático',
    category: 'Habilidades del EXANI-II',
    type: 'internal',
    source: 'pensamiento-matematico.md',
  },
   {
    title: 'Inglés',
    category: 'Habilidades del EXANI-II',
    type: 'internal',
    source: 'ingles.md',
  },
  {
    title: 'Módulos específicos EXANI-II (Psicología)',
    category: 'UANL Oficial (PDF)',
    type: 'url',
    source: 'https://www.uanl.mx/wp-content/uploads/2022/09/Modulos-especificos-del-EXANI-II_Psicologia-1-1.pdf',
  },
  {
    title: 'Guía para el sustentante EXANI-II (General)',
    category: 'UANL Oficial (PDF)',
    type: 'url',
    source: 'https://www.uanl.mx/wp-content/uploads/2023/02/EXANI-II_Guia-para-el-sustentante_2023_compressed.pdf'
  },
];

/**
 * The initial state for user performance data, with all scores set to zero.
 */
export const initialPerformance: PerformanceData[] = [
  { topic: 'Bases Biológicas de la Conducta', correct: 0, incorrect: 0 },
  { topic: 'Procesos Psicológicos Básicos', correct: 0, incorrect: 0 },
  { topic: 'Psicología del Desarrollo', correct: 0, incorrect: 0 },
  { topic: 'Psicología Social', correct: 0, incorrect: 0 },
  { topic: 'Psicometría', correct: 0, incorrect: 0 },
  { topic: 'Examen Psicométrico', correct: 0, incorrect: 0 },
  { topic: 'Comprensión Lectora', correct: 0, incorrect: 0 },
  { topic: 'Redacción Indirecta', correct: 0, incorrect: 0 },
  { topic: 'Pensamiento Matemático', correct: 0, incorrect: 0 },
  { topic: 'Inglés', correct: 0, incorrect: 0 }
];
