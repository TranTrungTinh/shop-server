'use strict'

const mongoose = require('mongoose');

const env  = require('../configs/environment.config');
const connectString = `mongodb+srv://${env.db.host}:${env.db.port}/${env.db.name}`;
const { connectCount } = require('../helpers/check.connect');

// TODO: Singleton pattern
class Database {

  constructor() {
    this._connect();
  }

  // TODO: Connected to mongodb
  _connect() {
    if (true) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose.connect(connectString, {
      maxPoolSize: 50 // TODO: Max connection
    })
      .then(() => {
        connectCount()
        console.log('Connected to mongodb');
      })
      .catch(err => {
        console.log('Connect to mongodb failed');
        console.error(err);
      })
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }

    return this.instance;
  }

}

const dbInstance = Database.getInstance();
module.exports = dbInstance;