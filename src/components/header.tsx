'use client';
import {
  SidebarTrigger,
} from '@/components/ui/sidebar';

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="font-headline text-lg font-semibold md:text-2xl">{title}</h1>
      <div className="ml-auto flex items-center gap-4">
        {/* User menu can be added back here later */}
      </div>
    </header>
  );
}
