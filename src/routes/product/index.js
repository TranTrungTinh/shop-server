'use strict'

// TODO: External modules
const express = require('express');
const router = express.Router();

// TODO: Internal modules
const productController = require('../../controllers/product.controller');
const forwardError = require('../../helpers/forwardError');
const { /*authentication*/ authenticationV2 } = require('../../middleware/auth');

// TODO: handle search
router.get('', forwardError(productController.findAllProducts));
router.get('/:id', forwardError(productController.findProduct));
router.get('/search/:keySearch', forwardError(productController.getProductSearch));

// TODO: middleware authentication
router.use(authenticationV2)
router.post('', forwardError(productController.createProduct));
router.patch('/:id', forwardError(productController.updateProduct));
router.put('/published/:id', forwardError(productController.publishProduct));
router.put('/unpublished/:id', forwardError(productController.unPublishProduct));

// TODO: GET all products
router.get('/drafts/all', forwardError(productController.getAllDraftForShop));
router.get('/published/all', forwardError(productController.getAllPublishedForShop));

module.exports = router;