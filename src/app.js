// TODO: External modules
require('dotenv').config();
const express = require('express');
const app = express();

 // TODO: init db
require('./startup/logging')();
require('./startup/middleware')(app);
 // TODO: init db
 require('./dbs/init.mongodb');
 require('./startup/routes')(app);

module.exports = app;