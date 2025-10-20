'use client';
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Target } from 'lucide-react';

/**
 * @fileoverview
 * Este archivo exporta un conjunto de componentes personalizados de React diseñados para
 * ser utilizados con `ReactMarkdown`. Su propósito es "interceptar" patrones de texto
 * específicos dentro del contenido Markdown (como párrafos que comienzan con "Estrategia:")
 * y renderizarlos como componentes de UI más ricos y visualmente distintivos (como `Alerts`),
 * en lugar de párrafos de texto plano.
 *
 * El objeto `CombinedMarkdownComponents` se pasa a la prop `components` de `ReactMarkdown`.
 */

/**
 * Un componente personalizado para `ReactMarkdown` que renderiza párrafos que
 * comienzan con "Estrategia:" como un bloque de alerta visualmente destacado.
 * @param {{ children?: React.ReactNode }} props - Los nodos hijos pasados por `ReactMarkdown`.
 * @returns {JSX.Element} Un componente de Alerta personalizado o un párrafo estándar.
 */
export const StrategyBlock = ({ children }: { children?: React.ReactNode }): JSX.Element => {
  const childArray = React.Children.toArray(children);
  // Se verifica si el contenido del párrafo es un string que comienza con el patrón.
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
  // Si no coincide, se renderiza un párrafo normal.
  return <p>{children}</p>;
};

/**
 * Un componente personalizado para `ReactMarkdown` que renderiza párrafos que
 * comienzan con "Consejo Final:" como un bloque de alerta final y motivador.
 * @param {{ children?: React.ReactNode }} props - Los nodos hijos pasados por `ReactMarkdown`.
 * @returns {JSX.Element} Un componente de Alerta personalizado o un párrafo estándar.
 */
export const FinalTipBlock = ({ children }: { children?: React.ReactNode }): JSX.Element => {
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


/**
 * Un objeto resolver que se pasa a la prop `components` de `ReactMarkdown`.
 * Su clave `p` sobreescribe el renderizado por defecto de la etiqueta <p>.
 * Inspecciona el contenido del párrafo y decide si debe ser renderizado por uno
 * de nuestros componentes personalizados (`StrategyBlock`, `FinalTipBlock`) o como un párrafo estándar.
 */
export const CombinedMarkdownComponents = {
    p: ({ children }: { children?: React.ReactNode }) => {
        const childArray = React.Children.toArray(children);
        // Verifica si el primer hijo tiene contenido de texto que podamos analizar.
        if (childArray.length > 0 && typeof childArray[0] === 'object' && 'props' in childArray[0]) {
            const textContent = childArray[0].props.children;
            if (typeof textContent === 'string') {
                if (textContent.startsWith('Estrategia:')) {
                    return <StrategyBlock>{children}</StrategyBlock>;
                }
                if (textContent.startsWith('Consejo Final:')) {
                    return <FinalTipBlock>{children}</FinalTipBlock>;
                }
            }
        }
        // Si no se cumple ninguna condición especial, renderiza un párrafo por defecto.
        return <p>{children}</p>;
    },
};
