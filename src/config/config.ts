import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    apiKey: process.env.API_KEY,
  },
  // Reglas de reserva
  reservationRules: {
    maxReservationsPerWeek: 3,
  },
};

export default config;
