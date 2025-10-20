// src/ai/flows/generate-study-plan.ts
'use server';
/**
 * @fileOverview Flow to generate a dynamic and personalized study plan.
 *
 * This file defines an AI flow that creates a weekly study plan based on a student's
 * performance data and the number of days remaining until their exam. It prioritizes
 * weak areas and incorporates spaced repetition for strengths.
 *
 * - `generateStudyPlan`: The main function to trigger the plan generation.
 */

import { ai } from '@/ai/genkit';
import {
  StudyPlanInputSchema,
  type StudyPlanInput,
  StudyPlanOutputSchema,
  type StudyPlanOutput
} from '@/ai/schemas';

/**
 * Generates a personalized study plan based on the student's performance data.
 * @param {StudyPlanInput} input - An object containing student performance data and days until the exam.
 * @returns {Promise<StudyPlanOutput>} A promise that resolves with the generated study plan.
 */
export async function generateStudyPlan(input: StudyPlanInput): Promise<StudyPlanOutput> {
  return generateStudyPlanFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateStudyPlanPrompt',
  input: { schema: StudyPlanInputSchema },
  output: { schema: StudyPlanOutputSchema },
  prompt: `You are an expert academic advisor AI named Vairyx. You are creating a personalized study plan for Kimberly, who is preparing for her UANL Psychology entrance exam.

You will receive her performance data (correct vs. incorrect answers per topic) and the total number of days until her exam.

Your task is to create a structured, weekly study plan that helps her improve her weak areas while reinforcing her strengths.

Here are the rules:
1.  **Analyze Performance:** Identify topics with the lowest accuracy (correct / (correct + incorrect)). These are the 'weak areas'. Topics with high accuracy are 'strengths'. If there is no data (0 correct, 0 incorrect), treat it as a neutral topic to be covered.
2.  **Prioritize Weak Areas:** The plan should focus more heavily on weak areas, especially in the initial weeks. Schedule 2-3 sessions for each weak topic.
3.  **Apply Spaced Repetition:** Schedule review sessions for strength areas. A review session should be marked with \`isReview: true\`. These should be interspersed throughout the plan.
4.  **Structure:** The output must be an array of weekly plans. Each week should have a clear focus. Each day should have a single, actionable task.
5.  **Task Generation:** Tasks should be specific. Instead of "Study Biology", say "Repasar el sistema nervioso central y periférico en 'Bases Biológicas de la Conducta'". Suggest taking quizzes for review.
6.  **Timeline:** Distribute the topics across the available days, creating as many weeks as needed. The last few days before the exam should be dedicated to general review and rest.
7.  **Language:** All output, including tasks, topics, and focus descriptions, must be in Spanish.
8.  **Today's Date:** For generating dates, assume today is {{currentDate}}. The first task should be for today. Generate dates for each task in 'Mmm DD' format (e.g., 'Jul 29').

Student Performance Data:
{{#each performanceData}}
- Topic: {{topic}}, Correct: {{correct}}, Incorrect: {{incorrect}}
{{/each}}

Days Until Exam: {{daysUntilExam}}

Generate the study plan now.`,
});

const generateStudyPlanFlow = ai.defineFlow(
  {
    name: 'generateStudyPlanFlow',
    inputSchema: StudyPlanInputSchema,
    outputSchema: StudyPlanOutputSchema,
  },
  async (input) => {
    // Augment the prompt input with the current date to ensure the plan is timely.
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const promptInput = {
        ...input,
        currentDate,
    };

    const { output } = await prompt(promptInput);
    return output!;
  }
);
