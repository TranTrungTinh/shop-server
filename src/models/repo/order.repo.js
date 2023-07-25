const orderModel = require("../order.model")

const createNewOrder = async ({
  userId,
  checkout_order,
  user_address,
  user_payment,
  shop_order_ids_new
}) => {
  return await orderModel.create({
    order_user_id: userId,
    order_checkout: checkout_order,
    order_shipping: user_address,
    order_payment: user_payment,
    order_products: shop_order_ids_new
  })
}

module.exports = {
  createNewOrder
}