// TODO: External modules
require('dotenv').config();
const express = require('express');
const app = express();

// TODO: init logging, middleware
require('./startup/logging')();
require('./startup/middleware')(app);
// TODO: init db, routes
require('./dbs/init.mongodb');
require('./startup/routes')(app);

module.exports = app;