const { Schema, model } = require('mongoose');

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

// ORDER-001: order successfully
// ORDER-002: order failed
// ORDER-003: order canceled
// ORDER-004: order delivered
// ORDER-005: order received
// ORDER-006: order returned
// PROMOTION-001: promotion created
// PROMOTION-002: promotion updated
// SHOP-001: shop created
const modelSchema = new Schema({
  noti_type: {
    type: String,
    enum: ['ORDER-001', 'ORDER-002', 'ORDER-003', 'ORDER-004', 'ORDER-005', 'ORDER-006', 'PROMOTION-001', 'PROMOTION-002', 'SHOP-001'],
    required: true
  },
  noti_senderId: { type: String, required: true },
  noti_receiverId: { type: String, required: true },
  noti_content: { type: String, required: true },
  noti_options: { type: Object, default: {} },
}, {
  // timestamps: true,
  collection: COLLECTION_NAME,
  timestamps: true
});

// Export the model
module.exports = model(DOCUMENT_NAME, modelSchema);
