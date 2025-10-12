// src/components/generated-quiz.tsx
'use client';
import { useState } from 'react';
import type { GeneratedQuiz, GeneratedQuestion, Feedback } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Lightbulb, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { analyzePerformanceAndAdapt } from '@/ai/flows/personalized-feedback-adaptation';
import { updatePerformanceData, saveFeedback } from '@/lib/services';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';


type GeneratedQuizProps = {
    quiz: GeneratedQuiz;
    onBack: () => void;
    isDiagnostic?: boolean;
};

/**
 * Renders an interactive quiz. It can be a topic-specific quiz or a diagnostic quiz.
 * It manages the quiz state, including the current question, user's score,
 * and feedback process after each answer.
 *
 * @param {GeneratedQuizProps} props - The quiz data, a callback for the back button, and a flag for diagnostic mode.
 */
export function GeneratedQuiz({ quiz, onBack, isDiagnostic = false }: GeneratedQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const currentQuestion: GeneratedQuestion = quiz.questions[currentQuestionIndex];
  const isQuizFinished = currentQuestionIndex >= quiz.questions.length;

  /**
   * Handles the submission of an answer. It checks for correctness, updates the score,
   * stores performance data, and fetches personalized feedback from the AI.
   */
  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) return;

    setIsLoading(true);
    setIsAnswered(true);
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
    
    updatePerformanceData(currentQuestion.topic, correct);
    

    try {
      if (!isDiagnostic) {
          const result = await analyzePerformanceAndAdapt({
            question: currentQuestion.question,
            studentAnswer: selectedAnswer,
            correctAnswer: currentQuestion.correctAnswer,
            topic: currentQuestion.topic,
          });
          const newFeedback: Feedback = {...result, timestamp: new Date().toISOString(), topic: currentQuestion.topic};
          setFeedback(newFeedback);
          saveFeedback(newFeedback);
      }
    } catch (error) {
      console.error("Error getting feedback:", error);
      if (!isDiagnostic) {
          const errorFeedback: Feedback = {
            feedback: "No se pudo obtener la retroalimentación. Por favor, intenta de nuevo.",
            areasForImprovement: "N/A",
            adaptedQuestionTopic: currentQuestion.topic,
            timestamp: new Date().toISOString(),
            topic: currentQuestion.topic,
          }
          setFeedback(errorFeedback);
          saveFeedback(errorFeedback);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Moves to the next question in the quiz, resetting the state for the new question.
   */
  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback(null);
  };

  /**
   * Resets the quiz to the beginning, clearing the score and all question states.
   */
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback(null);
  }

  const handleFinishDiagnostic = () => {
      localStorage.setItem('onboardingComplete', 'true');
      router.push('/dashboard');
  }

  // Render the quiz completion summary if all questions have been answered.
  if (isQuizFinished) {
    return (
      <Card className="w-full max-w-2xl mt-4">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            {isDiagnostic ? '¡Diagnóstico Completado!' : '¡Quiz Completado!'}
          </CardTitle>
          <CardDescription>
            {isDiagnostic 
              ? 'Hemos evaluado tu conocimiento inicial. ¡Ya estás lista para empezar a estudiar!' 
              : `Resultado del quiz sobre: ${quiz.title}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-4xl font-bold">
            {score} / {quiz.questions.length}
          </div>
          <p className="text-center text-muted-foreground mt-2">
            Respuestas correctas
          </p>
           <p className="text-center text-sm text-muted-foreground mt-4">
            {isDiagnostic 
                ? 'Tus resultados se han guardado. Ahora te llevaremos al panel principal.'
                : 'Puedes revisar tu retroalimentación detallada en la sección "Mi Progreso".'
            }
           </p>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
            {isDiagnostic ? (
                <Button onClick={handleFinishDiagnostic} className="w-full">
                    Ir al Dashboard
                </Button>
            ) : (
                <>
                 <Button onClick={onBack} className="w-full sm:w-auto" variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Elegir otro Tema
                </Button>
                <Button onClick={handleRestartQuiz} className="w-full sm:w-auto">
                    Volver a Intentar
                </Button>
                </>
            )}
        </CardFooter>
      </Card>
    );
  }

  // Render the current question.
  return (
    <Card className="w-full max-w-2xl mt-4">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
            {!isDiagnostic && (
              <Button variant="ghost" size="sm" onClick={onBack} className="self-start -ml-2">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
              </Button>
            )}
            <div className="flex-1 text-center">
                <CardTitle className="font-headline text-lg">{quiz.title}</CardTitle>
                <CardDescription>Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}</CardDescription>
            </div>
            {!isDiagnostic && <div className="w-20"></div>}
        </div>
        <Progress value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} />
        <p className="pt-6 text-lg text-center font-semibold">{currentQuestion.question}</p>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer ?? ''}
          onValueChange={setSelectedAnswer}
          disabled={isAnswered}
          className="space-y-3"
        >
          {currentQuestion.options.map((option, index) => (
            <Label 
                key={index}
                htmlFor={`option-gen-${index}`}
                className={cn(
                    "flex items-center space-x-3 p-4 rounded-md border transition-colors cursor-pointer",
                    "hover:bg-accent",
                    selectedAnswer === option && "bg-accent border-primary",
                    isAnswered && option === currentQuestion.correctAnswer && "border-green-500 bg-green-50 dark:bg-green-900/20",
                    isAnswered && selectedAnswer === option && option !== currentQuestion.correctAnswer && "border-destructive bg-red-50 dark:bg-red-900/20",
                )}
            >
              <RadioGroupItem value={option} id={`option-gen-${index}`} className="h-5 w-5" />
              <span className="text-base font-normal">{option}</span>
            </Label>
          ))}
        </RadioGroup>

        {/* Display feedback and explanation after an answer is submitted */}
        {isAnswered && (
          <div className="mt-6 space-y-4">
             <Alert variant={isCorrect ? 'default' : 'destructive'} className={cn(
                 "flex items-center",
                 isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'border-destructive bg-red-50 dark:bg-red-900/20 text-destructive'
              )}>
              {isCorrect ? <CheckCircle className="h-5 w-5 mr-2 text-green-500" /> : <XCircle className="h-5 w-5 mr-2" />}
              <div>
                <AlertTitle>{isCorrect ? '¡Correcto!' : 'Incorrecto'}</AlertTitle>
                <AlertDescription className="text-current">
                  {isCorrect ? '¡Excelente trabajo!' : `La respuesta correcta es: ${currentQuestion.correctAnswer}`}
                </AlertDescription>
              </div>
            </Alert>
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Explicación</AlertTitle>
              <AlertDescription>
                {currentQuestion.explanation}
              </AlertDescription>
            </Alert>
            {isLoading && !isDiagnostic && (
              <div className="flex items-center gap-2 text-muted-foreground p-4 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analizando tu respuesta y adaptando tu ruta...
              </div>
            )}
            {feedback && !isLoading && !isDiagnostic && (
              <Alert className="border-primary">
                <Lightbulb className="h-4 w-4 text-primary" />
                <AlertTitle>Retroalimentación Personalizada de Vairyx</AlertTitle>
                <AlertDescription>
                  <p className="font-semibold mt-2">Sugerencia:</p>
                  <p>{feedback.feedback}</p>
                  <p className="mt-2 font-semibold">Área de mejora sugerida:</p>
                  <p>{feedback.areasForImprovement}</p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isAnswered ? (
          <Button onClick={handleNextQuestion} className="w-full">
            Siguiente Pregunta
          </Button>
        ) : (
          <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer || (isLoading && !isDiagnostic)} className="w-full">
            {isLoading && !isDiagnostic && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Respuesta
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
