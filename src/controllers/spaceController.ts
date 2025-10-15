import { Request, Response } from 'express';
import prisma from '../models';
import { HTTP_STATUS } from '../utils/httpStatus';
import { ERROR_CODES } from '../utils/errorCodes';
import { sendError, sendSuccess } from '../utils/apiResponse';

// Obtener todos los espacios
export const getAllSpaces = async (req: Request, res: Response) => {
  try {
    const spaces = await prisma.space.findMany({
      include: { place: true },
    });
    return sendSuccess(res, spaces);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to fetch spaces',
      ERROR_CODES.SPACE_FETCH_FAILED
    );
  }
};

// Obtener espacio por ID
export const getSpaceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const space = await prisma.space.findUnique({
      where: { id: parseInt(id) },
      include: { place: true },
    });

    if (!space) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Space not found', ERROR_CODES.SPACE_NOT_FOUND);
    }

    return sendSuccess(res, space);
  } catch (error) {
    console.error('Error fetching space:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to fetch space',
      ERROR_CODES.SPACE_FETCH_FAILED
    );
  }
};

// Crear un nuevo espacio
export const createSpace = async (req: Request, res: Response) => {
  try {
    const { placeId, name, reference, capacity, description } = req.body;

    if (!placeId || !name || !capacity) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'PlaceId, name, and capacity are required',
        ERROR_CODES.SPACE_MISSING_FIELDS
      );
    }

    // Verificar si el lugar existe
    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Place not found', ERROR_CODES.PLACE_NOT_FOUND);
    }

    const newSpace = await prisma.space.create({
      data: {
        placeId,
        name,
        reference,
        capacity,
        description,
      },
    });

    return sendSuccess(res, newSpace, HTTP_STATUS.CREATED);
  } catch (error) {
    console.error('Error creating space:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to create space',
      ERROR_CODES.SPACE_CREATE_FAILED
    );
  }
};

// Actualizar un espacio
export const updateSpace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { placeId, name, reference, capacity, description } = req.body;

    const space = await prisma.space.findUnique({
      where: { id: parseInt(id) },
    });

    if (!space) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Space not found', ERROR_CODES.SPACE_NOT_FOUND);
    }
    if (placeId) {
      const place = await prisma.place.findUnique({
        where: { id: placeId },
      });

      if (!place) {
        return sendError(
          res,
          HTTP_STATUS.NOT_FOUND,
          'Place not found',
          ERROR_CODES.PLACE_NOT_FOUND
        );
      }
    }

    const updatedSpace = await prisma.space.update({
      where: { id: parseInt(id) },
      data: {
        placeId,
        name,
        reference,
        capacity,
        description,
      },
    });

    return sendSuccess(res, updatedSpace);
  } catch (error) {
    console.error('Error updating space:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to update space',
      ERROR_CODES.SPACE_UPDATE_FAILED
    );
  }
};

// Eliminar un espacio
export const deleteSpace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const space = await prisma.space.findUnique({
      where: { id: parseInt(id) },
    });

    if (!space) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Space not found', ERROR_CODES.SPACE_NOT_FOUND);
    }

    await prisma.space.delete({
      where: { id: parseInt(id) },
    });

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    console.error('Error deleting space:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to delete space',
      ERROR_CODES.SPACE_DELETE_FAILED
    );
  }
};
