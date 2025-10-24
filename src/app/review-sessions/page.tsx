// src/app/review-sessions/page.tsx
'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { Header } from '@/components/header';
import { ReviewSessionsList } from '@/components/review-sessions-list';

export default function ReviewSessionsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header title="Sesiones de Repaso" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <ReviewSessionsList />
      </main>
    </div>
  );
}
