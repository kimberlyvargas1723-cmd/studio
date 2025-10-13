// src/components/generated-quiz.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Lightbulb, ArrowLeft, Timer } from 'lucide-react';
import { useQuiz } from '@/hooks/use-quiz';
import type { GeneratedQuiz } from '@/lib/types';
import { cn } from '@/lib/utils';

type GeneratedQuizProps = {
    quiz: GeneratedQuiz;
    onBack: () => void;
    onQuizFeedback?: (result: 'correct' | 'incorrect') => void;
    learningStyle?: string;
};

/**
 * Renders an interactive quiz by orchestrating the useQuiz hook.
 * This component is now a lightweight wrapper that displays different views
 * (question, results) based on the state managed by the useQuiz hook.
 *
 * @param {GeneratedQuizProps} props - The quiz data and callbacks.
 */
export function GeneratedQuiz({ quiz, onBack, onQuizFeedback, learningStyle }: GeneratedQuizProps) {
  const {
    currentQuestion,
    isQuizFinished,
    selectedAnswer,
    isAnswered,
    isCorrect,
    feedback,
    isLoading,
    score,
    timeLeft,
    setSelectedAnswer,
    handleAnswerSubmit,
    handleNextQuestion,
    handleRestartQuiz,
    formatTime,
  } = useQuiz({ quiz, onQuizFeedback, learningStyle });

  if (isQuizFinished) {
    return (
      <Card className="w-full max-w-2xl mt-4">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            ¡Práctica Completada!
          </CardTitle>
          <CardDescription>
            {`Resultado de la práctica sobre: ${quiz.title}`}
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
            Puedes revisar tu retroalimentación detallada en la sección "Mi Progreso".
           </p>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={onBack} className="w-full sm:w-auto" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Práctica
            </Button>
            <Button onClick={handleRestartQuiz} className="w-full sm-w-auto">
                Volver a Intentar
            </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mt-4">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="self-start -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
            </Button>
            <div className="flex-1 text-center">
                <CardTitle className="font-headline text-lg">{quiz.title}</CardTitle>
                <CardDescription>Pregunta {quiz.questions.indexOf(currentQuestion) + 1} de {quiz.questions.length}</CardDescription>
            </div>
            {quiz.isPsychometric && timeLeft !== null ? (
                <div className="flex items-center gap-2 text-lg font-semibold text-primary w-28 justify-end">
                    <Timer className="h-5 w-5" />
                    {formatTime(timeLeft)}
                </div>
            ) : <div className="w-28"/>}
        </div>
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

        {isAnswered && (
          <div className="mt-6 space-y-4">
             <Alert variant={isCorrect ? 'default' : 'destructive'} className={cn(
                 "flex items-center",
                 isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'border-destructive bg-red-50 dark:bg-red-900/20'
              )}>
              {isCorrect ? <CheckCircle className="h-5 w-5 mr-2 text-green-500" /> : <XCircle className="h-5 w-5 mr-2 text-destructive" />}
              <div>
                <AlertTitle>{isCorrect ? '¡Correcto!' : 'Incorrecto'}</AlertTitle>
                <AlertDescription className={cn(isCorrect ? 'text-green-700 dark:text-green-300' : 'text-destructive-foreground')}>
                  La respuesta correcta es: {currentQuestion.correctAnswer}
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
            {isLoading && !quiz.isPsychometric && (
              <div className="flex items-center gap-2 text-muted-foreground p-4 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analizando tu respuesta y adaptando tu ruta...
              </div>
            )}
            {feedback && !isLoading && !quiz.isPsychometric && (
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
          <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer || isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Respuesta
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
