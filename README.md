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
backend/
├── src/
│   ├── controllers/     # Controladores para manejar las solicitudes
│   ├── models/          # Modelos de datos e interacciones con la base de datos
│   ├── routes/          # Definiciones de rutas API
│   ├── middleware/      # Middleware de Express
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Funciones auxiliares
│   ├── config/          # Archivos de configuración
│   └── app.ts           # Configuración de la aplicación Express
├── prisma/              # Esquema Prisma y migraciones
├── tests/
│   ├── unit/            # Pruebas unitarias
│   └── e2e/             # Pruebas end-to-end
├── docker/              # Configuración Docker
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - Crear un archivo `.env` basado en `.env.example`
   - Configurar la URL de la base de datos y la clave API

4. Generar el cliente Prisma:

   ```bash
   npm run prisma:generate
   ```

5. Ejecutar migraciones de la base de datos:

   ```bash
   npm run prisma:migrate
   ```

6. Poblar la base de datos con datos de prueba (opcional):

   ```bash
   npm run prisma:seed
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

### Desarrollo

```bash
# Iniciar servidor de desarrollo con recarga automática
npm run dev

# Verificar calidad del código
npm run lint

# Formatear código automáticamente
npm run format
```

### Producción

```bash
# Compilar TypeScript a JavaScript
npm run build

# Iniciar servidor en modo producción
npm start
```

## Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con watch mode
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage
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
