'use strict'

const { CreatedResponse, OkResponse, UpdateResponse } = require("../core/success.response");
const discountService = require("../services/discount.service");

class DiscountController {

  /**
 * TODO: Get all draft product for shop
 * @param {JSON} product
 *
 */
  async createDiscount(req, res, next) {
    new CreatedResponse({
      message: 'Created new discount code successfully',
      metadata: await discountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId // middleware authenticationV2
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
  async getAllDiscountCodesForShop(req, res, next) {
    new OkResponse({
      message: 'Get all discount codes for shop successfully',
      metadata: await discountService.getDiscountCodesByShop({
        shopId: req.user.userId, // middleware authenticationV2
        ...req.query
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
  async getAllDiscountCodesWithProducts(req, res, next) {
    new OkResponse({
      message: 'Get all discount codes successfully',
      metadata: await discountService.getDiscountCodesWithProduct({
        ...req.query
      })
    }).send(res)
  }

  async getDiscountAmount(req, res, next) {
    new OkResponse({
      message: 'Get discount amount successfully',
      metadata: await discountService.getDiscountAmount({
        ...req.body,
      })
    }).send(res)
  }

}

module.exports = new DiscountController();