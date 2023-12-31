'use strict'

// TODO: External Modules
const express = require('express');
const router = express.Router();

// TODO: Internal Modules
const { checkApiKey, checkPermission } = require('../middleware/apiKeyValidate');

/* *Middleware */
// TODO: Check API Key
router.use(checkApiKey);
// TODO: Check Permission
router.use(checkPermission('0000')); // '0000' is meaning all permission

// TODO: Main Route
const API_VERSION = '/api/v1';
router.use(`${API_VERSION}/comment`, require('./comment'));
router.use(`${API_VERSION}/notification`, require('./notification'));
router.use(`${API_VERSION}/checkout`, require('./checkout'));
router.use(`${API_VERSION}/inventory`, require('./inventory'));
router.use(`${API_VERSION}/discount`, require('./discount'));
router.use(`${API_VERSION}/product`, require('./product'));
router.use(`${API_VERSION}/cart`, require('./cart'));
router.use(`${API_VERSION}`, require('./access'));

module.exports = router;