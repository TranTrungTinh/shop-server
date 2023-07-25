'use strict'

const { BadRequest } = require("../core/error.response")
const inventoryModel = require("../models/inventory.model")
const { getProductById } = require("../models/repo/product.repo")

class InventoryService {

  static async addStockToInventory({
    productId,
    shopId,
    stock,
    location = '74/13/4 Truong Quoc Dung'
  }) {

    const product = await getProductById(productId)

    if (!product) throw new BadRequest('Product not found')

    const query = {
      inventory_product: productId,
      inventory_shop: shopId
    }

    const updateSet = {
      $inc: {
        inventory_stock: stock
      },
      $set: {
        inventory_location: location
      }
    }

    const options = {
      new: true,
      upset: true
    }

    return await inventoryModel.updateOne(query, updateSet, options)
  }
}

module.exports = InventoryService