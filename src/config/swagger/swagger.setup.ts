import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.config';

export const setupSwagger = (app: Express): void => {
  // Swagger JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Swagger UI
  app.use(
    '/swagger',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Coworking API Documentation',
      customfavIcon: '/favicon.ico',
    })
  );
};