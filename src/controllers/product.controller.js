'use strict'

const { CreatedResponse, OkResponse, UpdateResponse } = require("../core/success.response");
// const productService = require("../services/product.service");
const productService = require("../services/product.service.master");

class ProductController {

  /**
 * TODO: Get all draft product for shop
 * @param {JSON} product
 *
 */
  async createProduct(req, res, next) {
    // new CreatedResponse({
    //   message: 'Created new product successfully',
    //   metadata: await productService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId // middleware authenticationV2
    //   })
    // }).send(res)

    // TODO: improve v2
    new CreatedResponse({
      message: 'Created new product successfully',
      metadata: await productService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId // middleware authenticationV2
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
  async getAllDraftForShop(req, res, next) {
    new OkResponse({
      message: 'Get all draft product successfully',
      metadata: await productService.findAllDraftsForShop({
        product_shop: req.user.userId, // middleware authenticationV2
        ...req.query
      })
    }).send(res)
  }

  /**
 * TODO: Get all published product for shop
 * @param {product_shop} token
 * @param {limit} req.query.limit
 * @param {skip} req.query.skip
 *
 */
  async getAllPublishedForShop(req, res, next) {
    new OkResponse({
      message: 'Get all published product successfully',
      metadata: await productService.findAllPublishedForShop({
        product_shop: req.user.userId, // middleware authenticationV2
        ...req.query
      })
    }).send(res)
  }

  async getProductSearch(req, res, next) {
    new OkResponse({
      message: 'Search product successfully',
      metadata: await productService.getProductSearch(req.params)
    }).send(res)
  }

  /**
 * TODO: Publish product
 * @param {String} product_id
 * @param {String} product_shop
 *
 */
  async publishProduct(req, res, next) {
    new UpdateResponse({
      message: 'Published product successfully',
      metadata: await productService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId // middleware authenticationV2
      })
    }).send(res)
  }

  /**
 * TODO: Un publish product
 * @param {String} product_id
 * @param {String} product_shop
 *
 */
  async unPublishProduct(req, res, next) {
    new UpdateResponse({
      message: 'Un Published product successfully',
      metadata: await productService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId // middleware authenticationV2
      })
    }).send(res)
  }
}

module.exports = new ProductController();