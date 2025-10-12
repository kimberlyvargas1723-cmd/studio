'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Target } from 'lucide-react';

/**
 * A custom component to render paragraphs that start with "Estrategia:"
 * as a visually distinct "Strategy Block".
 */
export const StrategyBlock = ({ children }: { children?: React.ReactNode }) => {
  // We need to check if the children are in the expected format.
  const childArray = React.Children.toArray(children);
  if (childArray.length > 0 && typeof childArray[0] === 'object' && 'props' in childArray[0]) {
    const textContent = childArray[0].props.children;
    if (typeof textContent === 'string' && textContent.startsWith('Estrategia:')) {
      const strategyText = textContent.replace('Estrategia:', '').trim();
      return (
        <Alert className="my-4 border-blue-500/50 text-blue-700 dark:text-blue-300">
          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="font-bold text-blue-800 dark:text-blue-400">Estrategia Clave</AlertTitle>
          <AlertDescription className="prose-p:m-0">
            {strategyText}
          </AlertDescription>
        </Alert>
      );
    }
  }
  // Render as a normal paragraph if it doesn't match the criteria.
  return <p>{children}</p>;
};

/**
 * A custom component to render paragraphs that start with "Consejo Final:"
 * as a visually distinct "Final Tip Block".
 */
export const FinalTipBlock = ({ children }: { children?: React.ReactNode }) => {
  const childArray = React.Children.toArray(children);
  if (childArray.length > 0 && typeof childArray[0] === 'object' && 'props' in childArray[0]) {
    const textContent = childArray[0].props.children;
    if (typeof textContent === 'string' && textContent.startsWith('Consejo Final:')) {
      const tipText = textContent.replace('Consejo Final:', '').trim();
      return (
        <Alert className="my-6 bg-green-50 border-green-500/60 dark:bg-green-950 dark:border-green-700/80">
          <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle className="font-bold text-green-800 dark:text-green-300">Consejo Final</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300/90 prose-p:m-0">
            {tipText}
          </AlertDescription>
        </Alert>
      );
    }
  }
  return <p>{children}</p>;
};

