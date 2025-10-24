// src/app/debate-rooms/page.tsx
'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


import { Header } from '@/components/header';
import { DebateRoomsList } from '@/components/debate-rooms-list';

export default function DebateRoomsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header title="Salas de Debate" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <DebateRoomsList />
      </main>
    </div>
  );
}
