const { Schema, model } = require('mongoose');
const slugify = require('slugify');

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
  product_name:{
    type: String,
    trim: true,
    required: true,
    maxLength: 255,
  },
  product_thumb: {
    type:String,
    trim: true,
    required:true,
  },
  product_slug: {
    type: String,
  },
  product_description:{
    type: String,
    trim: true,
  },
  product_price:{
    type: Number,
    required: true,
  },
  product_quantity: {
    type: Number,
    required: true,
  },
  product_type: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Furniture', 'Food', 'Drink', 'Other'],
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
  },
  product_attributes: {
    type: Schema.Types.Mixed,
    required: true,
  },
  // More attributes here
  product_ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10,
  },
  product_variations: {
    type: Array,
    default: [],
  },
  isDraft: {
    type: Boolean,
    default: true,
    select: false,
  },
  isPublish: {
    type: Boolean,
    default: false,
    select: false,
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME,
});

// TODO: Indexes
productSchema.index({ product_name: 'text', product_description: 'text' }, { unique: true });

// TODO: Hooks Middleware slugify
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
})

// TODO: Clothing Schema Attributes
const CLOTHES_DOCUMENT_NAME = 'Clothing';
const CLOTHES_COLLECTION_NAME = 'Clothes';

const clothesSchema = new Schema({
  size: {
    type: String,
  },
  material: {
    type: String,
  },
  color: {
    type: String,
  },
  brand: {
    type: String,
    required: true,
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
  },
}, {
  timestamps: true,
  collation: CLOTHES_COLLECTION_NAME
})

// TODO: Electronics Schema Attributes
const ELECTRONIC_DOCUMENT_NAME = 'Electronic';
const ELECTRONIC_COLLECTION_NAME = 'Electronics';

const electronicSchema = new Schema({
  model: {
    type: String,
  },
  color: {
    type: String,
  },
  manufactory: {
    type: String,
    required: true,
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
  },
}, {
  timestamps: true,
  collation: ELECTRONIC_COLLECTION_NAME
})

// TODO: Electronics Schema Attributes
const FURNITURE_DOCUMENT_NAME = 'Furniture';
const FURNITURE_COLLECTION_NAME = 'Furniture';

const furnitureSchema = new Schema({
  model: {
    type: String,
  },
  color: {
    type: String,
  },
  manufactory: {
    type: String,
    required: true,
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
  },
}, {
  timestamps: true,
  collation: FURNITURE_COLLECTION_NAME
})

// Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model(CLOTHES_DOCUMENT_NAME, clothesSchema),
  electronic: model(ELECTRONIC_DOCUMENT_NAME, electronicSchema),
  furniture: model(FURNITURE_DOCUMENT_NAME, furnitureSchema),
};
