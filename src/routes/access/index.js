'use strict'

// TODO: External modules
const express = require('express');
const router = express.Router();

// TODO: Internal modules
const accessController = require('../../controllers/access.controller');
const forwardError = require('../../helpers/forwardError');
const { authentication, authenticationV2 } = require('../../middleware/auth');

// TODO: route sign up
router.post('/shop/signup', forwardError(accessController.signUp));

// TODO: route login
router.post('/shop/login', forwardError(accessController.login));

// TODO: route logout
// TODO: middleware authentication
router.use(authenticationV2)
router.post('/shop/logout', forwardError(accessController.logout));

// TODO: route refresh token
router.post('/shop/refreshToken', forwardError(accessController.refreshToken));

module.exports = router;