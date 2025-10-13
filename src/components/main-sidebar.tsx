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
  BarChart3,
  Atom,
  FileText,
  CalendarDays,
} from 'lucide-react';

// Define la estructura y el contenido de los enlaces de navegación de la barra lateral.
const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/study', label: 'Temas de Estudio', icon: BookOpen },
  { href: '/summaries', label: 'Mis Resúmenes', icon: FileText },
  { href: '/practice', label: 'Practicar', icon: Target },
  { href: '/progress', label: 'Mi Progreso', icon: BarChart3 },
  { href: '/schedule', label: 'Mi Horario', icon: CalendarDays },
];

/**
 * Renderiza la barra lateral de navegación principal de la aplicación.
 * 
 * Este componente es responsable de mostrar un menú de navegación coherente en todas las
 * páginas principales. Utiliza el hook `usePathname` de Next.js para detectar la ruta actual
 * y resaltar visualmente el enlace correspondiente, proporcionando al usuario una clara
 * indicación de su ubicación dentro de la aplicación.
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
                // La prop `isActive` determina si el botón debe tener el estilo activo.
                // Usamos `pathname.startsWith(item.href)` para que las sub-rutas
                // (ej. /summaries?id=123) también activen el enlace padre (/summaries).
                // Excepción: el dashboard solo se activa si la ruta es exactamente la misma.
                isActive={item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)}
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
