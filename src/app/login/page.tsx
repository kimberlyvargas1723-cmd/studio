// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { VairyxIcon } from '@/components/VairyxIcon';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { auth } = useAuth();
  const { toast } = useToast();

  const handleSignUp = async () => {
    if (!auth) return;
    setIsLoading(true);
    try {
      // Crea el usuario con el correo y contraseña proporcionados.
      await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      // Al registrarse exitosamente, Firebase automáticamente inicia sesión.
      // El router en la página principal se encargará de redirigir al onboarding.
      toast({
        title: '¡Cuenta Creada!',
        description: 'Bienvenida a PsicoGuía. Te estamos redirigiendo...',
      });
      // Redirige a la página raíz para que el guardia de enrutamiento decida.
      router.push('/');
    } catch (error: any) {
      console.error(error);
      // Mejora: Manejo de error específico para API bloqueada.
      if (error.code === 'auth/requests-to-this-api-are-blocked' || error.message.includes('identitytoolkit')) {
         toast({
            variant: 'destructive',
            title: 'Error de Configuración del Proyecto',
            description: 'La API de autenticación está bloqueada. Habilita "Identity Toolkit API" en tu consola de Google Cloud.',
            duration: 9000,
        });
      } else {
         toast({
          variant: 'destructive',
          title: 'Error al registrarse',
          description: error.message || 'Por favor, verifica tus datos e intenta de nuevo.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!auth) return;
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      toast({
        title: '¡Bienvenida de nuevo!',
        description: 'Iniciando sesión...',
      });
      // Redirige a la página raíz para que el guardia de enrutamiento decida.
      router.push('/');
    } catch (error: any)
      {
      console.error(error);
      // Este es el error que estás viendo. Requiere habilitar la API en la consola de Google Cloud.
      if (error.code === 'auth/requests-to-this-api-are-blocked' || error.message.includes('identitytoolkit')) {
         toast({
            variant: 'destructive',
            title: 'Error de Configuración del Proyecto',
            description: 'La API de autenticación está bloqueada. Habilita "Identity Toolkit API" en tu consola de Google Cloud.',
            duration: 9000,
        });
      } else {
         toast({
            variant: 'destructive',
            title: 'Error al iniciar sesión',
            description: 'El correo o la contraseña son incorrectos.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
      <VairyxIcon className="h-28 w-28 mb-4" />
      <h1 className="font-headline text-3xl font-bold text-primary mb-2">Bienvenida a PsicoGuía</h1>
      <p className="text-muted-foreground mb-6">Tu viaje para conquistar el examen de admisión comienza aquí.</p>
      <Tabs defaultValue="login" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
          <TabsTrigger value="signup">Crear Cuenta</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Iniciar Sesión</CardTitle>
              <CardDescription>
                Ingresa tus datos para continuar con tu preparación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Correo</Label>
                <Input id="login-email" type="email" placeholder="kimberly@psicoguia.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <Input id="login-password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} disabled={isLoading} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
                 {isLoading && <Loader2 className="animate-spin mr-2" />}
                Entrar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Crear Cuenta</CardTitle>
              <CardDescription>
                Regístrate para guardar tu progreso y personalizar tu estudio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Correo</Label>
                <Input id="signup-email" type="email" placeholder="correo@ejemplo.com" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Contraseña</Label>
                <Input id="signup-password" type="password" placeholder="Mínimo 6 caracteres" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} disabled={isLoading} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSignUp} disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                Registrarme
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
