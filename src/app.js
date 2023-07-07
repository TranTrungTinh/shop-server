// TODO: External modules
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const app = express();

// TODO: Internal modules
// const { checkOverloadConnection } = require('./helpers/check.connect');

// TODO: init middleware
app.use(morgan('dev'));
app.use(helmet())
app.use(compression())
app.use(express.json()) // Express 4 built-in, not need to install
app.use(express.urlencoded({ extended: true })) // Express 4 built-in, not need to install

// TODO: init db
require('./dbs/init.mongodb');
// checkOverloadConnection();

// TODO: init routes
app.use('/', require('./routes/index'));

// TODO: forward error by middleware
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.statusCode = 404;
  next(error); // forward error
})

// TODO: handle error
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  return res.status(statusCode).json({
    status: 'NOT_GOOD',
    code: statusCode,
    message,
  });
})

module.exports = app;