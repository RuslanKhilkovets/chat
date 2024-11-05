const { createLogger, transports, format } = require('winston');
const { MongoDB } = require('winston-mongodb');
require('dotenv').config();

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/combined.log' }),
    new MongoDB({
      db: process.env.ATLAS_URI,
      collection: 'logs',
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = logger;
