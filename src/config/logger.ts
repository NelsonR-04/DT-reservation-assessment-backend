import winston from 'winston';
import config from './config';

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'cyan',
  debug: 'blue',
};

winston.addColors(colors);

const transports = [];

transports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss:ms',
      }),
      winston.format.colorize({ all: true }),
      winston.format.printf(info => {
        const { timestamp, level, message, ...args } = info;
        const ts = typeof timestamp === 'string' ? timestamp.slice(0, 19).replace('T', ' ') : '';
        return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
      }),
    ),
  }),
);

// Transportes de archivo para entornos que no son de prueba
if (config.nodeEnv !== 'test') {
  // Archivo de registro de errores
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),
  );

  transports.push(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),
  );
}

// Crear el logger
const logger = winston.createLogger({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss:ms',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports,
});

// Crear un objeto de stream para el registro de peticiones HTTP de Morgan
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;
