import { IncomingMessage } from 'http';
import { createLogger, transports, format } from 'winston';
import path from 'path';
import morgan from 'morgan';
import 'winston-daily-rotate-file';

import { print, colorWord } from './print';

const fileRotateTransport = new transports.DailyRotateFile({
  level: 'http',
  filename: path.join(process.cwd(), 'src', 'logs', '%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d',
});

const winston = createLogger({
  level: 'http',
  format: format.combine(
    format.timestamp({ format: 'HH:MM:SS A' }),
    format.json(),
    format.prettyPrint()
  ),
  transports: [fileRotateTransport],
});

export const logger = morgan(
  (tokens, req: IncomingMessage & { body: Object }, res) => {
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const status = tokens.status(req, res);
    const content_length = tokens.res(req, res, 'content-length');
    const response_time = tokens['response-time'](req, res);

    const coloredStatus = status ? getStatusColor(status) : '';
    const logMessage = `${method} ${url} ${coloredStatus} ${response_time} ms - ${content_length}`;

    print.default(logMessage);
    const hasBody = !!Object.keys(req.body).length;

    return JSON.stringify({
      method,
      url,
      status,
      content_length,
      response_time,
      ...(hasBody ? { body: req.body } : {}),
    });
  },
  {
    stream: {
      write: (result) => {
        const data = JSON.parse(result);
        winston.http(data);
      },
    },
  }
);

function getStatusColor(status: string) {
  const code = parseInt(status);

  switch (true) {
    case code < 200:
      return colorWord.one(code, 'white');

    case code < 300:
      return colorWord.one(code, 'green');

    case code < 400:
      return colorWord.one(code, 'cyan');

    case code < 500:
      return colorWord.one(code, 'yellow');
  }

  return colorWord.one(code, 'red');
}
