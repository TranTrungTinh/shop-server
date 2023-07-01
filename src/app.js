const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const app = express();

// TODO: init middleware
app.use(morgan('dev'));
app.use(helmet())
app.use(compression())

// TODO: init db

// TODO: init routes
app.get('/', (req, res, next) => {
  // const str = 'Welcome server shop';

  return res.status(200).json({
    message: 'Welcome server shop',
    // metadata: str.repeat(10000)
  })
})

// TODO: handle error

module.exports = app;