import { Request, Response } from 'express';
import * as reservationController from '../../../src/controllers/reservationController';
import prisma from '../../../src/models';

// Simular cliente de Prisma
jest.mock('../../../src/models', () => ({
  reservation: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  space: {
    findUnique: jest.fn(),
  },
  place: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
}));

describe('Reservation Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any = {};

  beforeEach(() => {
    mockRequest = {};
    responseObject = {
      statusCode: 0,
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    mockResponse = {
      status: jest.fn().mockImplementation(code => {
        responseObject.statusCode = code;
        return responseObject;
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllReservations', () => {
    it('should return paginated reservations', async () => {
      const reservations = [
        { id: 1, spaceId: 1, customerEmail: 'test1@example.com' },
        { id: 2, spaceId: 2, customerEmail: 'test2@example.com' },
      ];

      mockRequest.query = { page: '1', limit: '10' };

      (prisma.reservation.findMany as jest.Mock).mockResolvedValue(reservations);
      (prisma.reservation.count as jest.Mock).mockResolvedValue(2);

      await reservationController.getAllReservations(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(prisma.reservation.findMany).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith({
        data: reservations,
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          pages: 1,
        },
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (prisma.reservation.findMany as jest.Mock).mockRejectedValue(error);

      await reservationController.getAllReservations(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveProperty('error');
    });
  });

  describe('getReservationById', () => {
    it('should return a reservation by id', async () => {
      const reservation = {
        id: 1,
        spaceId: 1,
        customerEmail: 'test1@example.com',
        space: { name: 'Meeting Room' },
      };
      mockRequest.params = { id: '1' };

      (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(reservation);

      await reservationController.getReservationById(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { space: true, place: true },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith(reservation);
    });

    it('should return 404 if reservation not found', async () => {
      mockRequest.params = { id: '999' };

      (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(null);

      await reservationController.getReservationById(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveProperty('error');
    });
  });

  describe('createReservation', () => {
    it('should create a new reservation', async () => {
      const today = new Date();
      const newReservation = {
        spaceId: 1,
        placeId: 1,
        customerEmail: 'test@example.com',
        reservationDate: today.toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '12:00',
      };
      const createdReservation = { id: 1, ...newReservation };

      mockRequest.body = newReservation;

      // Mock space exists
      (prisma.space.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: 'Meeting Room' });

      // Mock place exists
      (prisma.place.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: 'Coworking' });

      // Mock no scheduling conflicts
      (prisma.reservation.findMany as jest.Mock).mockResolvedValue([]);

      // Mock customer has fewer than 3 reservations
      (prisma.reservation.count as jest.Mock).mockResolvedValue(2);

      // Mock successful creation
      (prisma.reservation.create as jest.Mock).mockResolvedValue(createdReservation);

      await reservationController.createReservation(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(prisma.reservation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          spaceId: 1,
          customerEmail: 'test@example.com',
        }),
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject.json).toHaveBeenCalledWith(createdReservation);
    });

    it('should reject if space does not exist', async () => {
      mockRequest.body = {
        spaceId: 999,
        customerEmail: 'test@example.com',
        reservationDate: '2023-12-01',
        startTime: '10:00',
        endTime: '12:00',
      };

      // Mock space doesn't exist
      (prisma.space.findUnique as jest.Mock).mockResolvedValue(null);

      await reservationController.createReservation(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveProperty('error');
      expect(responseObject.json.error).toContain('Space not found');
    });

    it('should reject if there is a scheduling conflict', async () => {
      const today = new Date();
      mockRequest.body = {
        spaceId: 1,
        placeId: 1,
        customerEmail: 'test@example.com',
        reservationDate: today.toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '12:00',
      };

      // Mock space exists
      (prisma.space.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: 'Meeting Room' });

      // Mock place exists
      (prisma.place.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: 'Coworking' });

      // Mock scheduling conflict
      (prisma.reservation.findMany as jest.Mock).mockResolvedValue([
        { id: 1, startTime: '09:00', endTime: '11:00' },
      ]);

      await reservationController.createReservation(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveProperty('error');
      expect(responseObject.json.error).toContain('conflict');
    });

    it('should reject if customer exceeds weekly reservation limit', async () => {
      const today = new Date();
      mockRequest.body = {
        spaceId: 1,
        placeId: 1,
        customerEmail: 'test@example.com',
        reservationDate: today.toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '12:00',
      };

      // Mock space exists
      (prisma.space.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: 'Meeting Room' });

      // Mock place exists
      (prisma.place.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: 'Coworking' });

      // Mock no scheduling conflicts
      (prisma.reservation.findMany as jest.Mock).mockResolvedValue([]);

      // Mock customer has reached limit
      (prisma.reservation.count as jest.Mock).mockResolvedValue(3);

      await reservationController.createReservation(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveProperty('error');
      expect(responseObject.json.error).toContain('maximum');
    });
  });

  describe('deleteReservation', () => {
    it('should delete an existing reservation', async () => {
      const reservationId = 1;
      const deletedReservation = {
        id: reservationId,
        spaceId: 1,
        customerEmail: 'test@example.com',
      };

      mockRequest.params = { id: reservationId.toString() };

      (prisma.reservation.findUnique as jest.Mock).mockResolvedValue({ id: reservationId });
      (prisma.reservation.delete as jest.Mock).mockResolvedValue(deletedReservation);

      await reservationController.deleteReservation(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(prisma.reservation.delete).toHaveBeenCalledWith({
        where: { id: reservationId },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith(deletedReservation);
    });

    it('should return 404 if reservation to delete not found', async () => {
      mockRequest.params = { id: '999' };

      (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(null);

      await reservationController.deleteReservation(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveProperty('error');
    });
  });
});
