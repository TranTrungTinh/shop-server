'use strict'

// TODO: External modules
const express = require('express');
const router = express.Router();

// TODO: Internal modules
const productController = require('../../controllers/product.controller');
const forwardError = require('../../helpers/forwardError');
const { authentication } = require('../../auth/authUtils');

// TODO: middleware authentication
router.use(authentication)
router.post('', forwardError(productController.createProduct));

module.exports = router;