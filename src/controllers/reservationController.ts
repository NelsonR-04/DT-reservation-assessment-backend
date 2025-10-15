import { Request, Response } from 'express';
import config from '../config/config';
import prisma from '../models';
import { HTTP_STATUS } from '../utils/httpStatus';
import { ERROR_CODES } from '../utils/errorCodes';
import { sendError, sendSuccess } from '../utils/apiResponse';

// Obtener todas las reservas con paginación
export const getAllReservations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const now = new Date();

    const reservations = await prisma.reservation.findMany({
      where: {
        OR: [
          {
            reservationDate: {
              gt: now,
            },
          },
          {
            AND: [
              {
                reservationDate: {
                  gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                },
              },
              {
                endTime: {
                  gte: now,
                },
              },
            ],
          },
        ],
      },
      skip,
      take: limit,
      include: {
        space: true,
        place: true,
      },
      orderBy: {
        reservationDate: 'asc',
      },
    });

    const total = await prisma.reservation.count({
      where: {
        OR: [
          {
            reservationDate: {
              gt: now,
            },
          },
          {
            AND: [
              {
                reservationDate: {
                  gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                },
              },
              {
                endTime: {
                  gte: now,
                },
              },
            ],
          },
        ],
      },
    });

    return sendSuccess(res, {
      data: reservations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to fetch reservations',
      ERROR_CODES.RESERVATION_FETCH_FAILED
    );
  }
};

// Obtener reserva por ID
export const getReservationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) },
      include: {
        space: true,
        place: true,
      },
    });

    if (!reservation) {
      return sendError(
        res,
        HTTP_STATUS.NOT_FOUND,
        'Reservation not found',
        ERROR_CODES.RESERVATION_NOT_FOUND
      );
    }

    return sendSuccess(res, reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to fetch reservation',
      ERROR_CODES.RESERVATION_FETCH_FAILED
    );
  }
};

// Crear una nueva reserva
export const createReservation = async (req: Request, res: Response) => {
  try {
    const { spaceId, clientEmail, reservationDate, startTime, endTime } = req.body;

    if (!spaceId || !clientEmail || !reservationDate || !startTime || !endTime) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'SpaceId, clientEmail, reservationDate, startTime, and endTime are required',
        ERROR_CODES.RESERVATION_MISSING_FIELDS
      );
    }

    // Verificar si el espacio existe
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: { place: true },
    });

    if (!space) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Space not found', ERROR_CODES.SPACE_NOT_FOUND);
    }

    // Parsear fechas
    const reservationDateObj = new Date(reservationDate);
    const startTimeObj = new Date(startTime);
    const endTimeObj = new Date(endTime);

    if (endTimeObj <= startTimeObj) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'End time must be after start time',
        ERROR_CODES.RESERVATION_INVALID_TIME
      );
    }
    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        spaceId,
        reservationDate: reservationDateObj,
        OR: [
          {
            AND: [{ startTime: { lte: startTimeObj } }, { endTime: { gt: startTimeObj } }],
          },
          {
            AND: [{ startTime: { lt: endTimeObj } }, { endTime: { gte: endTimeObj } }],
          },
          {
            AND: [{ startTime: { gte: startTimeObj } }, { endTime: { lte: endTimeObj } }],
          },
        ],
      },
    });

    if (conflictingReservation) {
      return sendError(
        res,
        HTTP_STATUS.CONFLICT,
        'There is a scheduling conflict for this space',
        ERROR_CODES.RESERVATION_SCHEDULING_CONFLICT
      );
    }

    // Verificar máximo de reservas por cliente por semana
    const weekStart = new Date(reservationDateObj);
    // Inicio de la semana (Domingo)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const weekEnd = new Date(weekStart);
    // Fin de la semana (Sábado)
    weekEnd.setDate(weekEnd.getDate() + 6);

    const clientReservationsThisWeek = await prisma.reservation.count({
      where: {
        clientEmail,
        reservationDate: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    if (clientReservationsThisWeek >= config.reservationRules.maxReservationsPerWeek) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        `Client has reached the maximum of ${config.reservationRules.maxReservationsPerWeek} reservations per week`,
        ERROR_CODES.RESERVATION_MAX_LIMIT_REACHED
      );
    }

    // Crear la reserva
    const newReservation = await prisma.reservation.create({
      data: {
        spaceId,
        placeId: space.placeId,
        clientEmail,
        reservationDate: reservationDateObj,
        startTime: startTimeObj,
        endTime: endTimeObj,
      },
    });

    return sendSuccess(res, newReservation, HTTP_STATUS.CREATED);
  } catch (error) {
    console.error('Error creating reservation:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to create reservation',
      ERROR_CODES.RESERVATION_CREATE_FAILED
    );
  }
};

// Actualizar una reserva
export const updateReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { spaceId, clientEmail, reservationDate, startTime, endTime } = req.body;

    // Verificar si la reserva existe
    const existingReservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingReservation) {
      return sendError(
        res,
        HTTP_STATUS.NOT_FOUND,
        'Reservation not found',
        ERROR_CODES.RESERVATION_NOT_FOUND
      );
    }

    // Si se proporciona spaceId, verificar si el espacio existe
    let placeId = existingReservation.placeId;
    if (spaceId) {
      const space = await prisma.space.findUnique({
        where: { id: spaceId },
        include: { place: true },
      });

      if (!space) {
        return sendError(
          res,
          HTTP_STATUS.NOT_FOUND,
          'Space not found',
          ERROR_CODES.SPACE_NOT_FOUND
        );
      }

      placeId = space.placeId;
    }

    // Parsear fechas si se proporcionan
    const reservationDateObj = reservationDate
      ? new Date(reservationDate)
      : existingReservation.reservationDate;
    const startTimeObj = startTime ? new Date(startTime) : existingReservation.startTime;
    const endTimeObj = endTime ? new Date(endTime) : existingReservation.endTime;

    if (endTimeObj <= startTimeObj) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'End time must be after start time',
        ERROR_CODES.RESERVATION_INVALID_TIME
      );
    }
    if (spaceId || reservationDate || startTime || endTime) {
      const conflictingReservation = await prisma.reservation.findFirst({
        where: {
          id: { not: parseInt(id) },
          spaceId: spaceId || existingReservation.spaceId,
          reservationDate: reservationDateObj,
          OR: [
            {
              AND: [{ startTime: { lte: startTimeObj } }, { endTime: { gt: startTimeObj } }],
            },
            {
              AND: [{ startTime: { lt: endTimeObj } }, { endTime: { gte: endTimeObj } }],
            },
            {
              AND: [{ startTime: { gte: startTimeObj } }, { endTime: { lte: endTimeObj } }],
            },
          ],
        },
      });

      if (conflictingReservation) {
        return sendError(
          res,
          HTTP_STATUS.CONFLICT,
          'There is a scheduling conflict for this space',
          ERROR_CODES.RESERVATION_SCHEDULING_CONFLICT
        );
      }
    }

    // Actualizar la reserva
    const updatedReservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: {
        spaceId: spaceId || undefined,
        placeId,
        clientEmail: clientEmail || undefined,
        reservationDate: reservationDateObj,
        startTime: startTimeObj,
        endTime: endTimeObj,
      },
    });

    return sendSuccess(res, updatedReservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to update reservation',
      ERROR_CODES.RESERVATION_UPDATE_FAILED
    );
  }
};

// Eliminar una reserva
export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar si la reserva existe
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) },
    });

    if (!reservation) {
      return sendError(
        res,
        HTTP_STATUS.NOT_FOUND,
        'Reservation not found',
        ERROR_CODES.RESERVATION_NOT_FOUND
      );
    }

    await prisma.reservation.delete({
      where: { id: parseInt(id) },
    });

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Failed to delete reservation',
      ERROR_CODES.RESERVATION_DELETE_FAILED
    );
  }
};
