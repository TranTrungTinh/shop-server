'use strict'

const devEnv = {
  app: {
    port: process.env.DEV_APP_PORT || 3052,
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    name: process.env.DEV_DB_NAME || 'storeDev',
    port: process.env.DEV_DB_PORT || 27017,
  },
  redis: {
    host: process.env.DEV_REDIS_DB_HOST || 'localhost',
    port: process.env.DEV_REDIS_DB_PORT || 6379,
    password: process.env.DEV_REDIS_DB_PASSWORD || '',
  }
}

const proEnv = {
  app: {
    port: process.env.PRO_APP_PORT || 3052,
  },
  db: {
    host: process.env.PRO_DB_HOST || 'localhost',
    name: process.env.PRO_DB_NAME || 'storePro',
    port: process.env.PRO_DB_PORT || 27017,
  },
  redis: {
    host: process.env.PRO_REDIS_DB_HOST || 'localhost',
    port: process.env.PRO_REDIS_DB_PORT || 6379,
    password: process.env.PRO_REDIS_DB_PASSWORD || '',
  }
}

const config = {
  development: devEnv,
  production: proEnv
}
const env = process.env.NODE_ENV || 'development';
module.exports = config[env];