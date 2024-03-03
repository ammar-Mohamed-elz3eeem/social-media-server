import { createLogger, format, transports } from 'winston';
const { printf, combine, timestamp } = format;

const loggerFormat = printf(info => {
  return `${info.timestamp} | ${info.level}: ${info.message}`;
});

export const logger = createLogger({
  level: 'debug',
  format: combine(
    format.colorize(),
    timestamp(),
    loggerFormat
  ),
  transports: [
    new transports.Console()
  ]
});
