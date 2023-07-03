'use strict'

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000

// TODO: Count number of connections
const connectCount = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
}

// TODO: Check overload connection
const checkOverloadConnection = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
    const maxConnection = numCore * 2;

    console.log(`Memory Usage: ${memoryUsage}`);
    console.log(`Number of connections: ${numConnection}`);

    if (numConnection > maxConnection) {
      console.log('Overload connection');
      // Notify to admin
    }
  }, _SECONDS) // Monitor every 5 seconds
}

module.exports = {
  connectCount,
  checkOverloadConnection
}