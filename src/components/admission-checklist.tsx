// src/components/admission-checklist.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { getChecklistState, updateChecklistState } from '@/lib/services';
import { cn } from '@/lib/utils';
import { ExternalLink, ClipboardCheck } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const admissionTasks = [
  {
    id: 'registro',
    title: 'Período de Registros (General y Psicométrico)',
    description: 'Realiza tu registro en línea en el portal de la UANL para el examen de conocimientos y el psicométrico.',
    date: '19 de sep al 15 de oct de 2025',
    link: 'https://www.uanl.mx/aspirantes/',
  },
  {
    id: 'encuesta',
    title: 'Llenar Encuesta CENEVAL y Datos Personales',
    description: 'Completa la encuesta de datos básicos solicitada por CENEVAL como parte de tu registro.',
    date: 'Durante el período de registro',
    link: 'https://www.uanl.mx/aspirantes/',
  },
  {
    id: 'pagoConocimientos',
    title: 'Realizar el Pago del Examen de Conocimientos',
    description: 'Efectúa el pago correspondiente al concurso de ingreso general (EXANI-II). Guarda tu comprobante.',
    date: 'Fecha límite: aprox. 16 de octubre 2025',
    link: 'https://www.uanl.mx/aspirantes/',
  },
  {
    id: 'pagoPsicometrico',
    title: 'Realizar el Pago del Examen Psicométrico',
    description: 'Realiza el pago en Caja de la Facultad o Banorte. ¡No se aceptan transferencias! Descarga el recibo desde el portal de FaPsi.',
    date: 'Durante el período de registro',
    link: 'https://psicologia.uanl.mx/tramites/concurso-de-ingreso-a-licenciatura/',
  },
   {
    id: 'formPsicometrico',
    title: 'Llenar Formulario de Registro Psicométrico',
    description: 'Una vez pagado, llena el formulario en línea de FaPsi para completar tu registro al psicométrico.',
    date: 'Después de realizar el pago',
    link: 'https://psicologia.uanl.mx/tramites/concurso-de-ingreso-a-licenciatura/',
  },
  {
    id: 'pase',
    title: 'Imprimir Pase de Ingreso',
    description: 'Descarga e imprime tu pase de ingreso desde el portal de aspirantes. Es tu identificación para el examen.',
    date: 'Fechas por confirmar (finales de octubre)',
    link: 'https://www.uanl.mx/aspirantes/',
  },
  {
    id: 'examenConocimientos',
    title: 'Presentar el Examen de Conocimientos',
    description: '¡El gran día! Presenta el examen de conocimientos EXANI-II.',
    date: 'Sábado 8 de noviembre de 2025',
    link: 'https://www.uanl.mx/aspirantes/',
  },
  {
    id: 'examenPsicometrico',
    title: 'Presentar el Examen Psicométrico',
    description: 'Mantente al pendiente de tu correo. Recibirás el enlace y las instrucciones para presentar el examen en línea.',
    date: 'Fechas por confirmar (noviembre 2025)',
    link: '#',
  },
   {
    id: 'resultados',
    title: 'Publicación de Resultados',
    description: 'Consulta los resultados en la página oficial de la UANL.',
    date: 'Fechas por confirmar (diciembre 2025)',
    link: 'https://www.uanl.mx/aspirantes/',
  },
];

/**
 * Renders an interactive, collapsible checklist for the university admission process.
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
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                  <ClipboardCheck className="h-8 w-8 text-primary" />
                  <div>
                      <CardTitle className="font-headline text-xl">Misión Admisión 2025</CardTitle>
                      <CardDescription>Tu checklist para no perderte ningún paso del concurso de ingreso.</CardDescription>
                  </div>
              </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
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
        </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
