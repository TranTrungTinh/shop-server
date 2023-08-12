
const { BadRequest } = require('../core/error.response');
const inventoryModel = require('../models/inventory.model');
const {
  product: productModel,
  clothing: clothingModel,
  electronic: electronicModel,
  furniture: furnitureModel,
} = require('../models/product.model');
const {
  findAllDraftsForShop,
  publishProductByShop,
  unPublishProductByShop,
  findAllPublishedForShop,
  getProductSearch,
  getAllProducts,
  getProductById,
  updateProductById
} = require('../models/repo/product.repo');
const { compactDeepObject } = require('../utils');
const NotificationService = require('./notification.service');

// TODO: Define product factory
class ProductFactory {

  static productTypeRegistry = {}

  // TODO: Strategy pattern register product type
  static registerProductType(type, productClass) {
    this.productTypeRegistry[type] = productClass
  }

  /**
   * @method POST
   * @param {string} type
   * @param {JSON} payload
   * @returns
   */
  static async createProduct(type, payload) {
    const ProductClass = this.productTypeRegistry[type]
    if (!ProductClass) throw new BadRequest(`Invalid Product Type:: ${type}`);
    return await new ProductClass(payload).createProduct();
  }

  /**
   * @method PATCH
   * @param {string} type
   * @param {JSON} payload
   * @returns
   */
  static async updateProduct(type, productId, payload) {
    const ProductClass = this.productTypeRegistry[type]
    if (!ProductClass) throw new BadRequest(`Invalid Product Type:: ${type}`);
    return await new ProductClass(payload).updateProduct(productId);
  }

  /**
   * @method GET
   * @param {string} product_shop
   * @param {Number} limit
   * @param {Number} skip
   */
  static async findAllDraftsForShop({ product_shop, limit = 60, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await findAllDraftsForShop({ query, limit, skip })
  }

  /**
   * @method GET
   * @param {string} product_shop
   * @param {Number} limit
   * @param {Number} skip
   */
  static async findAllPublishedForShop({ product_shop, limit = 60, skip = 0 }) {
    const query = { product_shop, isPublish: true }
    return await findAllPublishedForShop({ query, limit, skip })
  }

  /**
   * @method GET
   * @param {string} product_shop
   * @param {Number} limit
   * @param {Number} skip
   */
  static async getProductSearch({ keySearch }) {
    return await getProductSearch({ keySearch })
  }

  /**
   * @method GET
   * @param {Number} limit
   * @param {Number} page
   * @param {Number} sort
   * @param {Number} filter
   * @param {Array<String>} select
   */
  static async getAllProducts({ limit = 50, page = 1, sort = 'ctime', skip = 0, filter = {}, select = [] }) {
    return await getAllProducts({
      limit, page, sort, filter, select: ['product_name', 'product_thumb', 'product_price']
    })
  }

  /**
   * @method GET
   * @param {string} product_id
   * @param {Array<String>} unSelect
   */
  static async getProductById({ product_id }) {
    return await getProductById({
      product_id,
      unSelect: ['__v']
    })
  }

  /**
   * @method PUT
   * @param {string} product_shop
   * @param {Number} limit
   * @param {Number} skip
   */
  static async publishProductByShop({ product_shop, product_id }) {
    const query = { product_shop, product_id }
    return await publishProductByShop(query)
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    const query = { product_shop, product_id }
    return await unPublishProductByShop(query)
  }
}

// TODO: define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // TODO: Create new product
  async createProduct(id) {
    const newProduct = await productModel.create({ ...this, _id: id });
    if (newProduct) {

      // TODO: Create new inventory
      await inventoryModel.create({
        inventory_product: newProduct._id,
        inventory_shop: newProduct.product_shop,
        inventory_stock: newProduct.product_quantity
      })

      // TODO: Push notify new product to shop

      NotificationService.sendNotification({
        type: 'SHOP-001',
        receiverId: '1',
        senderId: newProduct.product_shop,
        options: {
          productName: newProduct.product_name,
          shopName: newProduct.product_shop
        }
      }).then(console.log).catch(console.log)
    }
  }

  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      productId,
      bodyUpdate,
      model: productModel,
      options: { new: true }
    })
  }
}

// TODO: Define sub-class clothing for each product type
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newClothing) throw new BadRequest('Cannot create new clothing');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequest('Cannot create new product');

    return newProduct;
  }
}

// TODO: Define sub-class electronic for each product type
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newElectronic) throw new BadRequest('Cannot create new electronic');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequest('Cannot create new product');

    return newProduct;
  }

  async updateProduct(productId) {
    // TODO: Step 1: Check bodyUpdate contain product_attributes
    const objectParams = this
    // TODO: Step 2: Drop attribute is nil

    if (objectParams.product_attributes) {
      const bodyChildUpdate = compactDeepObject(objectParams.product_attributes)
      // TODO: update children
      await updateProductById({
        productId,
        bodyUpdate: bodyChildUpdate,
        model: electronicModel,
        options: { new: true }
      })
    }

    // TODO: Update parent
    const bodyParentUpdate = compactDeepObject(objectParams)
    const updatedProduct = await super.updateProduct(productId, bodyParentUpdate)
    return updatedProduct
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newFurniture) throw new BadRequest('Cannot create new electronic');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequest('Cannot create new product');

    return newProduct;
  }
}

// TODO: Register product type
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronics', Electronic)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory