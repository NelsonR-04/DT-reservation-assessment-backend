import request from 'supertest';
import app from '../../src/app';
import { setupTestDatabase, teardownTestDatabase } from './setup';

describe('API Endpoints', () => {
  let testData: any;
  const API_KEY = process.env.API_KEY || 'test_api_key';

  // Configurar base de datos de prueba antes de todos los tests
  beforeAll(async () => {
    testData = await setupTestDatabase();
  });

  // Limpiar base de datos de prueba después de todos los tests
  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('Health Check', () => {
    it('should return 200 OK for health check endpoint', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });

  describe('Places API', () => {
    it('should return all places', async () => {
      const response = await request(app).get('/places').set('X-API-KEY', API_KEY);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });

    it('should return a specific place by ID', async () => {
      const response = await request(app)
        .get(`/places/${testData.place.id}`)
        .set('X-API-KEY', API_KEY);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testData.place.id);
      expect(response.body).toHaveProperty('name', 'Test Coworking');
    });

    it('should return 404 for non-existent place', async () => {
      const response = await request(app).get('/places/9999').set('X-API-KEY', API_KEY);

      expect(response.status).toBe(404);
    });

    it('should create a new place', async () => {
      const newPlace = {
        name: 'New Coworking',
        location: 'New Location',
      };

      const response = await request(app).post('/places').set('X-API-KEY', API_KEY).send(newPlace);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'New Coworking');
      expect(response.body).toHaveProperty('location', 'New Location');
    });
  });

  describe('Spaces API', () => {
    it('should return all spaces', async () => {
      const response = await request(app).get('/spaces').set('X-API-KEY', API_KEY);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return a specific space by ID', async () => {
      const response = await request(app)
        .get(`/spaces/${testData.spaces[0].id}`)
        .set('X-API-KEY', API_KEY);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testData.spaces[0].id);
      expect(response.body).toHaveProperty('name', 'Meeting Room A');
    });

    it('should create a new space', async () => {
      const newSpace = {
        name: 'Conference Room',
        reference: 'CR',
        capacity: 15,
        description: 'Large conference room',
        placeId: testData.place.id,
      };

      const response = await request(app).post('/spaces').set('X-API-KEY', API_KEY).send(newSpace);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'Conference Room');
      expect(response.body).toHaveProperty('capacity', 15);
    });
  });

  describe('Reservations API', () => {
    it('should return all reservations', async () => {
      const response = await request(app).get('/reservations').set('X-API-KEY', API_KEY);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('pagination');
    });

    it('should create a new reservation', async () => {
      const today = new Date();
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      const newReservation = {
        spaceId: testData.spaces[2].id,
        placeId: testData.place.id,
        customerEmail: 'test3@example.com',
        reservationDate: dayAfterTomorrow.toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '12:00',
      };

      const response = await request(app)
        .post('/reservations')
        .set('X-API-KEY', API_KEY)
        .send(newReservation);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('customerEmail', 'test3@example.com');
      expect(response.body).toHaveProperty('spaceId', testData.spaces[2].id);
    });

    it('should prevent double booking', async () => {
      // Intentar reservar el mismo espacio al mismo tiempo
      const today = new Date();

      const conflictingReservation = {
        spaceId: testData.spaces[0].id,
        placeId: testData.place.id,
        customerEmail: 'conflict@example.com',
        reservationDate: today.toISOString().split('T')[0],
        startTime: '09:30', // Se solapa con la reserva existente de 09:00-11:00
        endTime: '10:30',
      };

      const response = await request(app)
        .post('/reservations')
        .set('X-API-KEY', API_KEY)
        .send(conflictingReservation);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('conflict');
    });

    it('should enforce maximum reservations per customer', async () => {
      // Crear 3 reservas más para el mismo cliente
      const today = new Date();
      const reservations = [];

      for (let i = 0; i < 4; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(nextDay.getDate() + i + 3); // Comenzar 3 días desde ahora

        reservations.push({
          spaceId: testData.spaces[i % 3].id,
          placeId: testData.place.id,
          customerEmail: 'maxtest@example.com',
          reservationDate: nextDay.toISOString().split('T')[0],
          startTime: '13:00',
          endTime: '14:00',
        });
      }

      // Las primeras 3 deberían tener éxito
      for (let i = 0; i < 3; i++) {
        const response = await request(app)
          .post('/reservations')
          .set('X-API-KEY', API_KEY)
          .send(reservations[i]);

        expect(response.status).toBe(201);
      }

      // La 4ta debería fallar (excede el límite semanal)
      const response = await request(app)
        .post('/reservations')
        .set('X-API-KEY', API_KEY)
        .send(reservations[3]);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('maximum');
    });
  });

  describe('Authentication', () => {
    it('should reject requests without API key', async () => {
      const response = await request(app).get('/spaces');
      expect(response.status).toBe(401);
    });

    it('should reject requests with invalid API key', async () => {
      const response = await request(app).get('/spaces').set('X-API-KEY', 'invalid_key');

      expect(response.status).toBe(401);
    });
  });
});
