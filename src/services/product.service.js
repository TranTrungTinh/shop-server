
const { BadRequest } = require('../core/error.response');
const {
  product: productModel,
  clothing: clothingModel,
  electronic: electronicModel,
} = require('../models/product.model');

// TODO: Define product factory
class ProductFactory {
  /**
   * type: clothing | electronic
   * payload: product attributes
   * @param {*} param0
   * @returns
   */
  static async createProduct(type, payload) {
    switch (type) {
      case 'Clothings':
        return await new Clothing(payload).createProduct();
      case 'Electronics':
        return await new Electronic(payload).createProduct();
      default:
        throw new BadRequest(`Invalid Product Type:: ${type}`);
    }
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
    return await productModel.create({ ...this, _id: id });
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
}

module.exports = ProductFactory