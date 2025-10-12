// src/ai/flows/personalized-feedback-adaptation.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized feedback and adaptation based on student performance on practice questions.
 *
 * The flow analyzes student responses, identifies areas of weakness, and adapts future questions to focus on those areas.
 *
 * - `analyzePerformanceAndAdapt`: Analyzes student performance and adapts future questions.
 * - `PerformanceAnalysisInput`: The input type for the analyzePerformanceAndAdapt function.
 * - `PerformanceAnalysisOutput`: The return type for the analyzePerformanceAndAdapt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PerformanceAnalysisInputSchema = z.object({
  question: z.string().describe('The practice question the student answered.'),
  studentAnswer: z.string().describe('The student\u0027s answer to the question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  topic: z.string().describe('The topic of the question.'),
  pastPerformance: z
    .array(z.object({
      question: z.string(),
      studentAnswer: z.string(),
      correctAnswer: z.string(),
      topic: z.string(),
      isCorrect: z.boolean(),
    }))
    .optional()
    .describe('The student\u0027s past performance on practice questions.'),
});

export type PerformanceAnalysisInput = z.infer<typeof PerformanceAnalysisInputSchema>;

const PerformanceAnalysisOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback based on the student\u0027s answer.'),
  areasForImprovement: z.string().describe('Specific areas where the student needs to improve.'),
  adaptedQuestionTopic: z.string().describe('The topic for the next practice question, adapted based on the student\u0027s weak areas.'),
});

export type PerformanceAnalysisOutput = z.infer<typeof PerformanceAnalysisOutputSchema>;

/**
 * Analyzes student performance on a single question and provides adaptive feedback.
 * @param {PerformanceAnalysisInput} input - The performance data to analyze.
 * @returns {Promise<PerformanceAnalysisOutput>} A promise that resolves to personalized feedback and an adapted topic.
 */
export async function analyzePerformanceAndAdapt(input: PerformanceAnalysisInput): Promise<PerformanceAnalysisOutput> {
  return analyzePerformanceAndAdaptFlow(input);
}

const analyzePerformanceAndAdaptPrompt = ai.definePrompt({
  name: 'analyzePerformanceAndAdaptPrompt',
  input: {schema: PerformanceAnalysisInputSchema},
  output: {schema: PerformanceAnalysisOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized feedback to students based on their performance on practice questions. Analyze the student's answer and provide feedback. Identify areas where the student needs to improve.  Suggest a topic for the next practice question, adapting based on the student's weak areas.

Question: {{{question}}}
Student's Answer: {{{studentAnswer}}}
Correct Answer: {{{correctAnswer}}}
Topic: {{{topic}}}

{{#if pastPerformance}}
Past Performance:
{{#each pastPerformance}}
Question: {{{this.question}}}
Student's Answer: {{{this.studentAnswer}}}
Correct Answer: {{{this.correctAnswer}}}
Topic: {{{this.topic}}}
Is Correct: {{{this.isCorrect}}}
{{/each}}
{{/if}}
`,
});

const analyzePerformanceAndAdaptFlow = ai.defineFlow(
  {
    name: 'analyzePerformanceAndAdaptFlow',
    inputSchema: PerformanceAnalysisInputSchema,
    outputSchema: PerformanceAnalysisOutputSchema,
  },
  async input => {
    const {output} = await analyzePerformanceAndAdaptPrompt(input);
    return output!;
  }
);
