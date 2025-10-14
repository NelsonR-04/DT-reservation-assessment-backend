import express from 'express';
import * as spaceController from '../controllers/spaceController';

const router = express.Router();

// GET /espacios - Obtener todos los espacios
router.get('/', spaceController.getAllSpaces);

// GET /espacios/:id - Obtener espacio por ID
router.get('/:id', spaceController.getSpaceById);

// POST /espacios - Crear un nuevo espacio
router.post('/', spaceController.createSpace);

// PUT /espacios/:id - Actualizar un espacio
router.put('/:id', spaceController.updateSpace);

// DELETE /espacios/:id - Eliminar un espacio
router.delete('/:id', spaceController.deleteSpace);

export default router;
