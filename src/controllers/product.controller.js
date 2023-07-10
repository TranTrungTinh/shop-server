'use strict'

const { CreatedResponse, OkResponse } = require("../core/success.response");
const productService = require("../services/product.service");

class ProductController {

  async createProduct(req, res, next) {
    new CreatedResponse({
      message: 'Created new product successfully',
      metadata: await productService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId // middleware authenticationV2
      })
    }).send(res)
  }
}

module.exports = new ProductController();