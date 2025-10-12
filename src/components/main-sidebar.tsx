// src/components/main-sidebar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Sparkles,
  BarChart3,
  Atom,
  FileText,
  CalendarDays,
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/study', label: 'Temas de Estudio', icon: BookOpen },
  { href: '/summaries', label: 'Mis Resúmenes', icon: FileText },
  { href: '/practice', label: 'Practicar', icon: Target },
  { href: '/assistant', label: 'Asistente IA', icon: Sparkles },
  { href: '/progress', label: 'Mi Progreso', icon: BarChart3 },
  { href: '/schedule', label: 'Mi Horario', icon: CalendarDays },
];

/**
 * Renders the main sidebar navigation for the application.
 * It displays a list of navigation links with icons and highlights the active link
 * based on the current URL pathname.
 */
export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Atom className="h-8 w-8 text-primary" />
          <h2 className="text-xl font-bold text-sidebar-foreground font-headline">PsicoGuía</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
