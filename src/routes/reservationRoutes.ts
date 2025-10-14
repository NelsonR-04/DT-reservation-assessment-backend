import express from 'express';
import * as reservationController from '../controllers/reservationController';
const router = express.Router();

router.get('/', reservationController.getAllReservations);

router.get('/:id', reservationController.getReservationById);

router.post('/', reservationController.createReservation);

router.put('/:id', reservationController.updateReservation);

router.delete('/:id', reservationController.deleteReservation);

export default router;
