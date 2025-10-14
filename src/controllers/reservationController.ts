import { Request, Response } from 'express';
import config from '../config/config';
import prisma from '../models';

// Obtener todas las reservas con paginación
export const getAllReservations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const reservations = await prisma.reservation.findMany({
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

    const total = await prisma.reservation.count();

    res.status(200).json({
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
    res.status(500).json({ error: 'Failed to fetch reservations' });
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
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ error: 'Failed to fetch reservation' });
  }
};

// Crear una nueva reserva
export const createReservation = async (req: Request, res: Response) => {
  try {
    const { spaceId, clientEmail, reservationDate, startTime, endTime } = req.body;

    if (!spaceId || !clientEmail || !reservationDate || !startTime || !endTime) {
      return res.status(400).json({
        error: 'SpaceId, clientEmail, reservationDate, startTime, and endTime are required',
      });
    }

    // Verificar si el espacio existe
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: { place: true },
    });

    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    // Parsear fechas
    const reservationDateObj = new Date(reservationDate);
    const startTimeObj = new Date(startTime);
    const endTimeObj = new Date(endTime);

    // Validar fechas
    if (endTimeObj <= startTimeObj) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    // Verificar conflictos de horario
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
      return res.status(409).json({ error: 'There is a scheduling conflict for this space' });
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
      return res.status(400).json({
        error: `Client has reached the maximum of ${config.reservationRules.maxReservationsPerWeek} reservations per week`,
      });
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

    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
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
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Si se proporciona spaceId, verificar si el espacio existe
    let placeId = existingReservation.placeId;
    if (spaceId) {
      const space = await prisma.space.findUnique({
        where: { id: spaceId },
        include: { place: true },
      });

      if (!space) {
        return res.status(404).json({ error: 'Space not found' });
      }

      placeId = space.placeId;
    }

    // Parsear fechas si se proporcionan
    const reservationDateObj = reservationDate
      ? new Date(reservationDate)
      : existingReservation.reservationDate;
    const startTimeObj = startTime ? new Date(startTime) : existingReservation.startTime;
    const endTimeObj = endTime ? new Date(endTime) : existingReservation.endTime;

    // Validar fechas
    if (endTimeObj <= startTimeObj) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    // Verificar conflictos de horario (excluyendo esta reserva)
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
        return res.status(409).json({ error: 'There is a scheduling conflict for this space' });
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

    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ error: 'Failed to update reservation' });
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
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Eliminar la reserva
    await prisma.reservation.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
};
