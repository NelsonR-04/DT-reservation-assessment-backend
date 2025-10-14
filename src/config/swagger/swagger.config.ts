import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Reservas - Coworking API',
      version: '1.0.0',
      description:
        'API REST para gestionar reservas en espacios de coworking. Permite administrar lugares, espacios y reservas de clientes.',
      contact: {
        name: 'Nelson Rondon',
        email: 'nelson.rondon94@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'http://localhost:3001',
        description: 'Test server',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API key for authentication. Use the key provided in your .env file.',
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'System health check endpoints',
      },
      {
        name: 'Lugares',
        description: 'Gestión de lugares (edificios con múltiples espacios)',
      },
      {
        name: 'Espacios',
        description: 'Gestión de espacios disponibles para reserva',
      },
      {
        name: 'Reservas',
        description: 'Gestión de reservas de clientes',
      },
    ],
  },
  apis: [
    path.join(__dirname, './schemas/*.yaml'),
    path.join(__dirname, './paths/*.yaml'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;