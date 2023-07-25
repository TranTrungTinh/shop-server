'use strict'

// TODO: External modules
const express = require('express');
const router = express.Router();

// TODO: Internal modules
const inventoryController = require('../../controllers/inventory.controller');
const forwardError = require('../../helpers/forwardError');
const { /*authentication*/ authenticationV2 } = require('../../middleware/auth');

router.use(authenticationV2)
router.post('', forwardError(inventoryController.addStockToInventory));

module.exports = router;