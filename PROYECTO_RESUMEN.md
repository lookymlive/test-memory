# Speed Memory - Resumen del Proyecto

## Visión General

Speed Memory es una modernización de un simulador de memoria originalmente desarrollado en 2015 como aplicación de escritorio en .NET. El objetivo es convertirlo en una aplicación web moderna que permita entrenar diferentes disciplinas de memoria.

## Estado Actual

Hemos creado la estructura básica de un proyecto Next.js con:

- Configuración de Next.js 14 con TypeScript
- Tailwind CSS y shadcn/ui para componentes
- Sistema de tema claro/oscuro
- Páginas principales (home, disciplinas, récords, autenticación)
- Estructura base lista para integración con Supabase

## Repositorio Actual

Para crear un nuevo repositorio limpio:

1. Iniciar un nuevo proyecto Next.js con TypeScript:

   ```bash
   npx create-next-app@latest speed-memory-app --typescript --tailwind --eslint
   ```

2. Instalar dependencias adicionales:

   ```bash
   npm install @radix-ui/react-slot @radix-ui/react-dropdown-menu @radix-ui/react-icons @radix-ui/react-label @radix-ui/react-tabs @radix-ui/react-toast @supabase/auth-helpers-nextjs @supabase/supabase-js class-variance-authority clsx framer-motion next-themes react-hook-form tailwind-merge tailwindcss-animate zod zustand
   ```

3. Seguir la guía de shadcn/ui para configurar los componentes:

   ```bash
   npx shadcn-ui@latest init
   ```

## Estructura Planificada

```psh
/src
  /app
    /api           # API routes
    /(auth)        # Rutas de autenticación
    /(dashboard)   # Rutas protegidas/dashboard
    /disciplines   # Disciplinas de memoria 
    /about         # Página de información
    /records       # Récords de usuarios
  /components      # Componentes reutilizables
  /lib             # Utilidades y configuración
```

## Plan de Trabajo

### Fase 1: [EN PROGRESO]

- ✅ Configuración inicial del proyecto
- ✅ Componentes UI básicos
- ✅ Páginas principales (Home, About, Disciplines, Records)
- ✅ Sistema de navegación
- 🔄 Configuración de autenticación con Supabase

### Fase 2: [PENDIENTE]

- Implementar autenticación completa
- Desarrollar perfiles de usuario
- Middleware para rutas protegidas

### Fase 3: [PENDIENTE]

- Desarrollar disciplina de dígitos decimales
- Implementar mecanismo de entrenamiento
- Sistema de puntuación y récords

### Fase 4: [PENDIENTE]

- Añadir resto de disciplinas
- Desarrollar modo competición
- Integración con servicios de almacenamiento

## Disciplinas a Implementar

1. Dígitos decimales (0.5, 1, 2, 3, 4 segundos)
2. Números binarios (0.5, 1, 2, 3, 4 segundos)
3. Matrices
4. Formas y colores

## Base de Datos (Supabase)

Esquema planificado:

- users (auth)
- profiles
- disciplines
- training_sessions
- records
- competition_results

## Referencias

El diseño se basa en la aplicación original, modernizado con principios de UI/UX actuales.
