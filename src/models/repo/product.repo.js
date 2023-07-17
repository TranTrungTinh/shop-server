const { Types } = require('mongoose');
const {
  product: productModel, product,
  // clothing: clothingModel,
  // electronic: electronicModel,
  // furniture: furnitureModel,
} = require('../product.model');
const { getSelectFields, getUnSelectFields, convertToObjectId } = require('../../utils');

// TODO: Query
const queryProducts = async ({ query, limit, skip }) => {
  return await productModel.find(query)
    .populate('product_shop', 'name email -_id')
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip })
}

const findAllPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip })
}

const getProductSearch = async ({ keySearch, limit, skip }) => {
  const searchRegex = new RegExp(keySearch, 'i')
  const results = await productModel.find({
    isPublish: true,
    $text: {
      $search: searchRegex
    }
  }, {
    score: {
      $meta: 'textScore'
    }
  })
  .sort({
    score: {
      $meta: 'textScore'
    }
  })
  .populate('product_shop', 'name email -_id')
  .skip(skip)
  .limit(limit)
  .lean()
  .exec();

  return results
}

const getAllProducts = async ({ limit, page, sort, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

  const results = await productModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectFields(select))
    .lean()
    .exec();

  return results
}

const getProductById = async ({ product_id, unSelect }) => {
  return await productModel
    .findById(product_id)
    .select(getUnSelectFields(unSelect))
    .populate('product_shop', 'name email -_id')
    .lean()
    .exec();
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await productModel.findOne({
    _id: convertToObjectId(product_id),
    product_shop: convertToObjectId(product_shop)
  })

  if (!foundProduct) return null

  const { modifiedCount } = await foundProduct.updateOne({
    $set: {
      isDraft: false,
      isPublish: true
    }
  })

  return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await productModel.findOne({
    _id: convertToObjectId(product_id),
    product_shop: convertToObjectId(product_shop)
  })

  if (!foundProduct) return null

  const { modifiedCount } = await foundProduct.updateOne({
    $set: {
      isDraft: true,
      isPublish: false
    }
  })

  return modifiedCount
}

// TODO: Update
const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  option = { new: true }
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, option)
}

const checkProductAfterCheckout = async (products = []) => {
  return await Promise.all(products.map(async (product) => {
    const foundProduct = await getProductById({ product_id: product.productId })
    if (foundProduct) {
      return {
        product_price: foundProduct.product_price,
        product_quantity: product.quantity,
        productId: product.productId,
      }
    }
  }))
}


module.exports = {
  findAllDraftsForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unPublishProductByShop,
  getProductSearch,
  getAllProducts,
  getProductById,
  updateProductById,
  checkProductAfterCheckout
}