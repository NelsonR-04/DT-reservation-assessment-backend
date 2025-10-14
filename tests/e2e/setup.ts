import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno de prueba
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

// Crear un nuevo cliente de Prisma para pruebas
const prisma = new PrismaClient();

// Función de configuración para ejecutar antes de todos los tests
export const setupTestDatabase = async () => {
  try {
    // Limpiar datos existentes
    await prisma.$transaction([
      prisma.reservation.deleteMany(),
      prisma.space.deleteMany(),
      prisma.place.deleteMany(),
    ]);

    // Sembrar datos de prueba
    const place = await prisma.place.create({
      data: {
        name: 'Test Coworking',
        location: 'Test Location',
      },
    });

    const spaces = await Promise.all([
      prisma.space.create({
        data: {
          name: 'Meeting Room A',
          reference: 'MRA',
          capacity: 8,
          description: 'Large meeting room with projector',
          placeId: place.id,
        },
      }),
      prisma.space.create({
        data: {
          name: 'Office Space 1',
          reference: 'OS1',
          capacity: 4,
          description: 'Small office for teams',
          placeId: place.id,
        },
      }),
      prisma.space.create({
        data: {
          name: 'Hot Desk Area',
          reference: 'HDA',
          capacity: 20,
          description: 'Open space with hot desks',
          placeId: place.id,
        },
      }),
    ]);

    // Crear algunas reservas de prueba
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await Promise.all([
      prisma.reservation.create({
        data: {
          spaceId: spaces[0].id,
          placeId: place.id,
          customerEmail: 'test1@example.com',
          reservationDate: today,
          startTime: '09:00',
          endTime: '11:00',
        },
      }),
      prisma.reservation.create({
        data: {
          spaceId: spaces[1].id,
          placeId: place.id,
          customerEmail: 'test2@example.com',
          reservationDate: tomorrow,
          startTime: '14:00',
          endTime: '16:00',
        },
      }),
    ]);

    return { place, spaces };
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
};

// Función de limpieza para ejecutar después de todos los tests
export const teardownTestDatabase = async () => {
  try {
    await prisma.$transaction([
      prisma.reservation.deleteMany(),
      prisma.space.deleteMany(),
      prisma.place.deleteMany(),
    ]);
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error tearing down test database:', error);
    await prisma.$disconnect();
    throw error;
  }
};
