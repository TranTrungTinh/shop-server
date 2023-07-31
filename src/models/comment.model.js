const { Schema, model, Types } = require('mongoose');

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

const modelSchema = new Schema({
  comment_product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
  comment_user_id: { type: Number },
  comment_content: { type: String },
  comment_left: { type: Number, default: 0 },
  comment_right: { type: Number, default: 0 },
  comment_parent_id: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
  is_deleted: { type: Boolean, default: false },
}, {
  // timestamps: true,
  collection: COLLECTION_NAME,
  timestamps: true
});

// Export the model
module.exports = model(DOCUMENT_NAME, modelSchema);
