// src/components/generated-quiz.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Lightbulb, ArrowLeft, Timer, Youtube, FileText } from 'lucide-react';
import { useQuiz } from '@/hooks/use-quiz';
import type { GeneratedQuiz } from '@/lib/types';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

/**
 * Define las props para el componente `GeneratedQuiz`.
 * @param {GeneratedQuiz} quiz - El objeto de datos del quiz a renderizar.
 * @param {() => void} onBack - Callback para volver a la pantalla anterior.
 * @param {(result: 'correct' | 'incorrect') => void} [onQuizFeedback] - Callback para notificar al layout del resultado.
 * @param {string} [learningStyle] - El estilo de aprendizaje del usuario para el feedback adaptativo.
 */
type GeneratedQuizProps = {
    quiz: GeneratedQuiz;
    onBack: () => void;
    onQuizFeedback?: (result: 'correct' | 'incorrect') => void;
    learningStyle?: string;
};

/**
 * Renderiza un quiz interactivo orquestando el hook `useQuiz`.
 * Este componente es un wrapper que muestra diferentes vistas (pregunta, resultados)
 * basándose en el estado gestionado por el hook `useQuiz`.
 *
 * @param {GeneratedQuizProps} props - Los datos del quiz y los callbacks.
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

  // Vista de resultados al finalizar el quiz.
  if (isQuizFinished) {
    return (
      <Card className="w-full max-w-2xl mt-4 animate-fade-in-up">
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
            <Button onClick={handleRestartQuiz} className="w-full sm:w-auto">
                Volver a Intentar
            </Button>
        </CardFooter>
      </Card>
    );
  }

  // Vista principal del quiz.
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
            {/* Muestra el temporizador solo si está definido en el quiz. */}
            {quiz.timeLimit && timeLeft !== null ? (
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
                    "hover:bg-accent/50",
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
          <div className="mt-6 space-y-4 animate-fade-in-up">
             <Alert variant={isCorrect ? 'default' : 'destructive'} className={cn(
                 "flex items-center",
                 isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'border-destructive bg-red-50 dark:bg-red-900/20'
              )}>
              {isCorrect ? <CheckCircle className="h-5 w-5 mr-2 text-green-500" /> : <XCircle className="h-5 w-5 mr-2 text-destructive" />}
              <div>
                <AlertTitle>{isCorrect ? '¡Correcto!' : 'Incorrecto'}</AlertTitle>
                <AlertDescription className={cn(isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300')}>
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
            {/* Solo muestra feedback de IA para quizzes de aprendizaje, no de simulación. */}
            {!quiz.isPsychometric && (
              isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground p-4 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analizando tu respuesta y adaptando tu ruta...
                </div>
              ) : feedback && (
                <Alert className="border-primary bg-primary/5">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <AlertTitle className="font-bold text-primary">Sugerencia de Vairyx</AlertTitle>
                  <AlertDescription>
                    <div className="prose prose-sm dark:prose-invert max-w-none mt-2">
                       <ReactMarkdown>{feedback.feedback}</ReactMarkdown>
                    </div>
                    <p className="mt-3 font-semibold">Área de mejora:</p>
                    <p>{feedback.areasForImprovement}</p>
                     <div className="mt-4">
                        {feedback.nextStep.type === 'question' && (
                             <p>Sugerencia: Practicar con una pregunta sobre **{feedback.nextStep.value}**.</p>
                        )}
                         {feedback.nextStep.type === 'summary' && (
                            <Button asChild size="sm" variant="outline">
                               <Link href={`/summaries`}>
                                    <FileText className="mr-2"/>
                                    Ir a Resúmenes de {feedback.nextStep.value}
                                </Link>
                            </Button>
                        )}
                        {feedback.nextStep.type === 'youtube' && (
                           <Button asChild size="sm" variant="secondary" className="bg-red-100 dark:bg-red-900/30 border-red-500/50 hover:bg-red-200 dark:hover:bg-red-900">
                                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(feedback.nextStep.value)}`} target="_blank" rel="noopener noreferrer">
                                    <Youtube className="mr-2 text-red-600"/>
                                    Buscar en YouTube: "{feedback.nextStep.value}"
                                </a>
                            </Button>
                        )}
                    </div>
                  </AlertDescription>
                </Alert>
              )
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
