import express from 'express';
import * as placeController from '../controllers/placeController';

const router = express.Router();

// GET /lugares - Obtener todos los lugares
router.get('/', placeController.getAllPlaces);

// GET /lugares/:id - Obtener lugar por ID
router.get('/:id', placeController.getPlaceById);

// POST /lugares - Crear un nuevo lugar
router.post('/', placeController.createPlace);

// PUT /lugares/:id - Actualizar un lugar
router.put('/:id', placeController.updatePlace);

// DELETE /lugares/:id - Eliminar un lugar
router.delete('/:id', placeController.deletePlace);

export default router;
