# Speed Memory

Speed Memory es un simulador para entrenar y competir en pruebas de memoria. Este proyecto es una modernización de la aplicación original desarrollada en 2015, transformándola de una aplicación de escritorio en .NET a una aplicación web moderna.

## 📋 Descripción

Speed Memory permite a los usuarios practicar diferentes disciplinas de memoria como:

- Memorización de dígitos decimales (con diferentes tiempos: 0.5, 1, 2, 3, 4 segundos)
- Memorización de números binarios (con diferentes tiempos: 0.5, 1, 2, 3, 4 segundos)
- Memorización de matrices
- Memorización de formas y colores

## 🚀 Tecnologías

### Frontend

- **Next.js 14**: Framework de React con App Router
- **TypeScript**: Para un código más seguro y mantenible
- **Tailwind CSS**: Framework CSS utilitario
- **shadcn/ui**: Componentes UI reutilizables y accesibles
- **Framer Motion**: Para animaciones fluidas

### Backend

- **Next.js API Routes**: Para endpoints de API
- **Supabase**: Base de datos PostgreSQL, autenticación y almacenamiento
- **Cloudinary**: Para gestión de imágenes y archivos multimedia

## 🏗️ Estructura del Proyecto

```psh
/app
  /api           # API routes
  /(auth)        # Rutas de autenticación
  /(dashboard)   # Rutas protegidas/dashboard
  /disciplines   # Disciplinas de memoria 
  /competitions  # Competiciones
  /profile       # Perfil de usuario
/components      # Componentes reutilizables
/lib             # Utilidades y configuración
/public          # Archivos estáticos
```

## 📊 Base de Datos

Esquema básico de la base de datos (Supabase):

- **users**: Usuarios de la aplicación (gestionado por Supabase Auth)
- **profiles**: Perfiles extendidos de usuarios
- **disciplines**: Tipos de disciplinas de memoria
- **training_sessions**: Sesiones de entrenamiento
- **records**: Récords de usuarios
- **competition_results**: Resultados de competiciones

## 🚀 Instalación y Ejecución

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/lookymlive/speed-memory.git
   cd speed-memory
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env.local` con las siguientes variables:

psh
   NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name-de-cloudinary

4.**Ejecutar en desarrollo**

   ```bash
   npm run dev
   ```

5.**Construir para producción**

   ```bash
   npm run build
   npm start
   ```

## 📝 Progreso Actual

El proyecto está en desarrollo activo:

### ✅ Completado

- Inicialización del proyecto Next.js con TypeScript
- Configuración de Tailwind CSS y shadcn/ui
- Estructura de carpetas y componentes base
- Página principal, de disciplinas y de récords
- Sistema de navegación y tema claro/oscuro
- Interfaz de autenticación (estructura)

### 🔄 En Progreso

- Configuración de Supabase para base de datos y autenticación
- Desarrollo de la disciplina de dígitos decimales
- Implementación de la lógica de puntuación

### 📋 Próximos Pasos

- Completar integración con Supabase
- Implementar más disciplinas de memoria
- Configurar Cloudinary para gestión de archivos
- Desarrollar el sistema de competiciones

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes, por favor abre primero un issue para discutir qué te gustaría cambiar.

## 📄 Licencia

[MIT](LICENSE)
