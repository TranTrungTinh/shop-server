'use strict'

const { CreatedResponse, OkResponse, UpdateResponse } = require("../core/success.response");
const inventoryService = require("../services/inventory.service");

class InventoryController {

  /**
 * @description Add to cart
 * @method POST /api/v1/cart
 * @param {JSON} product
 *
 */
  async addStockToInventory(req, res, next) {
    new OkResponse({
      message: 'Add stock to inventory successfully',
      metadata: await inventoryService.addStockToInventory({
        ...req.body,
      })
    }).send(res)
  }

}

module.exports = new InventoryController();