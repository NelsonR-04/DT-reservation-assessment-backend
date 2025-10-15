# Sistema de Reservas para Espacios de Coworking - Backend

API REST para gestionar reservas de espacios de coworking desarrollada con Node.js, TypeScript, Express y PostgreSQL.

## Requisitos

- Node.js 20 o superior
- PostgreSQL 14 o superior
- npm o yarn

## Tecnologías

- TypeScript
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- Jest (pruebas unitarias y e2e)

## Estructura del Proyecto

```
DT-reservation-assessment-backend/
├── src/                          # Código fuente de la aplicación
│   ├── config/                   # Configuración de la aplicación
│   │   ├── swagger/              # Configuración de Swagger/OpenAPI
│   │   │   ├── index.ts          # Exportación de configuración Swagger
│   │   │   └── swagger.json      # Especificación OpenAPI generada
│   │   ├── config.ts             # Variables de entorno y configuración general
│   │   └── logger.ts             # Configuración de Winston logger
│   ├── controllers/              # Controladores (lógica de manejo de solicitudes)
│   │   ├── placeController.ts    # CRUD de lugares
│   │   ├── spaceController.ts    # CRUD de espacios
│   │   └── reservationController.ts # CRUD de reservas + validación de reglas
│   ├── middleware/               # Middleware de Express
│   │   └── apiKeyAuth.ts         # Autenticación con API Key
│   ├── models/                   # Modelos de datos (Prisma)
│   │   └── index.ts              # Exportación del cliente Prisma
│   ├── routes/                   # Definiciones de rutas API
│   │   ├── placeRoutes.ts        # Rutas /lugares
│   │   ├── spaceRoutes.ts        # Rutas /espacios
│   │   └── reservationRoutes.ts  # Rutas /reservas
│   ├── utils/                    # Utilidades y helpers
│   │   ├── apiResponse.ts        # Formato estándar de respuestas
│   │   ├── errorCodes.ts         # Códigos de error personalizados
│   │   ├── httpStatus.ts         # Constantes de códigos HTTP
│   │   └── logger.ts             # Logger wrapper
│   └── app.ts                    # Punto de entrada y configuración Express
├── prisma/                       # Configuración de Prisma ORM
│   ├── migrations/               # Migraciones de base de datos
│   ├── schema.prisma             # Esquema de base de datos
│   ├── seed.mjs                  # Script de datos de prueba (ES modules)
│   └── seed.sql                  # Datos de prueba en SQL
├── tests/                        # Pruebas automatizadas
│   ├── e2e/                      # Pruebas end-to-end (integración completa)
│   │   ├── api.test.ts           # Pruebas de todos los endpoints
│   │   └── setup.ts              # Configuración de entorno de pruebas
│   └── unit/                     # Pruebas unitarias
│       ├── controllers/          # Pruebas de controladores
│       └── middleware/           # Pruebas de middleware
├── docker/                       # Configuración de Docker
│   ├── e2e/                      # Docker para pruebas e2e
│   │   ├── docker-compose.yml    # Compose para entorno de pruebas
│   │   └── Dockerfile            # Imagen para pruebas
│   └── prod/                     # Docker para producción
│       ├── docker-compose.yml    # Compose para producción
│       └── Dockerfile            # Imagen optimizada multi-stage
├── dist/                         # Código TypeScript compilado (generado)
├── logs/                         # Logs de la aplicación (generado)
│   ├── combined.log              # Todos los logs
│   └── error.log                 # Solo errores
├── .env                          # Variables de entorno (NO versionar)
├── .env.example                  # Plantilla de variables de entorno
├── .env.test                     # Variables de entorno para pruebas
├── .eslintrc.js                  # Configuración ESLint
├── .prettierrc                   # Configuración Prettier
├── .dockerignore                 # Archivos ignorados por Docker
├── .gitignore                    # Archivos ignorados por Git
├── jest.config.js                # Configuración de Jest
├── tsconfig.json                 # Configuración de TypeScript
├── package.json                  # Dependencias y scripts
└── README.md                     # Este archivo
```

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

   ```bash
   npm install
   ```

   o

   ```bash
   yarn install
   ```

3. Configurar variables de entorno:
   - Crear un archivo `.env` basado en `.env.example`
   - Configurar la URL de la base de datos y la clave API

4. Generar el cliente Prisma:

   ```bash
   npm run prisma:generate
   ```

   o

   ```bash
   yarn prisma generate
   ```

5. Ejecutar migraciones de la base de datos:

   ```bash
   npm run prisma:migrate
   ```

   o

   ```bash
   yarn prisma migrate

   ```

6. Poblar la base de datos con datos de prueba (opcional):

   ```bash
   npm run prisma:seed
   ```

   o

   ```bash
   yarn prisma seed
   ```

## Gestión de Base de Datos

Para una guía completa sobre gestión de la base de datos, incluyendo limpieza y reinicio, ver [DATABASE.md](./DATABASE.md).

**Comandos rápidos:**

```bash
# Configuración completa inicial
npm run db:setup

# Reiniciar base de datos con datos frescos
npm run db:fresh

# Limpiar base de datos sin datos de prueba
npm run db:clean
```

## Ejecución

### Modo Desarrollo (Local)

#### 1. Configurar variables de entorno

Asegúrate de tener un archivo `.env` con las siguientes variables:

```bash
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/coworking_reservation?schema=public"
API_KEY=tu_clave_api_secreta
```

#### 2. Iniciar PostgreSQL

Elige una de las dos opciones para ejecutar PostgreSQL:

##### Opción A: PostgreSQL Instalado Localmente

Si ya tienes PostgreSQL instalado en tu máquina:

**1. Crear la base de datos:**

```bash
# Conectar a PostgreSQL
psql -U postgres

# Dentro de psql, crear la base de datos
CREATE DATABASE coworking_reservation;

# Salir de psql
\q
```

**2. Configurar el `.env`:**

```bash
DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/coworking_reservation?schema=public"
```

**3. Ejecutar migraciones y poblar la base de datos:**

```bash
# Generar el cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar con datos de prueba
npm run prisma:seed
```

O usar el comando todo-en-uno:

```bash
npm run db:setup
```

##### Opción B: PostgreSQL con Docker (Recomendado)

Si prefieres usar Docker (no requiere instalación de PostgreSQL):

**1. Asegurarte de tener las variables de entorno para Docker:**

Crea un archivo `.env` en la raíz del proyecto con:

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=coworking_reservation
API_KEY=dev_api_key_12345
```

**2. Iniciar solo el contenedor de PostgreSQL:**

```bash
docker-compose -f docker/prod/docker-compose.yml up -d db
```

Este comando inicia únicamente el servicio de base de datos definido en el docker-compose.

**3. Verificar que el contenedor está corriendo:**

```bash
docker-compose -f docker/prod/docker-compose.yml ps
```

Deberías ver el servicio `db` con estado `running`.

**4. Configurar el `.env` para desarrollo local:**

Actualiza tu `.env` con la URL de conexión:

```bash
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/coworking_reservation?schema=public"
API_KEY=dev_api_key_12345
```

**5. Ejecutar migraciones y poblar la base de datos:**

```bash
# Generar el cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar con datos de prueba
npm run prisma:seed
```

O usar el comando todo-en-uno:

```bash
npm run db:setup
```

**Comandos útiles para el contenedor Docker:**

```bash
# Ver logs de la base de datos
docker-compose -f docker/prod/docker-compose.yml logs -f db

# Detener el contenedor
docker-compose -f docker/prod/docker-compose.yml stop db

# Iniciar el contenedor existente
docker-compose -f docker/prod/docker-compose.yml start db

# Eliminar el contenedor (perderás los datos)
docker-compose -f docker/prod/docker-compose.yml down -v
```

#### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000` con recarga automática cuando modifiques archivos.

**Salida esperada:**

```
Server is running on port 3000
Prisma Client initialized
```

#### 4. Verificar que está funcionando

```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Modo Producción (Local)

#### 1. Compilar

```bash
npm run build
```

Esto generará los archivos JavaScript en la carpeta `dist/`.

#### 2. Iniciar el servidor

```bash
npm start
```

El servidor se iniciará en modo producción usando los archivos compilados.

### Modo Producción (Docker)

#### Opción 1: Docker Compose (Recomendado)

Inicia la aplicación y PostgreSQL en contenedores:

```bash
npm run docker:prod:up
```

O en modo detached (background):

```bash
npm run docker:prod:up:detached
```

**Verificar logs:**

```bash
docker-compose -f docker/prod/docker-compose.yml logs -f app
```

**Detener los contenedores:**

```bash
npm run docker:prod:down
```

### Herramientas de Desarrollo

```bash
# Verificar calidad del código con ESLint
npm run lint

# Corregir automáticamente problemas de linting
npm run lint:fix

# Formatear código con Prettier
npm run format

# Abrir Prisma Studio (GUI para la base de datos)
npm run prisma:studio
```

## Pruebas

### Prerequisitos para Pruebas

Las pruebas requieren una base de datos PostgreSQL de prueba. Asegúrate de tener configurado el archivo `.env.test`:

```bash
NODE_ENV=test
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/coworking_test?schema=public"
API_KEY=test_api_key_12345
PORT=3001
```

**Nota:** Si usas Docker para las pruebas, el puerto será `5433`. Si usas PostgreSQL local, usa el puerto `5432`.

### Configurar Base de Datos de Pruebas

**Opción 1: Con PostgreSQL Local**

```bash
# Crear la base de datos de prueba
psql -U postgres -c "CREATE DATABASE coworking_test;"

# Actualizar .env.test para usar PostgreSQL local
# DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/coworking_test?schema=public"

# Configurar y poblar
npm run db:test:setup
```

**Opción 2: Con Docker**

```bash
# Iniciar solo el contenedor de PostgreSQL de prueba
docker-compose -f docker/e2e/docker-compose.yml up -d postgres-test

# Verificar que el contenedor está corriendo
docker-compose -f docker/e2e/docker-compose.yml ps

# Actualizar .env.test para usar el puerto 5433
# DATABASE_URL="postgresql://postgres:postgres@localhost:5433/coworking_test?schema=public"

# Configurar y poblar
npm run db:test:setup
```

**Comandos útiles:**
```bash
# Ver logs de la base de datos de prueba
docker-compose -f docker/e2e/docker-compose.yml logs -f postgres-test

# Detener el contenedor
docker-compose -f docker/e2e/docker-compose.yml stop postgres-test

# Eliminar el contenedor (perderás los datos de prueba)
docker-compose -f docker/e2e/docker-compose.yml down -v
```

### Ejecutar Pruebas

#### Todas las Pruebas (Unitarias + E2E)

```bash
npm test
```

**Salida esperada:**
```
PASS  tests/unit/controllers/reservationController.test.ts
PASS  tests/unit/middleware/apiKeyAuth.test.ts
PASS  tests/e2e/api.test.ts

Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        5.234 s
```

#### Solo Pruebas Unitarias

Pruebas rápidas de funciones y controladores aislados con mocks:

```bash
npm run test:unit
```

**¿Qué incluye?**
- Pruebas de controladores con mocks de Prisma
- Pruebas de middleware de autenticación
- Pruebas de funciones utilitarias

**Ejemplo de salida:**
```
PASS  tests/unit/controllers/placeController.test.ts
PASS  tests/unit/controllers/spaceController.test.ts
PASS  tests/unit/controllers/reservationController.test.ts
PASS  tests/unit/middleware/apiKeyAuth.test.ts

Test Suites: 4 passed, 4 total
Tests:       18 passed, 18 total
Time:        2.156 s
```

#### Solo Pruebas E2E (End-to-End)

Pruebas de integración completa con base de datos real:

```bash
npm run test:e2e
```

**¿Qué incluye?**
- Pruebas de todos los endpoints API
- Validación de reglas de negocio
- Pruebas de autenticación con API key
- Pruebas de paginación
- Validación de conflictos de reservas

**Ejemplo de salida:**
```
PASS  tests/e2e/api.test.ts
  Place API
    ✓ should create a new place (45ms)
    ✓ should get all places (32ms)
  Space API
    ✓ should create a new space (38ms)
  Reservation API
    ✓ should create a reservation (52ms)
    ✓ should prevent conflicting reservations (48ms)
    ✓ should enforce 3 reservations per week limit (65ms)

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
Time:        3.812 s
```

**Nota:** Las pruebas E2E se ejecutan con `--runInBand` para evitar conflictos de base de datos entre pruebas paralelas.

#### Modo Watch (Desarrollo)

Ejecuta las pruebas automáticamente cuando los archivos cambian:

```bash
npm run test:watch
```

Útil durante el desarrollo para recibir feedback inmediato.

#### Cobertura de Código

Genera un reporte de cobertura de código:

```bash
npm run test:coverage
```

**Salida esperada:**
```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   85.23 |    78.45 |   90.12 |   84.67 |
 controllers        |   88.50 |    82.30 |   92.00 |   87.90 |
 middleware         |   95.00 |    90.00 |  100.00 |   94.50 |
 utils              |   78.20 |    65.40 |   85.30 |   77.80 |
--------------------|---------|----------|---------|---------|-------------------
```

El reporte HTML se generará en `coverage/lcov-report/index.html`.

### Pruebas con Docker (E2E)

Para ejecutar las pruebas E2E en un entorno completamente aislado con Docker:

```bash
# Iniciar contenedores de prueba
npm run docker:e2e:up
```

Esto creará:
- Un contenedor con PostgreSQL de prueba
- Un contenedor con la aplicación configurada para pruebas
- Ejecutará todas las pruebas E2E automáticamente

**Limpiar después de las pruebas:**
```bash
npm run docker:e2e:down
```

### Estructura de Pruebas

```
tests/
├── unit/                        # Pruebas unitarias (mocks, aisladas)
│   ├── controllers/
│   │   ├── placeController.test.ts
│   │   ├── spaceController.test.ts
│   │   └── reservationController.test.ts
│   └── middleware/
│       └── apiKeyAuth.test.ts
└── e2e/                         # Pruebas de integración (base de datos real)
    ├── setup.ts                 # Configuración global de pruebas
    └── api.test.ts              # Pruebas de todos los endpoints
```

### Consejos para Pruebas

1. **Ejecuta las pruebas antes de hacer commit:**
   ```bash
   npm run lint && npm test
   ```

2. **Si las pruebas E2E fallan por problemas de base de datos:**
   ```bash
   npm run db:test:setup
   npm run test:e2e
   ```

3. **Para depurar una prueba específica:**
   ```bash
   npm test -- tests/e2e/api.test.ts --verbose
   ```

4. **Para ejecutar solo una suite de pruebas específica:**
   ```bash
   npm test -- -t "Reservation API"
   ```

5. **Para ver más detalles de las pruebas:**
   ```bash
   npm test -- --verbose
   ```

## Docker

La aplicación está configurada para ejecutarse en contenedores Docker utilizando Node 20 Alpine.

### Ejecución con Docker Compose

```bash
# Iniciar la aplicación y la base de datos
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener los contenedores
docker-compose down

# Reconstruir la imagen después de cambios
docker-compose build --no-cache
```

### Características de la configuración Docker

- **Imagen base**: Node 20 Alpine (optimizada para tamaño y rendimiento)
- **Multi-stage build**: Separación de etapas de construcción y producción para reducir el tamaño final
- **Healthcheck integrado**: Monitoreo automático del estado de la aplicación
- **Persistencia de datos**: Volúmenes PostgreSQL para mantener datos entre reinicios
- **Optimización de caché**: Estructura de capas para aprovechar la caché de Docker
- **Seguridad mejorada**: Ejecución como usuario no-root (implementado automáticamente en Node Alpine)

### Variables de entorno en Docker

| Variable       | Descripción                  | Valor por defecto                                                            |
| -------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| `NODE_ENV`     | Entorno de ejecución         | `production`                                                                 |
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://postgres:postgres@db:5432/coworking_reservation?schema=public` |
| `API_KEY`      | Clave API para autenticación | Debe ser proporcionada                                                       |
| `PORT`         | Puerto de la aplicación      | `3000`                                                                       |

## API Endpoints

### Sistema

- `GET /health` - Verificar estado del servidor (no requiere autenticación)

### Espacios

- `GET /espacios` - Listar todos los espacios
- `GET /espacios/:id` - Obtener detalles de un espacio
- `POST /espacios` - Crear un nuevo espacio
- `PUT /espacios/:id` - Actualizar un espacio
- `DELETE /espacios/:id` - Eliminar un espacio

### Lugares

- `GET /lugares` - Listar todos los lugares
- `GET /lugares/:id` - Obtener detalles de un lugar
- `POST /lugares` - Crear un nuevo lugar
- `PUT /lugares/:id` - Actualizar un lugar
- `DELETE /lugares/:id` - Eliminar un lugar

### Reservas

- `GET /reservas` - Listar todas las reservas (con paginación)
- `GET /reservas/:id` - Obtener detalles de una reserva
- `POST /reservas` - Crear una nueva reserva
- `PUT /reservas/:id` - Actualizar una reserva
- `DELETE /reservas/:id` - Eliminar una reserva

## Autenticación

Todas las solicitudes a la API deben incluir una clave API en el encabezado `x-api-key`.

## Reglas de Negocio

- No se permiten conflictos de programación para el mismo espacio
- Máximo 3 reservas activas por cliente por semana
