const { Schema, model, Types } = require('mongoose');

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const modelSchema = new Schema({
  cart_state: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  },
  cart_products: { type: Array, required: true, default: [] },
  cart_count_products: { type: Number, default: 0 },
  cart_user_id: { type: String },
  /**
   * cart_products: []
   *  productId
   *  shopId
   *  quantity
   *  name
   *  price
   */
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
