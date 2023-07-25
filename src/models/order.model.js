const { Schema, model, Types } = require('mongoose');

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const modelSchema = new Schema({
  order_user_id: { type: String, required: true },
  order_checkout: { type: Object, default: {} },
  /**
   * order_checkout: {
   *  totalPrice
   *  totalApplyDiscount
   *  feeShip
   * }
   */
  order_shipping: { type: Object, default: {} },
  /**
   * street
   * city
   * state
   * country
   *
   */
  order_payment: { type: Object, default: {} },
  order_products: { type: Array, required: true, default: [] },
  order_tracking_number: { type: String, default: '' },
  /**
   * order_tracking_number: #0001232131
   */
  order_status: { type: String, enum: ['pending', 'confirm', 'shipped', 'cancelled', 'delivered'], default: 'pending' },
}, {
  // timestamps: true,
  collection: COLLECTION_NAME,
  timestamps: {
    createdAt: 'createdOn',
    updatedAt: 'modifiedOn'
  }
});

// Export the model
module.exports = model(DOCUMENT_NAME, modelSchema);
