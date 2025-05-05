# Test Memory - Implementación de Autenticación

## Visión General

Test Memory utiliza Supabase Auth para gestionar la autenticación de usuarios. Supabase proporciona un sistema completo de autenticación con múltiples proveedores, gestión de sesiones y APIs seguras.

## Configuración Básica

La autenticación ya está configurada en el proyecto con las siguientes características:

1. Autenticación con email/password
2. Middleware para proteger rutas
3. Sincronización automática de usuarios con la tabla `profiles`

## Implementación de Autenticación

### 1. Cliente de Supabase

Para crear el cliente de Supabase, utilizamos las variables de entorno configuradas:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 2. AuthProvider

Para manejar la autenticación en toda la aplicación, debemos implementar un AuthProvider:

```typescript
// lib/auth-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          username: userData.username,
          full_name: userData.fullName,
          avatar_url: userData.avatarUrl,
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 3. Middleware para Proteger Rutas

Para proteger rutas que requieren autenticación, necesitamos implementar un middleware:

```typescript
// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  // Rutas protegidas (requieren autenticación)
  const protectedRoutes = ['/profile', '/disciplines'];
  
  // Rutas de autenticación (solo accesibles sin autenticación)
  const authRoutes = ['/login', '/register'];

  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Redirigir usuarios no autenticados fuera de rutas protegidas
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirigir usuarios autenticados fuera de rutas de autenticación
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 4. Componentes de Autenticación

#### Página de Registro

Implementa un formulario de registro en `src/app/(auth)/register/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signUp(
        formData.email, 
        formData.password, 
        {
          username: formData.username,
          fullName: formData.fullName,
          avatarUrl: '',
        }
      );

      if (error) {
        setError(error.message);
      } else {
        router.push('/login?registered=true');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Registro</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Crea una cuenta para comenzar a entrenar tu memoria
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username">Nombre de usuario</label>
          <Input
            id="username"
            name="username"
            placeholder="username"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="fullName">Nombre completo</label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Nombre completo"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            name="email"
            placeholder="ejemplo@email.com"
            required
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Contraseña</label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            required
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}
        <Button
          className="w-full"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Button>
        <div className="text-center text-sm">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="underline">
            Iniciar sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
```

#### Página de Inicio de Sesión

Implementa un formulario de inicio de sesión en `src/app/(auth)/login/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === 'true';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Accede a tu cuenta para continuar
        </p>
      </div>
      {justRegistered && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950 dark:text-green-400">
          ¡Registro exitoso! Por favor, inicia sesión para continuar.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            name="email"
            placeholder="ejemplo@email.com"
            required
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Contraseña</label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            required
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}
        <Button
          className="w-full"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
        <div className="text-center text-sm">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="underline">
            Regístrate
          </Link>
        </div>
      </form>
    </div>
  );
}
```

### 5. Perfil de Usuario

Para permitir a los usuarios ver y editar su perfil:

```tsx
// src/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Profile() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      setFormData({
        username: data.username || '',
        full_name: data.full_name || '',
        bio: data.bio || '',
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.full_name,
          bio: formData.bio,
          updated_at: new Date(),
        })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      setSuccessMessage('Perfil actualizado correctamente');
      setIsEditing(false);
      fetchProfile();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return <div className="p-6 text-center">Cargando perfil...</div>;
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <Button variant="outline" onClick={handleSignOut}>
          Cerrar sesión
        </Button>
      </div>

      {!isEditing ? (
        <div className="space-y-8">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-800">
              {/* Avatar placeholder */}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{profile.full_name || 'Nombre no definido'}</h2>
              <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>
              <p className="mt-2">{profile.bio || 'Sin biografía'}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setIsEditing(true)}>Editar perfil</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username">Nombre de usuario</label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="full_name">Nombre completo</label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="bio">Biografía</label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950 dark:text-green-400">
              {successMessage}
            </div>
          )}

          <div className="flex space-x-4 justify-end">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar cambios</Button>
          </div>
        </form>
      )}
    </div>
  );
}
```

## Integración con Layout Principal

Para utilizar el AuthProvider en toda la aplicación, debemos añadirlo al layout principal:

```tsx
// src/app/layout.tsx
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-provider"; // Añadir esta línea
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Test Memory",
  description: "Entrena y compite en pruebas de memoria",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider> {/* Añadir este componente */}
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Actualización de la Barra de Navegación

Para mostrar diferentes opciones según el estado de autenticación:

```tsx
// src/components/navbar.tsx
'use client';

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/lib/auth-provider";

export function Navbar() {
  const { user, isLoading } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="font-bold text-xl">
            Test Memory
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/disciplines"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Disciplinas
            </Link>
            <Link
              href="/records"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Récords
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Acerca de
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!isLoading && (
            <>
              {user ? (
                <Link
                  href="/profile"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Mi Perfil
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Iniciar Sesión
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
```

## Próximos Pasos para la Autenticación

1. Implementar la recuperación de contraseña
2. Añadir autenticación con proveedores sociales (Google, GitHub, etc.)
3. Mejorar la gestión de perfiles con carga de imágenes
4. Implementar verificación de email
