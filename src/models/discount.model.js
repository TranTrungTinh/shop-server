const { Schema, model, Types } = require('mongoose');

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const modelSchema = new Schema({
  discount_name: { type: String, required: true },
  discount_description: { type: String, required: true },
  discount_type: { type: String, default: 'fixed_amount', enum: ['fixed_amount', 'percentage'] },
  discount_value: { type: Number, required: true },
  discount_max_value: { type: Number, required: true },
  discount_code: { type: String, required: true },
  discount_start_date: { type: Date, required: true },
  discount_end_date: { type: String, required: true },
  discount_max_uses: { type: Number, required: true },
  discount_uses_count: { type: Number, required: true },
  discount_users_used: { type: Array, default: [] },
  discount_max_uses_per_user: { type: Number, required: true },
  discount_min_order_value: { type: Number, required: true },
  discount_shop_id: { type: Schema.Types.ObjectId, ref: 'Shop' },
  // Meta
  discount_is_active: { type: Boolean, required: true },
  discount_applies_to: { type: String, required: true, enum: ['all', 'specific_products', 'specific_collections'] },
  discount_product_ids: { type: Array, default: [] },
}, {
  timestamps: true,
  collection: COLLECTION_NAME,
});

// Export the model
module.exports = model(DOCUMENT_NAME, modelSchema);
