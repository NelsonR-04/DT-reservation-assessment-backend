import { Request, Response } from 'express';
import prisma from '../models';
import { HTTP_STATUS } from '../utils/httpStatus';
import { ERROR_CODES } from '../utils/errorCodes';
import { sendError, sendSuccess } from '../utils/apiResponse';

// Obtener todos los lugares
export const getAllPlaces = async (req: Request, res: Response) => {
  try {
    const places = await prisma.place.findMany();
    return sendSuccess(res, places);
  } catch (error) {
    console.error('Error fetching places:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to fetch places',
      ERROR_CODES.PLACE_FETCH_FAILED
    );
  }
};

// Obtener lugar por ID
export const getPlaceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const place = await prisma.place.findUnique({
      where: { id: parseInt(id) },
      include: { spaces: true },
    });

    if (!place) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Place not found', ERROR_CODES.PLACE_NOT_FOUND);
    }

    return sendSuccess(res, place);
  } catch (error) {
    console.error('Error fetching place:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to fetch place',
      ERROR_CODES.PLACE_FETCH_FAILED
    );
  }
};

// Crear un nuevo lugar
export const createPlace = async (req: Request, res: Response) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Name and location are required',
        ERROR_CODES.PLACE_MISSING_FIELDS
      );
    }

    const newPlace = await prisma.place.create({
      data: {
        name,
        location,
      },
    });

    return sendSuccess(res, newPlace, HTTP_STATUS.CREATED);
  } catch (error) {
    console.error('Error creating place:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to create place',
      ERROR_CODES.PLACE_CREATE_FAILED
    );
  }
};

// Actualizar un lugar
export const updatePlace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    const updatedPlace = await prisma.place.update({
      where: { id: parseInt(id) },
      data: {
        name,
        location,
      },
    });

    return sendSuccess(res, updatedPlace);
  } catch (error) {
    console.error('Error updating place:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to update place',
      ERROR_CODES.PLACE_UPDATE_FAILED
    );
  }
};

// Eliminar un lugar
export const deletePlace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const place = await prisma.place.findUnique({
      where: { id: parseInt(id) },
    });

    if (!place) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Place not found', ERROR_CODES.PLACE_NOT_FOUND);
    }

    await prisma.place.delete({
      where: { id: parseInt(id) },
    });

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    console.error('Error deleting place:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to delete place',
      ERROR_CODES.PLACE_DELETE_FAILED
    );
  }
};
