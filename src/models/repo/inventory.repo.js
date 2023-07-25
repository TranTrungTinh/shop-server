'use strict'

const inventoryModel = require("../inventory.model")

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unKnow'
}) => {
  return await inventoryModel.create({
    inventory_product: productId,
    inventory_shop: shopId,
    inventory_stock: stock,
    inventory_location: location
  })
}

const reservationInventory = async ({
  productId,
  cartId,
  quantity
}) => {
  const query = {
    inventory_product: productId,
    inventory_stock: { $gte: quantity }
  }

  const updateSet = {
    $push: {
      inventory_reservations: {
        quantity,
        cartId,
        createdOn: new Date()
      }
    },
    $inc: {
      inventory_stock: -quantity
    }
  }

  const options = {
    new: true,
    upset: true
  }

  return await inventoryModel.updateOne(query, updateSet, options)
}

module.exports = {
  insertInventory,
  reservationInventory
}