// src/ai/schemas.ts
/**
 * @fileoverview Centralized Zod schemas and TypeScript types for AI flows.
 * This file does not use 'use server' and can be safely imported by server components
 * and server actions to access type definitions.
 */
import { z } from 'genkit';

// --- Content Summarization ---
export const ContentSummarizationInputSchema = z.object({
  url: z.string().describe('The URL or Data URI of the content to be summarized.'),
  learningStyle: z.string().optional().describe('The user\'s dominant learning style (V, A, R, or K).'),
});
export type ContentSummarizationInput = z.infer<typeof ContentSummarizationInputSchema>;

export const ContentSummarizationOutputSchema = z.object({
  summary: z.string().describe('The summary of the content, formatted in Markdown.'),
});
export type ContentSummarizationOutput = z.infer<typeof ContentSummarizationOutputSchema>;


// --- Personalized Feedback Adaptation ---
export const PerformanceAnalysisInputSchema = z.object({
  question: z.string().describe('The question that was asked.'),
  studentAnswer: z.string().describe('The answer provided by the student.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  topic: z.string().describe('The topic of the question.'),
  learningStyle: z.string().optional().describe('The user\'s dominant learning style (V, A, R, or K).'),
});
export type PerformanceAnalysisInput = z.infer<typeof PerformanceAnalysisInputSchema>;

export const PerformanceAnalysisOutputSchema = z.object({
  feedback: z.string().describe('Specific, personalized feedback on why the student\'s answer was correct or incorrect.'),
  areasForImprovement: z.string().describe('The key concept or skill the student should focus on based on their answer.'),
  adaptedQuestionTopic: z.string().describe('A suggested topic for the next question to reinforce the area for improvement.'),
});
export type PerformanceAnalysisOutput = z.infer<typeof PerformanceAnalysisOutputSchema>;


// --- Practice Question Generation ---
export const PracticeQuestionGenerationInputSchema = z.object({
  summarizedContent: z.string().describe('The summarized content from the study materials.'),
  topic: z.string().describe('The topic of the summarized content.'),
});
export type PracticeQuestionGenerationInput = z.infer<typeof PracticeQuestionGenerationInputSchema>;

const GeneratedQuestionSchema = z.object({
    question: z.string().describe('The generated practice question.'),
    options: z.array(z.string()).length(4).describe('An array of 4 multiple-choice options.'),
    correctAnswer: z.string().describe('The correct answer from the options.'),
    explanation: z.string().describe('A brief explanation of why the answer is correct.'),
    topic: z.string().describe('The specific topic of the question (e.g., "Developmental Psychology").'),
});

export const PracticeQuestionGenerationOutputSchema = z.object({
  questions: z.array(GeneratedQuestionSchema).length(5).describe('An array of 5 generated practice questions based on the summarized content.'),
});
export type PracticeQuestionGenerationOutput = z.infer<typeof PracticeQuestionGenerationOutputSchema>;


// --- Study Assistant ---
export const StudyAssistantInputSchema = z.object({
  query: z.string().describe('The student\'s question or request for guidance.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The history of the conversation to provide context.'),
  learningStyle: z.string().optional().describe('The user\'s dominant learning style (V, A, R, or K).'),
});
export type StudyAssistantInput = z.infer<typeof StudyAssistantInputSchema>;

export const StudyAssistantOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the student\'s query.'),
  youtubeSearchQuery: z.string().optional().describe('A concise and effective YouTube search query for supplemental video content.'),
});
export type StudyAssistantOutput = z.infer<typeof StudyAssistantOutputSchema>;


// --- Image Text Extraction ---
export const ImageTextExtractionInputSchema = z.object({
  imageUrl: z.string().describe("A photo of content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ImageTextExtractionInput = z.infer<typeof ImageTextExtractionInputSchema>;

export const ImageTextExtractionOutputSchema = z.object({
  textContent: z.string().describe('The extracted and corrected text content from the image.'),
});
export type ImageTextExtractionOutput = z.infer<typeof ImageTextExtractionOutputSchema>;


// --- Generate Study Plan ---
const PerformanceDataSchemaForPlan = z.object({
  topic: z.string().describe('The name of the study topic.'),
  correct: z.number().describe('The count of correct answers for this topic.'),
  incorrect: z.number().describe('The count of incorrect answers for this topic.'),
});

const StudyTaskSchema = z.object({
  day: z.string().describe("The day of the week for the task (e.g., 'Monday')."),
  date: z.string().describe("The specific date for the task in 'Mmm DD' format (e.g., 'Jul 29')."),
  task: z.string().describe('A specific, actionable study task for the day.'),
  topic: z.string().describe('The main topic related to the task.'),
  isReview: z.boolean().describe('Whether the task is a review of a previously studied topic.'),
});

const WeeklyPlanSchema = z.object({
    week: z.number().describe('The week number of the study plan, starting from 1.'),
    focus: z.string().describe('A brief summary of the main focus for the week.'),
    tasks: z.array(StudyTaskSchema).describe('A list of daily tasks for the week.'),
});

export const StudyPlanInputSchema = z.object({
  performanceData: z.array(PerformanceDataSchemaForPlan).describe('An array of objects representing the student\'s performance in each topic.'),
  daysUntilExam: z.number().describe('The total number of days available for study until the exam date.'),
  currentDate: z.string().optional().describe("The current date, used for generating the plan's start date.")
});
export type StudyPlanInput = z.infer<typeof StudyPlanInputSchema>;

export const StudyPlanOutputSchema = z.object({
  plan: z.array(WeeklyPlanSchema).describe('An array of weekly study plans.'),
});
export type StudyPlanOutput = z.infer<typeof StudyPlanOutputSchema>;


// --- Generate Progress Summary ---
const PerformanceDataSchemaForSummary = z.object({
  topic: z.string().describe('The name of the study topic.'),
  correct: z.number().describe('The count of correct answers for this topic.'),
  incorrect: z.number().describe('The count of incorrect answers for this topic.'),
});

export const ProgressSummaryInputSchema = z.object({
  performanceData: z.array(PerformanceDataSchemaForSummary).describe('An array of objects representing the student\'s performance in each topic.'),
});
export type ProgressSummaryInput = z.infer<typeof ProgressSummaryInputSchema>;

export const ProgressSummaryOutputSchema = z.object({
  summary: z.string().describe('A brief and encouraging summary of the student\'s performance, highlighting a strength and an area for improvement.'),
  suggestion: z.string().describe('A single, actionable suggestion for the student to focus on next.'),
});
export type ProgressSummaryOutput = z.infer<typeof ProgressSummaryOutputSchema>;


// --- Generate Learning Strategy ---
export const LearningStrategyInputSchema = z.object({
  learningStyle: z.string().describe('The dominant learning style code (V, A, R, or K).'),
});
export type LearningStrategyInput = z.infer<typeof LearningStrategyInputSchema>;

export const LearningStrategyOutputSchema = z.object({
  style: z.string().describe('The full name of the learning style in Spanish (e.g., "Visual", "Auditory").'),
  strategy: z.string().describe('A detailed and personalized learning strategy in Markdown format.'),
});
export type LearningStrategyOutput = z.infer<typeof LearningStrategyOutputSchema>;

// --- Text to Speech ---
export const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

export const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe("A data URI representing the generated audio. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;
