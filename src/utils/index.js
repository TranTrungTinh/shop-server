'use strict'

const _ = require('lodash');
const crypto = require('node:crypto');
const { flatten } = require('flat')
const { Types } = require('mongoose');

const convertToObjectId = (id) => {
  return Types.ObjectId(id);
}

const getObjectData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
}

const getRandomString = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
}

// TODO: transform ['a', 'b', 'c'] => { a: 1, b: 1, c: 1 }
const getSelectFields = (fields = []) => {
  return Object.fromEntries(fields.map(field => [field, 1]));
}

// TODO: transform ['a', 'b', 'c'] => { a: 0, b: 0, c: 0 }
const getUnSelectFields = (fields = []) => {
  return Object.fromEntries(fields.map(field => [field, 0]));
}

// TODO: Remove all undefined, null, empty string, empty array, empty in deep object
const compactDeepObject = (object = {}) => {
  const flattenObject = flatten(object);
  // console.info('flattenObject', flattenObject);
  return _.omitBy(flattenObject, _.isNil);
}

// TODO: Check current Date is between start and end date
const isDateBetween = ({
  currentDate = new Date(), startDate, endDate
}) => {
  return currentDate >= new Date(startDate) && currentDate <= new Date(endDate);
}

module.exports = {
  getObjectData,
  getRandomString,
  getSelectFields,
  getUnSelectFields,
  compactDeepObject,
  convertToObjectId,
  isDateBetween
}