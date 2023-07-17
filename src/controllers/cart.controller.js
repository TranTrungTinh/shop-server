'use strict'

const { CreatedResponse, OkResponse, UpdateResponse } = require("../core/success.response");
const cartService = require("../services/cart.service");

class CartController {

  /**
 * @description Add to cart
 * @method POST /api/v1/cart
 * @param {JSON} product
 *
 */
  async addToCart(req, res, next) {
    new CreatedResponse({
      message: 'Add to cart successfully',
      metadata: await cartService.addProductToCart({
        ...req.body,
      })
    }).send(res)
  }

  /**
 * TODO: Get all draft product for shop
 * @param {product_shop} token
 * @param {limit} req.query.limit
 * @param {skip} req.query.skip
 *
 */
  async updateProductItem(req, res, next) {
    new UpdateResponse({
      message: 'Update product item successfully',
      metadata: await cartService.updateProductItemToCart({
        ...req.body,
      })
    }).send(res)
  }

  /**
 * TODO: Get all discount codes with products
 * @param {string} product_shop
 * @param {number} req.query.limit
 * @param {number} req.query.skip
 *
 */
  async deleteProductItem(req, res, next) {
    new OkResponse({
      message: 'Deleted product item successfully',
      metadata: await cartService.removeProductItemFromCart({
        ...req.body,
      })
    }).send(res)
  }

  async getListItemsFromCart(req, res, next) {
    new OkResponse({
      message: 'Get product items from cart successfully',
      metadata: await cartService.listProductItemInCart({
        ...req.query,
      })
    }).send(res)
  }

}

module.exports = new CartController();