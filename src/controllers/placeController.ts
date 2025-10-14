import { Request, Response } from 'express';
import prisma from '../models';

// Obtener todos los lugares
export const getAllPlaces = async (req: Request, res: Response) => {
  try {
    const places = await prisma.place.findMany();
    res.status(200).json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: 'Failed to fetch places' });
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
      return res.status(404).json({ error: 'Place not found' });
    }

    res.status(200).json(place);
  } catch (error) {
    console.error('Error fetching place:', error);
    res.status(500).json({ error: 'Failed to fetch place' });
  }
};

// Crear un nuevo lugar
export const createPlace = async (req: Request, res: Response) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required' });
    }

    const newPlace = await prisma.place.create({
      data: {
        name,
        location,
      },
    });

    res.status(201).json(newPlace);
  } catch (error) {
    console.error('Error creating place:', error);
    res.status(500).json({ error: 'Failed to create place' });
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

    res.status(200).json(updatedPlace);
  } catch (error) {
    console.error('Error updating place:', error);
    res.status(500).json({ error: 'Failed to update place' });
  }
};

// Eliminar un lugar
export const deletePlace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar si el lugar existe
    const place = await prisma.place.findUnique({
      where: { id: parseInt(id) },
    });

    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    // Eliminar el lugar
    await prisma.place.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting place:', error);
    res.status(500).json({ error: 'Failed to delete place' });
  }
};
