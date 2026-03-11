import fs from 'fs';
import path from 'path';
import pino from 'pino';

const logDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV === 'test'
      ? undefined
      : {
          targets: [
            {
              target: 'pino-pretty',
              level: 'debug',
              options: {
                colorize: true,
                singleLine: true,
                translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                ignore: 'pid,hostname',
              },
            },
            {
              target: 'pino/file',
              level: 'info',
              options: {
                destination: path.join(logDir, 'server.log'),
              },
            },
          ],
        },
});

export default logger;

