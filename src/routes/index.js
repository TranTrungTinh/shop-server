'use strict'

// TODO: External Modules
const express = require('express');
const router = express.Router();

// TODO: Internal Modules
const { checkApiKey, checkPermission } = require('../auth/checkApiKey');

/* *Middleware */
// TODO: Check API Key
router.use(checkApiKey);
// TODO: Check Permission
router.use(checkPermission('0000')); // '0000' is meaning all permission

// TODO: Main Route
router.use('/api/v1', require('./access'));

module.exports = router;