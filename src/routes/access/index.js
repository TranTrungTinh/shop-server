'use strict'

// TODO: External modules
const express = require('express');
const router = express.Router();

// TODO: Internal modules
const accessController = require('../../controllers/access.controller');
const forwardError = require('../../auth/forwardError');

// TODO: route sign up
router.post('/shop/signup', forwardError(accessController.signUp));

module.exports = router;