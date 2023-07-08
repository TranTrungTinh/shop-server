'use strict'

const _ = require('lodash');
const crypto = require('node:crypto');

const getObjectData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
}

const getRandomString = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
}

module.exports = {
  getObjectData,
  getRandomString
}