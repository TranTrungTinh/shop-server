'use strict'

const cartModel = require("../models/cart.model")
const { getProductById } = require("../models/repo/product.repo")
const { NotFoundRequest } = require("../core/error.response")
/**
 * Cart service
 * 1 - Add product to cart
 * 2 - Remove product from cart
 * 3 - Update product quantity
 * 4 - Get list cart
 * 5 - Reduce product quantity
 * 6 - Increase product quantity
 */

class CartService {

  static async createUserCart({ userId, product = {} }) {
    const query = {
      cart_user_id: userId,
      cart_state: 'active'
    }

    // TODO: If cart is not existed, create new cart
    const updateOrInsert = {
      $addToSet: {
        cart_products: product
      }
    }

    const options = {
      upsert: true,
      new: true
    }

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
  }

  static async updateUserCartQuantity({ userId, product = {} }) {

    const { productId, quantity } = product

    const query = {
      cart_user_id: userId,
      cart_state: 'active',
      'cart_products.productId': productId
    }

    // TODO: Increase product quantity
    // TODO: $ is mean current product
    const updateSet = {
      $inc: {
        'cart_products.$.quantity': quantity
      }
    }

    const options = {
      new: true
    }

    return await cartModel.findOneAndUpdate(query, updateSet, options)
  }

  /**
   * Add product to cart
   * @param {String} cartId
   * @param {Object} product
   * @returns
   */
  static async addProductToCart({ userId, product = {} }) {

    const userCart = await cartModel.findOne({
      cart_user_id: userId,
    })

    // TODO: Check cart is existed, => create new cart
    if (!userCart) {
      return await this.createUserCart({ userId, product })
    }

    // TODO: Check cart products, if blank => add new one
    if (userCart.cart_products.length === 0) {
      userCart.cart_products = [product]
      return await userCart.save()
    }

    // TODO: Update cart products quantity
    return await this.updateUserCartQuantity({ userId, product })
  }

  /**
   * Update product item to cart
   * shop_order_ids: [
   *   {
   *      shopId,
   *      item_products: [
   *       {
   *        productId,
   *        price,
   *        quantity,
   *        oldQuantity,
   *        shopId,
   *     ]
   *   }
   * ]
   *
   */
  static async updateProductItemToCart({ userId, shop_order_ids = [] }) {
    const { item_products, shopId } = shop_order_ids[0]
    const { productId, quantity, oldQuantity } = item_products[0]

    // TODO: Check product is existed
    const foundProduct = await getProductById({
      product_id: productId,
      unSelect: []
    })

    if (!foundProduct) throw new NotFoundRequest('Product not found')

    if (foundProduct.product_shop.toString() !== shopId) {
      throw new NotFoundRequest('Product not belong to shop')
    }

    if (quantity === 0) {
      return await this.removeProductFromCart({ userId, productId })
    }

    return await this.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - oldQuantity
      }
    })
  }

  static async removeProductItemFromCart({ userId, productId }) {

    const query = {
      cart_user_id: userId,
      cart_state: 'active',
    }

    const updateSet = {
      $pull: {
        cart_products: {
          productId
        }
      }
    }

    return await cartModel.updateOne(query, updateSet)
  }

  static async listProductItemInCart({ userId }) {
    const query = {
      cart_user_id: userId,
      cart_state: 'active',
    }

    return await cartModel.findOne(query).lean()
  }
}

module.exports = CartService