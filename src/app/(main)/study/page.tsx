// src/app/(main)/study/page.tsx
'use client';

import { Header } from '@/components/header';
import { StudyContentContainer } from '@/components/study-content-container';

/**
 * La página principal de "Temas de Estudio".
 * Renderiza la cabecera y el contenedor principal (`StudyContentContainer`) que
 * gestiona toda la experiencia de estudio. Esta arquitectura mantiene la página
 * limpia y delega la lógica compleja al componente contenedor.
 *
 * @param {{ learningStyle?: string }} props - Props pasadas desde el layout.
 */
export default function StudyPage({ learningStyle }: { learningStyle?: string }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Temas de Estudio" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:flex-row lg:items-start">
        <StudyContentContainer learningStyle={learningStyle} />
      </main>
    </div>
  );
}
