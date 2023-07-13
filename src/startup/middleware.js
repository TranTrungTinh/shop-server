const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');

module.exports = function(app) {
  // TODO: init middleware
  app.use(morgan('dev'));
  app.use(helmet())
  app.use(compression())
  app.use(express.json()) // Express 4 built-in, not need to install
  app.use(express.urlencoded({ extended: true })) // Express 4 built-in, not need to install

}