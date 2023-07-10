
const { BadRequest } = require('../core/error.response');
const {
  product: productModel,
  clothing: clothingModel,
  electronic: electronicModel,
  furniture: furnitureModel,
} = require('../models/product.model');

// TODO: Define product factory
class ProductFactory {

  static productTypeRegistry = {}

  // TODO: Strategy pattern register product type
  static registerProductType(type, productClass) {
    this.productTypeRegistry[type] = productClass
  }

  /**
   * type: clothing | electronic
   * payload: product attributes
   * @param {*} param0
   * @returns
   */
  static async createProduct(type, payload) {
    const ProductClass = this.productTypeRegistry[type]
    if (!ProductClass) throw new BadRequest(`Invalid Product Type:: ${type}`);
    return await new ProductClass(payload).createProduct();
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