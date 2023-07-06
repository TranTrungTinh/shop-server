'use strict'

const _ = require('lodash');

const getObjectData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
}

module.exports = {
  getObjectData
}