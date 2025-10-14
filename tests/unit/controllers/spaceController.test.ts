import { Request, Response } from 'express';
import * as spaceController from '../../../src/controllers/spaceController';
import prisma from '../../../src/models';

// Simular cliente de Prisma
jest.mock('../../../src/models', () => ({
  space: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  place: {
    findUnique: jest.fn(),
  },
}));

describe('Space Controller', () => {
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

  describe('getAllSpaces', () => {
    it('should return all spaces', async () => {
      const spaces = [
        { id: 1, name: 'Space 1', placeId: 1 },
        { id: 2, name: 'Space 2', placeId: 1 },
      ];

      (prisma.space.findMany as jest.Mock).mockResolvedValue(spaces);

      await spaceController.getAllSpaces(mockRequest as Request, mockResponse as Response);

      expect(prisma.space.findMany).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith(spaces);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (prisma.space.findMany as jest.Mock).mockRejectedValue(error);

      await spaceController.getAllSpaces(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({ error: 'Failed to fetch spaces' });
    });
  });

  describe('getSpaceById', () => {
    it('should return a space by id', async () => {
      const space = { id: 1, name: 'Space 1', placeId: 1 };
      mockRequest.params = { id: '1' };

      (prisma.space.findUnique as jest.Mock).mockResolvedValue(space);

      await spaceController.getSpaceById(mockRequest as Request, mockResponse as Response);

      expect(prisma.space.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { place: true },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith(space);
    });

    it('debería retornar 404 si el espacio no se encuentra', async () => {
      mockRequest.params = { id: '999' };

      (prisma.space.findUnique as jest.Mock).mockResolvedValue(null);

      await spaceController.getSpaceById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveBeenCalledWith({ error: 'Space not found' });
    });
  });

  // Agregar más pruebas para otros métodos del controlador
});
