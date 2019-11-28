import * as dotenv from 'dotenv';

// import errors from './assets/i18n/en/errors';
// import messages from './assets/i18n/en/messages';

if (!process.env.NODE_ENV) {
  console.error('Please set NODE_ENV before running');
  process.exit();
}

process.env.NODE_ENV = process.env.NODE_ENV.trim();

dotenv.config({path: `./env/.env.${process.env.NODE_ENV}`});

export default {
  name: 'API',
  version: '1.0',
  host: process.env.APP_HOST || '127.0.0.1',
  environment: process.env.NODE_ENV,
  port: process.env.APP_PORT || '8000',
  pagination: {
    page: 1,
    maxRows: 20
  },
  explicitlyUnprotected: (process.env.EXPLICITLY_UNPROTECTED_ROUTES) ? process.env.EXPLICITLY_UNPROTECTED_ROUTES.split(',') : ['login', 'signup', 'utils'],
  auth: {
    secretKey: process.env.SECRET_KEY || 'Xps@~z#n*0c[~fz9TGn\'WQ%J)\'2taI'
  },
  db: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  logging: {
    dir: process.env.LOGGING_DIR || 'logs',
    level: process.env.LOGGING_LEVEL || 'debug'
  }
};
