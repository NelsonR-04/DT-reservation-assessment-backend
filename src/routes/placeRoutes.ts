import express from 'express';
import * as placeController from '../controllers/placeController';

const router = express.Router();

router.get('/', placeController.getAllPlaces);

router.get('/:id', placeController.getPlaceById);

router.post('/', placeController.createPlace);

router.put('/:id', placeController.updatePlace);

router.delete('/:id', placeController.deletePlace);

export default router;
