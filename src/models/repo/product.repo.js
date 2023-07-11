const { Types } = require('mongoose');
const {
  product: productModel,
  clothing: clothingModel,
  electronic: electronicModel,
  furniture: furnitureModel,
} = require('../product.model');

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

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await productModel.findOne({
    id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop)
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
    id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop)
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



module.exports = {
  findAllDraftsForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unPublishProductByShop,
  getProductSearch
}