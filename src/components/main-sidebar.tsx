// src/components/main-sidebar.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  FileText,
  CalendarDays,
  Volume2,
  Dumbbell,
  LogOut,
  Atom,
} from 'lucide-react';
import { useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Button } from './ui/button';
import { ProfileAvatar } from './profile-avatar';
import { useDoc } from '@/firebase/firestore/use-doc';

// Define la estructura y el contenido de los enlaces de navegación de la barra lateral.
const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/study', label: 'Temas de Estudio', icon: BookOpen },
  { href: '/summaries', label: 'Mis Resúmenes', icon: FileText },
  { href: '/practice', label: 'Gimnasio Mental', icon: Dumbbell },
  { href: '/progress', label: 'Mi Progreso', icon: BarChart3 },
  { href: '/schedule', label: 'Mi Horario', icon: CalendarDays },
  { href: '/audio', label: 'Audio Lab', icon: Volume2 },
];

/**
 * Renderiza la barra de navegación principal de la aplicación.
 * 
 * Este componente es responsable de mostrar un menú de navegación coherente.
 * Ahora también muestra el avatar del usuario y obtiene datos del perfil desde Firestore.
 */
export function MainSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  // Se corrige la llamada a useDoc para que solo se ejecute cuando user.uid exista.
  const { data: userData } = useDoc(user ? `users/${user.uid}` : null);

  const handleSignOut = async () => {
    if (user) {
      await signOut(user.auth);
      router.push('/login');
    }
  };

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
       <SidebarFooter>
         <div className="flex items-center gap-3 p-2 mb-2">
            {user && (
                <ProfileAvatar
                  uid={user.uid}
                  currentAvatarUrl={userData?.avatarUrl}
                />
            )}
            <div className="flex flex-col truncate">
                <span className="font-semibold text-sidebar-foreground truncate">{userData?.displayName || 'Kimberly'}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
            </div>
        </div>
        <SidebarMenu>
           <SidebarMenuItem>
            <Button variant="ghost" className="w-full justify-start gap-2 p-2" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Cerrar Sesión</span>
            </Button>
           </SidebarMenuItem>
        </SidebarMenu>
       </SidebarFooter>
    </Sidebar>
  );
}
