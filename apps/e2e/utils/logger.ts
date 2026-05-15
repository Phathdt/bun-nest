import pino from 'pino';

import preset from '@config/test.config';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? preset.logLevel,
  transport:
    process.env.LOG_FORMAT === 'json'
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
            translateTime: 'SYS:standard',
          },
        },
});
