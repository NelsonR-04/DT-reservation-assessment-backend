import { NextFunction, Request, Response } from 'express';
import config from '../config/config';

/**
 * Middleware para autenticar solicitudes usando una clave API
 * Verifica que la clave API proporcionada en el encabezado 'x-api-key' coincida con la clave configurada
 */
const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== config.auth.apiKey) {
    return res.status(401).json({
      error: 'No autorizado',
      message: 'Clave API inválida o faltante',
    });
  }

  next();
};

export default apiKeyAuth;
