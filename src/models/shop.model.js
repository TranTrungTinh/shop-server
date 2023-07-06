const { Schema, model, Types } = require('mongoose');

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

const shopSchema = new Schema({
  name:{
    type: String,
    trim: true,
    maxLength: 255,
  },
  email: {
    type:String,
    trim: true,
    unique:true,
  },
  password:{
    type: String,
    required: true,
  },
  status:{
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },
  verify: {
    type: Schema.Types.Boolean,
    default: false,
  },
  roles: {
    type: Array,
    default: [],
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME,
});

// Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);
