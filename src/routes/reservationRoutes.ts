import express from 'express';
import * as reservationController from '../controllers/reservationController';

const router = express.Router();

// GET /reservas - Obtener todas las reservas
router.get('/', reservationController.getAllReservations);

// GET /reservas/:id - Obtener reserva por ID
router.get('/:id', reservationController.getReservationById);

// POST /reservas - Crear una nueva reserva
router.post('/', reservationController.createReservation);

// PUT /reservas/:id - Actualizar una reserva
router.put('/:id', reservationController.updateReservation);

// DELETE /reservas/:id - Eliminar una reserva
router.delete('/:id', reservationController.deleteReservation);

export default router;
