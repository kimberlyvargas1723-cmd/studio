'use client';
import { useState } from 'react';
import type { GeneratedQuiz, GeneratedQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Lightbulb, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type GeneratedQuizProps = {
    quiz: GeneratedQuiz;
    onBack: () => void;
};

export function GeneratedQuiz({ quiz, onBack }: GeneratedQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion: GeneratedQuestion = quiz.questions[currentQuestionIndex];
  const isQuizFinished = currentQuestionIndex >= quiz.questions.length;

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) return;

    setIsAnswered(true);
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  }

  if (isQuizFinished) {
    return (
      <Card className="w-full max-w-2xl mt-4">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">¡Quiz Completado!</CardTitle>
          <CardDescription>Resultado del quiz sobre: {quiz.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-4xl font-bold">
            {score} / {quiz.questions.length}
          </div>
          <p className="text-center text-muted-foreground mt-2">
            Respuestas correctas
          </p>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
           <Button onClick={onBack} className="w-full sm:w-auto" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Resúmenes
          </Button>
          <Button onClick={handleRestartQuiz} className="w-full sm:w-auto">
            Volver a Intentar
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mt-4">
      <CardHeader>
        <CardTitle className="font-headline text-lg">{quiz.title}</CardTitle>
        <CardDescription>Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}</CardDescription>
        <Progress value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} className="mt-2" />
        <p className="pt-4 text-lg">{currentQuestion.question}</p>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer ?? ''}
          onValueChange={setSelectedAnswer}
          disabled={isAnswered}
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-gen-${index}`} />
              <Label htmlFor={`option-gen-${index}`} className="text-base cursor-pointer">{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {isAnswered && (
          <div className="mt-6 space-y-4">
             <Alert variant={isCorrect ? 'default' : 'destructive'} className={isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}>
              {isCorrect ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{isCorrect ? '¡Correcto!' : 'Incorrecto'}</AlertTitle>
              <AlertDescription>
                {isCorrect ? '¡Buen trabajo!' : `La respuesta correcta es: ${currentQuestion.correctAnswer}`}
              </AlertDescription>
            </Alert>
            <Alert>
              <Lightbulb className="h-4 w-4 text-accent" />
              <AlertTitle>Explicación</AlertTitle>
              <AlertDescription>
                {currentQuestion.explanation}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isAnswered ? (
          <Button onClick={handleNextQuestion} className="w-full bg-accent hover:bg-accent/90">
            Siguiente Pregunta
          </Button>
        ) : (
          <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer} className="w-full">
            Enviar Respuesta
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
