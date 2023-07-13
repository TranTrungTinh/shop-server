const winston = require('winston');

module.exports = function(app) {
  // TODO: init routes
  app.use('/', require('../routes/index'));

  // TODO: forward error by middleware
  app.use((req, res, next) => {
    const error = new Error('Not found');
    error.statusCode = 404;
    next(error); // forward error
  })

  // TODO: handle error
  app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    winston.error(error.message, error);
    const message = error.message || 'Internal Server Error';

    return res.status(statusCode).json({
      status: 'NOT_GOOD',
      code: statusCode,
      message,
    });
  })
}