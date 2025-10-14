import { Request, Response } from 'express';
import * as placeController from '../../../src/controllers/placeController';
import prisma from '../../../src/models';

// Simular cliente de Prisma
jest.mock('../../../src/models', () => ({
  place: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Place Controller', () => {
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

  describe('getAllPlaces', () => {
    it('should return all places', async () => {
      const places = [
        { id: 1, name: 'Place 1', location: 'Location 1' },
        { id: 2, name: 'Place 2', location: 'Location 2' },
      ];

      (prisma.place.findMany as jest.Mock).mockResolvedValue(places);

      await placeController.getAllPlaces(mockRequest as Request, mockResponse as Response);

      expect(prisma.place.findMany).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith(places);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (prisma.place.findMany as jest.Mock).mockRejectedValue(error);

      await placeController.getAllPlaces(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveProperty('error');
    });
  });

  describe('getPlaceById', () => {
    it('should return a place by id', async () => {
      const place = { id: 1, name: 'Place 1', location: 'Location 1' };
      mockRequest.params = { id: '1' };

      (prisma.place.findUnique as jest.Mock).mockResolvedValue(place);

      await placeController.getPlaceById(mockRequest as Request, mockResponse as Response);

      expect(prisma.place.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { spaces: true },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith(place);
    });

    it('should return 404 if place not found', async () => {
      mockRequest.params = { id: '999' };

      (prisma.place.findUnique as jest.Mock).mockResolvedValue(null);

      await placeController.getPlaceById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveProperty('error');
    });
  });

  describe('createPlace', () => {
    it('should create a new place', async () => {
      const newPlace = { name: 'New Place', location: 'New Location' };
      const createdPlace = { id: 3, ...newPlace };

      mockRequest.body = newPlace;

      (prisma.place.create as jest.Mock).mockResolvedValue(createdPlace);

      await placeController.createPlace(mockRequest as Request, mockResponse as Response);

      expect(prisma.place.create).toHaveBeenCalledWith({
        data: newPlace,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject.json).toHaveBeenCalledWith(createdPlace);
    });

    it('should handle validation errors', async () => {
      mockRequest.body = { location: 'Missing Name' };

      await placeController.createPlace(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveProperty('error');
    });
  });

  describe('updatePlace', () => {
    it('should update an existing place', async () => {
      const placeId = 1;
      const updateData = { name: 'Updated Place' };
      const updatedPlace = { id: placeId, name: 'Updated Place', location: 'Location 1' };

      mockRequest.params = { id: placeId.toString() };
      mockRequest.body = updateData;

      (prisma.place.findUnique as jest.Mock).mockResolvedValue({ id: placeId });
      (prisma.place.update as jest.Mock).mockResolvedValue(updatedPlace);

      await placeController.updatePlace(mockRequest as Request, mockResponse as Response);

      expect(prisma.place.update).toHaveBeenCalledWith({
        where: { id: placeId },
        data: updateData,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith(updatedPlace);
    });

    it('should return 404 if place to update not found', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { name: 'Updated Place' };

      (prisma.place.findUnique as jest.Mock).mockResolvedValue(null);

      await placeController.updatePlace(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveProperty('error');
    });
  });

  describe('deletePlace', () => {
    it('should delete an existing place', async () => {
      const placeId = 1;
      const deletedPlace = { id: placeId, name: 'Place 1', location: 'Location 1' };

      mockRequest.params = { id: placeId.toString() };

      (prisma.place.findUnique as jest.Mock).mockResolvedValue({ id: placeId });
      (prisma.place.delete as jest.Mock).mockResolvedValue(deletedPlace);

      await placeController.deletePlace(mockRequest as Request, mockResponse as Response);

      expect(prisma.place.delete).toHaveBeenCalledWith({
        where: { id: placeId },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith(deletedPlace);
    });

    it('should return 404 if place to delete not found', async () => {
      mockRequest.params = { id: '999' };

      (prisma.place.findUnique as jest.Mock).mockResolvedValue(null);

      await placeController.deletePlace(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveProperty('error');
    });
  });
});
