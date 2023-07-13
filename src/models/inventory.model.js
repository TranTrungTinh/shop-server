const { Schema, model, Types } = require('mongoose');

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const modelSchema = new Schema({
  inventory_product: { type: Schema.Types.ObjectId, ref: 'Product' },
  inventory_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  inventory_stock: { type: Number, required: true },
  inventory_location: { type: String, default: 'unKnow' },
  inventory_reservations: { type: Array, default: [] },
  /**
   * cartId
   * quantity
   * createdAt
   */
}, {
  timestamps: true,
  collection: COLLECTION_NAME,
});

// Export the model
module.exports = model(DOCUMENT_NAME, modelSchema);
