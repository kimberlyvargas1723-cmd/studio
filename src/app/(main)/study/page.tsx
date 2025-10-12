// src/app/(main)/study/page.tsx
'use client';

import { Header } from '@/components/header';
import { StudyContentContainer } from '@/components/study-content-container';

/**
 * The main container component for the Study page.
 * It renders the header and the primary content container which manages the
 * entire study experience, including resource selection, content fetching,
 * summarization, and image text extraction.
 * The page uses a two-column layout on desktop and passes down the learning style.
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
