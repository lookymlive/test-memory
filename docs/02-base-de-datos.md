# Test Memory - Estructura de la Base de Datos

## Esquema General

La base de datos de Test Memory consta de las siguientes tablas principales:

1. `profiles`: Perfiles de usuarios
2. `disciplines`: Disciplinas de memoria disponibles
3. `training_sessions`: Sesiones de entrenamiento de los usuarios
4. `records`: Récords de usuarios en diferentes disciplinas
5. `competitions`: Competiciones disponibles
6. `competition_results`: Resultados de competiciones

## Estructura Detallada de Tablas

### 1. Tabla `profiles`

Esta tabla almacena la información extendida de los usuarios y está vinculada a la tabla `auth.users` de Supabase.

| Columna      | Tipo                    | Descripción                               |
|--------------|-------------------------|-------------------------------------------|
| id           | UUID (PK)               | ID del usuario (mismo que auth.users)     |
| username     | TEXT (UNIQUE)           | Nombre de usuario                         |
| full_name    | TEXT                    | Nombre completo                           |
| avatar_url   | TEXT                    | URL de la imagen de perfil                |
| email        | TEXT (UNIQUE)           | Email del usuario                         |
| bio          | TEXT                    | Biografía o descripción                   |
| created_at   | TIMESTAMP WITH TIME ZONE| Fecha de creación                         |
| updated_at   | TIMESTAMP WITH TIME ZONE| Fecha de última actualización             |

**Políticas RLS:**

- Los usuarios solo pueden ver y actualizar su propio perfil
- Automáticamente se crea un perfil cuando un usuario se registra

### 2. Tabla `disciplines`

Esta tabla almacena las diferentes disciplinas de memoria disponibles en la aplicación.

| Columna          | Tipo                    | Descripción                               |
|------------------|-------------------------|-------------------------------------------|
| id               | SERIAL (PK)             | ID único de la disciplina                 |
| name             | TEXT                    | Nombre de la disciplina                   |
| slug             | TEXT (UNIQUE)           | Slug para URLs                            |
| description      | TEXT                    | Descripción de la disciplina              |
| difficulty_level | INTEGER (1-5)           | Nivel de dificultad (1-5)                 |
| icon_name        | TEXT                    | Nombre del icono para frontend            |
| created_at       | TIMESTAMP WITH TIME ZONE| Fecha de creación                         |
| updated_at       | TIMESTAMP WITH TIME ZONE| Fecha de última actualización             |

**Disciplinas Predefinidas:**

1. Dígitos Decimales (slug: decimal-digits)
2. Números Binarios (slug: binary-numbers)
3. Matrices (slug: matrices)
4. Formas y Colores (slug: shapes-colors)

**Políticas RLS:**

- Cualquier usuario puede ver las disciplinas (lectura pública)

### 3. Tabla `training_sessions`

Almacena las sesiones de entrenamiento realizadas por los usuarios.

| Columna           | Tipo                    | Descripción                               |
|-------------------|-------------------------|-------------------------------------------|
| id                | UUID (PK)               | ID único de la sesión                     |
| user_id           | UUID (FK)               | ID del usuario                            |
| discipline_id     | INTEGER (FK)            | ID de la disciplina                       |
| difficulty        | TEXT                    | Dificultad (ej: '0.5s', '1s')            |
| score             | INTEGER                 | Puntuación obtenida                       |
| correct_answers   | INTEGER                 | Número de respuestas correctas            |
| total_questions   | INTEGER                 | Número total de preguntas                 |
| accuracy          | DECIMAL(5,2)            | Porcentaje de precisión                   |
| duration          | INTEGER                 | Duración en segundos                      |
| created_at        | TIMESTAMP WITH TIME ZONE| Fecha de creación                         |
| session_data      | JSONB                   | Datos específicos de la sesión            |

**Políticas RLS:**

- Los usuarios solo pueden ver, crear, actualizar y eliminar sus propias sesiones

### 4. Tabla `records`

Almacena los mejores resultados de cada usuario en cada disciplina y dificultad.

| Columna        | Tipo                    | Descripción                               |
|----------------|-------------------------|-------------------------------------------|
| id             | UUID (PK)               | ID único del récord                       |
| user_id        | UUID (FK)               | ID del usuario                            |
| discipline_id  | INTEGER (FK)            | ID de la disciplina                       |
| difficulty     | TEXT                    | Dificultad (ej: '0.5s', '1s')            |
| score          | INTEGER                 | Puntuación del récord                     |
| created_at     | TIMESTAMP WITH TIME ZONE| Fecha de creación                         |
| session_id     | UUID (FK)               | ID de la sesión relacionada               |

**Restricciones:**

- UNIQUE(user_id, discipline_id, difficulty) - Solo un récord por usuario, disciplina y dificultad

**Políticas RLS:**

- Cualquier usuario puede ver todos los récords (para leaderboards)
- Los usuarios solo pueden crear y actualizar sus propios récords

**Trigger:**

- Automáticamente actualiza o crea un récord cuando un usuario completa una sesión con mejor puntuación

### 5. Tabla `competitions`

Almacena las competiciones disponibles en la plataforma.

| Columna       | Tipo                    | Descripción                               |
|---------------|-------------------------|-------------------------------------------|
| id            | UUID (PK)               | ID único de la competición                |
| name          | TEXT                    | Nombre de la competición                  |
| description   | TEXT                    | Descripción                               |
| start_date    | TIMESTAMP WITH TIME ZONE| Fecha de inicio                           |
| end_date      | TIMESTAMP WITH TIME ZONE| Fecha de finalización                     |
| status        | TEXT                    | Estado ('upcoming', 'active', 'completed')|
| disciplines   | JSONB                   | Array de disciplinas y dificultades       |
| created_at    | TIMESTAMP WITH TIME ZONE| Fecha de creación                         |
| updated_at    | TIMESTAMP WITH TIME ZONE| Fecha de última actualización             |

**Políticas RLS:**

- Cualquier usuario puede ver las competiciones

### 6. Tabla `competition_results`

Almacena los resultados de los usuarios en las competiciones.

| Columna        | Tipo                    | Descripción                               |
|----------------|-------------------------|-------------------------------------------|
| id             | UUID (PK)               | ID único del resultado                    |
| competition_id | UUID (FK)               | ID de la competición                      |
| user_id        | UUID (FK)               | ID del usuario                            |
| discipline_id  | INTEGER (FK)            | ID de la disciplina                       |
| difficulty     | TEXT                    | Dificultad                                |
| score          | INTEGER                 | Puntuación obtenida                       |
| rank           | INTEGER                 | Posición en la clasificación              |
| created_at     | TIMESTAMP WITH TIME ZONE| Fecha de creación                         |
| session_data   | JSONB                   | Datos específicos de la sesión            |

**Restricciones:**

- UNIQUE(competition_id, user_id, discipline_id, difficulty) - Solo un resultado por usuario, competición, disciplina y dificultad

**Políticas RLS:**

- Los usuarios solo pueden crear sus propios resultados
- Cualquier usuario puede ver todos los resultados

**Trigger:**

- Automáticamente actualiza los rankings cuando se inserta o actualiza un resultado

## Relaciones entre Tablas

![Diagrama de Relaciones](https://dbdiagram.io/embed/placeholder-diagram)

- `profiles.id` ← vinculado a → `auth.users.id`
- `training_sessions.user_id` ← vinculado a → `profiles.id`
- `training_sessions.discipline_id` ← vinculado a → `disciplines.id`
- `records.user_id` ← vinculado a → `profiles.id`
- `records.discipline_id` ← vinculado a → `disciplines.id`
- `records.session_id` ← vinculado a → `training_sessions.id`
- `competition_results.competition_id` ← vinculado a → `competitions.id`
- `competition_results.user_id` ← vinculado a → `profiles.id`
- `competition_results.discipline_id` ← vinculado a → `disciplines.id`

## Seguridad con Row Level Security (RLS)

Todas las tablas tienen habilitado RLS (Row Level Security) para garantizar que los usuarios solo puedan acceder a los datos que les corresponden:

- En `profiles`, los usuarios solo pueden ver y actualizar su propio perfil
- En `disciplines`, cualquier usuario puede ver las disciplinas, pero no modificarlas
- En `training_sessions`, los usuarios solo pueden ver, crear, actualizar y eliminar sus propias sesiones
- En `records`, cualquier usuario puede ver todos los récords, pero solo crear/actualizar los suyos
- En `competitions`, cualquier usuario puede ver las competiciones
- En `competition_results`, los usuarios solo pueden crear sus propios resultados, pero ver todos

## Funciones y Triggers

La base de datos incluye varias funciones y triggers para automatizar procesos:

1. `handle_new_user()`: Crea automáticamente un perfil cuando un usuario se registra
2. `update_user_record()`: Actualiza los récords cuando un usuario completa una sesión con mejor puntuación
3. `update_competition_ranks()`: Actualiza los rankings de competición cuando hay nuevos resultados
