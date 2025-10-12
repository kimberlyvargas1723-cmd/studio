// src/components/admission-checklist.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { getChecklistState, updateChecklistState } from '@/lib/services';
import { cn } from '@/lib/utils';
import { ExternalLink, ClipboardCheck } from 'lucide-react';

const admissionTasks = [
  {
    id: 'registro',
    title: 'Período de Registros',
    description: 'Realiza tu registro en línea en el portal de la UANL. Es el primer paso indispensable.',
    date: '19 de abril al 21 de mayo',
    link: 'https://www.uanl.mx/tramites/concurso-de-ingreso-a-licenciatura/',
  },
  {
    id: 'encuesta',
    title: 'Llenar Encuesta CENEVAL',
    description: 'Completa la encuesta de datos básicos solicitada por el CENEVAL. Es un requisito obligatorio.',
    date: 'Durante el período de registro',
    link: 'https://www.uanl.mx/tramites/concurso-de-ingreso-a-licenciatura/',
  },
  {
    id: 'pago',
    title: 'Realizar el Pago del Examen',
    description: 'Efectúa el pago correspondiente al concurso de ingreso. Guarda tu comprobante.',
    date: 'Fecha límite: 22 de mayo',
    link: 'https://www.uanl.mx/tramites/concurso-de-ingreso-a-licenciatura/',
  },
  {
    id: 'documentos',
    title: 'Carga de Documentos',
    description: 'Sube tu fotografía, identificación y documentos académicos al sistema.',
    date: 'Durante el período de registro',
    link: 'https://www.uanl.mx/tramites/concurso-de-ingreso-a-licenciatura/',
  },
  {
    id: 'pase',
    title: 'Imprimir Pase de Ingreso',
    description: 'Descarga e imprime tu pase de ingreso. Es tu identificación para el día del examen.',
    date: 'A partir del 27 de mayo',
    link: 'https://www.uanl.mx/tramites/concurso-de-ingreso-a-licenciatura/',
  },
  {
    id: 'examen',
    title: 'Presentar el Examen',
    description: '¡El gran día! Presenta el examen de conocimientos y el psicométrico.',
    date: 'Sábado 1 de junio',
    link: 'https://www.uanl.mx/tramites/concurso-de-ingreso-a-licenciatura/',
  },
   {
    id: 'resultados',
    title: 'Publicación de Resultados',
    description: 'Consulta los resultados en la página oficial de la UANL.',
    date: '21 al 28 de junio',
    link: 'https://www.uanl.mx/tramites/concurso-de-ingreso-a-licenciatura/',
  },
];

/**
 * Renders an interactive checklist for the university admission process.
 * It allows users to track their progress, see important dates, and access
 * official links for each step. State is persisted to localStorage.
 */
export function AdmissionChecklist() {
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load the initial state from localStorage when the component mounts on the client.
    setCheckedState(getChecklistState());
  }, []);

  const handleCheckboxChange = (taskId: string, isChecked: boolean) => {
    setCheckedState(prevState => ({ ...prevState, [taskId]: isChecked }));
    updateChecklistState(taskId, isChecked);
  };
  
  const allTasksCompleted = admissionTasks.every(task => checkedState[task.id]);

  return (
    <Card className="w-full">
        <CardHeader>
            <div className="flex items-center gap-3">
                <ClipboardCheck className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="font-headline text-xl">Misión Admisión 2025</CardTitle>
                    <CardDescription>Tu checklist para no perderte ningún paso del concurso de ingreso.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            {allTasksCompleted && (
                <div className="mb-4 p-4 text-center bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <p className="font-bold text-green-700 dark:text-green-300">¡Felicidades! Has completado todos los pasos administrativos. ¡Ahora a enfocarte 100% en el estudio!</p>
                </div>
            )}
            <div className="space-y-4">
            {admissionTasks.map((task, index) => (
                <div key={task.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                    <Checkbox
                    id={task.id}
                    checked={checkedState[task.id] || false}
                    onCheckedChange={(checked) => handleCheckboxChange(task.id, !!checked)}
                    className="h-6 w-6 mt-1"
                    />
                    {index < admissionTasks.length - 1 && (
                    <div className="w-px h-16 bg-border mt-2" />
                    )}
                </div>
                <div className="flex-1">
                    <label
                    htmlFor={task.id}
                    className={cn(
                        'font-semibold text-base transition-colors',
                        checkedState[task.id] ? 'line-through text-muted-foreground' : ''
                    )}
                    >
                    {task.title}
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                    {task.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                         <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                            {task.date}
                        </span>
                        <Button variant="ghost" size="sm" asChild>
                            <a href={task.link} target="_blank" rel="noopener noreferrer">
                                Ir al sitio oficial
                                <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                        </Button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </CardContent>
    </Card>
  );
}
