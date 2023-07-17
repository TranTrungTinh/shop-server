'use strict'

// TODO: External modules
const express = require('express');
const router = express.Router();

// TODO: Internal modules
const cartController = require('../../controllers/cart.controller');
const forwardError = require('../../helpers/forwardError');
const { /*authentication*/ authenticationV2 } = require('../../middleware/auth');


// TODO: middleware authentication
router.use(authenticationV2)
router.post('', forwardError(cartController.addToCart));
router.get('', forwardError(cartController.getListItemsFromCart));
router.patch('', forwardError(cartController.updateProductItem));
router.delete('', forwardError(cartController.deleteProductItem));

module.exports = router;