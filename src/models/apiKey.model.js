const { Schema, model, Types } = require('mongoose');

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';

const apiKeySchema = new Schema({
  key:{
    type: String,
    trim: true,
    required: true,
    unique: true,
  }, // generate key
  status:{
    type: Boolean,
    default: true,
  },
  permissions: {
    type: [String],
    enum: ['0000', '1111', '2222'], // mean read, write, delete
    required: true,
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME,
});

// Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);
