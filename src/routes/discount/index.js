'use strict'

// TODO: External modules
const express = require('express');
const router = express.Router();

// TODO: Internal modules
const discountController = require('../../controllers/discount.controller');
const forwardError = require('../../helpers/forwardError');
const { /*authentication*/ authenticationV2 } = require('../../middleware/auth');

// TODO: handle search
router.post('/amount', forwardError(discountController.getDiscountAmount));
router.get('/listProductsCode', forwardError(discountController.getAllDiscountCodesWithProducts));

// TODO: middleware authentication
router.use(authenticationV2)
router.post('', forwardError(discountController.createDiscount));
router.get('', forwardError(discountController.getAllDiscountCodesForShop));

module.exports = router;