# Test Memory - Introducción

## Visión General

Test Memory es una aplicación web moderna para entrenar y competir en pruebas de memoria. La aplicación permite a los usuarios practicar diferentes disciplinas de memoria, registrar sus resultados, establecer récords personales y participar en competiciones.

## Propósito del Proyecto

Este proyecto es una modernización de una aplicación de memoria originalmente desarrollada en 2015 como aplicación de escritorio en .NET. El objetivo principal es convertirla en una aplicación web accesible desde cualquier dispositivo, con características modernas y una experiencia de usuario optimizada.

## Disciplinas de Memoria

Test Memory incluye varias disciplinas para el entrenamiento de la memoria:

1. **Dígitos Decimales**: Memorización de secuencias de dígitos (0-9) mostrados a diferentes velocidades (0.5, 1, 2, 3, 4 segundos)
2. **Números Binarios**: Memorización de secuencias de números binarios (0-1) mostrados a diferentes velocidades (0.5, 1, 2, 3, 4 segundos)
3. **Matrices**: Memorización de la posición de elementos en matrices de diferentes tamaños
4. **Formas y Colores**: Memorización de secuencias de formas y colores mostrados en un orden específico

## Características Principales

- Autenticación de usuarios con Supabase
- Diferentes modos de entrenamiento para cada disciplina
- Sistema de puntuación y récords
- Perfiles de usuario con estadísticas
- Tablas de clasificación
- Competiciones
- Tema claro/oscuro
- Diseño responsive para todos los dispositivos

## Stack Tecnológico

### Frontend

- Next.js 14 con App Router
- TypeScript
- Tailwind CSS
- shadcn/ui (componentes UI reutilizables)
- Framer Motion (animaciones)

### Backend

- Next.js API Routes
- Supabase (PostgreSQL, autenticación)
- Cloudinary (opcional, para gestión de imágenes)
