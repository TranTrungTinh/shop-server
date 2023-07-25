'use strict'

const { NotFoundRequest, BadRequest } = require("../core/error.response")
const { getDiscountAmount } = require("./discount.service")
const { findCartById } = require("../models/repo/cart.repo")
const { checkProductAfterCheckout } = require("../models/repo/product.repo")
const { acquireLock, releaseLock } = require("./redis.service")
const { createNewOrder } = require("../models/repo/order.repo")

class CheckoutService {
  /**
   *
   * @param {Array} shop_order_ids
   *
   * {
   * cardId,
   * userId,
   * shop_order_ids: [
   * {
   *  shopId,
   *  shop_discounts: [],
   *  item_products: [
   *    {
   *     productId,
   *     price,
   *     quantity,
   *    }
   *   ]
   * }
   * ]
   * }
   */
  static async getCheckoutReview({
    cardId, userId, shop_order_ids
  }) {
    // TODO: Check user is existed (login or without login)
    // TODO: Check cart is existed

    const foundCart = await findCartById(cardId)

    if (!foundCart) throw new BadRequest('Cart not found')

    const checkoutOrder = {
      totalPrice: 0, //* total price of all products
      freeShip: 0, // * total free ship of all products
      totalDiscount: 0, // * total discount of all products
      totalCheckout: 0, // * total checkout of all products
    }

    const shopOrderIdsNews = []

    // TODO: Calculate total order

    for (const item of shop_order_ids) {
      const { shopId, shop_discounts = [], item_products = [] } = item

      const productServerItems = await checkProductAfterCheckout(item_products)

      if (!productServerItems[0]) throw new BadRequest('Invalid orders')

      // ? Total price of all products
      const totalPrice = productServerItems.reduce((total, item) => {
        return total + (item.product_price * item.product_quantity)
      }, 0)

      checkoutOrder.totalPrice += totalPrice

      // ? Total discount of all products
      const itemCheckout = {
        shopId,
        shop_discounts,
        priceBeforeDiscount: totalPrice,
        priceAfterDiscount: totalPrice,
        item_products: productServerItems
      }

      // TODO: Apply discount
      if (shop_discounts.length > 0) {
        const {
          totalPrice = 0,
          amount = 0
        } = await getDiscountAmount({
          code: shop_discounts?.[0]?.codeId,
          shopId,
          userId,
          products: productServerItems
        })

        // ? Update amount
        checkoutOrder.totalDiscount += amount

        // ? Update price after discount
        if (amount > 0) {
          itemCheckout.priceAfterDiscount = totalPrice
        }
      }

      checkoutOrder.totalCheckout += itemCheckout.priceAfterDiscount

      shopOrderIdsNews.push(itemCheckout)

    }

    return {
      shop_order_ids,
      shop_order_ids_new: shopOrderIdsNews,
      checkout_order: checkoutOrder
    }
  }

  /**
   * @description Order checkout
   * @param {Array} shop_order_ids
   */
  static async checkoutByUser({
    userId,
    cardId,
    shop_order_ids,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } = await this.getCheckoutReview({
      cardId,
      userId,
      shop_order_ids
    })

    const products = shop_order_ids_new.flatMap(item => item.item_products)

    const acquireProduct = []

    for (const product of products) {
      const { productId, product_quantity } = product

      const keyLock = await acquireLock({
        productId,
        quantity: product_quantity,
        cartId
      })

      //TODO: Check lock success
      acquireProduct.push(keyLock ? true : false)

      //TODO: Release lock
      keyLock && await releaseLock(keyLock)
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequest('Product is not available! PLease check your cart')
    }

    // TODO: Create new order
    const newOrder = await createNewOrder({
      userId,
      checkout_order,
      user_address,
      user_payment,
      shop_order_ids_new
    })


    if (newOrder) {
      //! TODO: Remove cart if checkout success
    }

    return newOrder
  }

  // Query orders
  static async getOrdersByUser({ userId }) {}

  static async getOrderById({ orderId }) {}

  // TODO: Update order by shop
  static async updateOrderByStatus({ orderId }) {}

  // ! Update order by shop
  static async updateOrderByAdmin({ orderId }) {}

  static async cancelOrderById({ orderId }) {}

}

module.exports = CheckoutService