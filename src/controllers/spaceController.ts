import { Request, Response } from 'express';
import prisma from '../models';

// Obtener todos los espacios
export const getAllSpaces = async (req: Request, res: Response) => {
  try {
    const spaces = await prisma.space.findMany({
      include: { place: true },
    });
    res.status(200).json(spaces);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    res.status(500).json({ error: 'Failed to fetch spaces' });
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
      return res.status(404).json({ error: 'Space not found' });
    }

    res.status(200).json(space);
  } catch (error) {
    console.error('Error fetching space:', error);
    res.status(500).json({ error: 'Failed to fetch space' });
  }
};

// Crear un nuevo espacio
export const createSpace = async (req: Request, res: Response) => {
  try {
    const { placeId, name, reference, capacity, description } = req.body;

    if (!placeId || !name || !capacity) {
      return res.status(400).json({ error: 'PlaceId, name, and capacity are required' });
    }

    // Verificar si el lugar existe
    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
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

    res.status(201).json(newSpace);
  } catch (error) {
    console.error('Error creating space:', error);
    res.status(500).json({ error: 'Failed to create space' });
  }
};

// Actualizar un espacio
export const updateSpace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { placeId, name, reference, capacity, description } = req.body;

    // Verificar si el espacio existe
    const space = await prisma.space.findUnique({
      where: { id: parseInt(id) },
    });

    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    // Si se proporciona placeId, verificar si el lugar existe
    if (placeId) {
      const place = await prisma.place.findUnique({
        where: { id: placeId },
      });

      if (!place) {
        return res.status(404).json({ error: 'Place not found' });
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

    res.status(200).json(updatedSpace);
  } catch (error) {
    console.error('Error updating space:', error);
    res.status(500).json({ error: 'Failed to update space' });
  }
};

// Eliminar un espacio
export const deleteSpace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar si el espacio existe
    const space = await prisma.space.findUnique({
      where: { id: parseInt(id) },
    });

    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    // Eliminar el espacio
    await prisma.space.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting space:', error);
    res.status(500).json({ error: 'Failed to delete space' });
  }
};
