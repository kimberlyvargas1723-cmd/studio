'use client';
import { useState } from 'react';
import { practiceQuestions } from '@/lib/data';
import type { PracticeQuestion, PerformanceData, Feedback } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { analyzePerformanceAndAdapt } from '@/ai/flows/personalized-feedback-adaptation';
import { Loader2, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';


export function PracticeQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion: PracticeQuestion = practiceQuestions[currentQuestionIndex];
  const isQuizFinished = currentQuestionIndex >= practiceQuestions.length;

  const updatePerformanceData = (topic: string, wasCorrect: boolean) => {
    const perfData: PerformanceData[] = JSON.parse(localStorage.getItem('performanceData') || '[]');
    let topicPerf = perfData.find(p => p.topic === topic);
    if (!topicPerf) {
        topicPerf = { topic, correct: 0, incorrect: 0 };
        perfData.push(topicPerf);
    }
    if(wasCorrect) {
        topicPerf.correct += 1;
    } else {
        topicPerf.incorrect += 1;
    }
    localStorage.setItem('performanceData', JSON.stringify(perfData));
  }

  const saveFeedback = (feedbackData: Feedback) => {
    const history: Feedback[] = JSON.parse(localStorage.getItem('feedbackHistory') || '[]');
    history.unshift(feedbackData); // Add to the beginning
    localStorage.setItem('feedbackHistory', JSON.stringify(history.slice(0, 20))); // Keep last 20
  }

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
      const result = await analyzePerformanceAndAdapt({
        question: currentQuestion.question,
        studentAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        topic: currentQuestion.topic,
      });
      const newFeedback: Feedback = {...result, timestamp: new Date().toISOString()};
      setFeedback(newFeedback);
      saveFeedback(newFeedback);
    } catch (error) {
      console.error("Error getting feedback:", error);
      const errorFeedback: Feedback = {
        feedback: "No se pudo obtener la retroalimentación. Por favor, intenta de nuevo.",
        areasForImprovement: "N/A",
        adaptedQuestionTopic: currentQuestion.topic,
        timestamp: new Date().toISOString(),
      }
      setFeedback(errorFeedback);
      saveFeedback(errorFeedback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback(null);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback(null);
  }

  if (isQuizFinished) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">¡Quiz Completado!</CardTitle>
          <CardDescription>Este es tu resultado final.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-4xl font-bold">
            {score} / {practiceQuestions.length}
          </div>
          <p className="text-center text-muted-foreground mt-2">
            Respuestas correctas
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRestartQuiz} className="w-full">
            Volver a Intentar
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{currentQuestion.topic}</CardTitle>
        <CardDescription>Pregunta {currentQuestionIndex + 1} de {practiceQuestions.length}</CardDescription>
        <Progress value={((currentQuestionIndex + 1) / practiceQuestions.length) * 100} className="mt-2" />
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
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">{option}</Label>
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
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando retroalimentación personalizada...
              </div>
            )}
            {feedback && (
              <Alert className="border-primary">
                <Lightbulb className="h-4 w-4 text-primary" />
                <AlertTitle>Retroalimentación IA</AlertTitle>
                <AlertDescription>
                  <p className="font-semibold">Feedback:</p>
                  <p>{feedback.feedback}</p>
                  <p className="mt-2 font-semibold">Áreas de mejora:</p>
                  <p>{feedback.areasForImprovement}</p>
                   <p className="mt-2 font-semibold">Sugerencia de tema:</p>
                  <p>{feedback.adaptedQuestionTopic}</p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isAnswered ? (
          <Button onClick={handleNextQuestion} className="w-full bg-accent hover:bg-accent/90">
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
