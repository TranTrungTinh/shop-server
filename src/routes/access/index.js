'use strict'

// TODO: External modules
const express = require('express');
const router = express.Router();

// TODO: Internal modules
const accessController = require('../../controllers/access.controller');

// TODO: route sign up
router.post('/shop/signup', accessController.signUp);

module.exports = router;