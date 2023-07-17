'use strict'

const { CreatedResponse, OkResponse, UpdateResponse } = require("../core/success.response");
const checkoutService = require("../services/checkout.service");

class CheckoutController {

  /**
 * @description Add to cart
 * @method POST /api/v1/cart
 * @param {JSON} product
 *
 */
  async getReviewCheckout(req, res, next) {
    new OkResponse({
      message: 'Review checkout successfully',
      metadata: await checkoutService.getCheckoutReview({
        ...req.body,
      })
    }).send(res)
  }

}

module.exports = new CheckoutController();