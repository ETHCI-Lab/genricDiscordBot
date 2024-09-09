import { createLogger, format, transports , addColors} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
require('dotenv').config()

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

addColors(colors)

const customFormat = format.combine(
  format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
  format.align(),
  format.printf((i) => `${i.level}: ${[i.timestamp]}: ${i.message}`)
);

const transport: DailyRotateFile = new DailyRotateFile({
  filename: `${process.env.LogPath}/%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '365d'
});


export const logger = createLogger({
  format: customFormat,
  transports: [
    transport
  ]
});