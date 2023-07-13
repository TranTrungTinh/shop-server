'use strict';

const { HEADERS } = require("../constants/header.config");
const { ForbiddenRequest } = require("../core/error.response");
const ApiKeyService = require("../services/apiKey.service");

const checkApiKey = async (req, res, next) => {
  const apiKey = req.headers[HEADERS.API_KEY];
  if (!apiKey) {
    return next(new ForbiddenRequest('Forbidden Error'));
    // return res.status(403).json({ message: 'Forbidden Error' });
  }

  const objKey = await ApiKeyService.verifyApiKey(apiKey);

  if (!objKey) {
    return next(new ForbiddenRequest('Forbidden Error'));
    // return res.status(403).json({ message: 'Forbidden Error' })
  }

  req.objKey = objKey;

  return next();
}

const checkPermission = (permission) => {
  return (req, res, next) => {
    // TODO: if permission is in objKey.permissions
    if (req.objKey?.permissions?.includes?.(permission)) {
      return next();
    }
    // TODO: permission denied
    return next(new ForbiddenRequest('Permission denied'));
  }
}

module.exports = {
  checkApiKey,
  checkPermission
};