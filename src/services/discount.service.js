const { BadRequest, NotFoundRequest } = require("../core/error.response");
const discountModel = require('../models/discount.model');
const { getAllProducts } = require("../models/repo/product.repo");
const { getAllDiscountCodesWithUnSelect, checkDiscountCode } = require("../models/repo/discount.repo");
const { convertToObjectId, compactDeepObject, isDateBetween } = require("../utils");


class DiscountBuilder {
  constructor() {
    this.discount_name = null;
    this.discount_description = null;
    this.discount_type = null;
    this.discount_value = null;
    this.discount_max_value = null;
    this.discount_code = null;
    this.discount_start_date = null;
    this.discount_end_date = null;
    this.discount_max_uses = null;
    this.discount_uses_count = null;
    this.discount_users_used = [];
    this.discount_max_uses_per_user = null;
    this.discount_min_order_value = null;
    this.discount_shop_id = null;
    this.discount_is_active = null;
    this.discount_applies_to = null;
    this.discount_product_ids = [];
  }

  withName(discount_name) {
    this.discount_name = discount_name;
    return this;
  }

  withDescription(discount_description) {
    this.discount_description = discount_description;
    return this;
  }

  withType(discount_type) {
    this.discount_type = discount_type;
    return this;
  }

  withValue(discount_value) {
    this.discount_value = discount_value;
    return this;
  }

  withCode(discount_code) {
    this.discount_code = discount_code;
    return this;
  }

  withStartDate(discount_start_date) {
    this.discount_start_date = new Date(discount_start_date);
    return this;
  }

  withEndDate(discount_end_date) {
    this.discount_end_date = new Date(discount_end_date);
    return this;
  }

  withMaxUses(discount_max_uses) {
    this.discount_max_uses = discount_max_uses;
    return this;
  }

  withUsesCount(discount_uses_count) {
    this.discount_uses_count = discount_uses_count;
    return this;
  }

  withUsersUsed(discount_users_used) {
    this.discount_users_used = discount_users_used;
    return this;
  }

  withMaxUsesPerUser(discount_max_uses_per_user) {
    this.discount_max_uses_per_user = discount_max_uses_per_user;
    return this;
  }

  withMinOrderValue(discount_min_order_value = 0) {
    this.discount_min_order_value = discount_min_order_value || 0;
    return this;
  }

  withMaxValue(discount_max_value = 0) {
    this.discount_max_value = discount_max_value;
    return this;
  }

  withShop(discount_shop_id) {
    this.discount_shop_id = convertToObjectId(discount_shop_id);
    return this;
  }

  withIsActive(discount_is_active) {
    this.discount_is_active = discount_is_active;
    return this;
  }

  withAppliesTo(discount_applies_to) {
    this.discount_applies_to = discount_applies_to;
    return this;
  }

  withProductIds(discount_applies_to, discount_product_ids) {
    const product_ids = discount_applies_to === 'all' ? [] : discount_product_ids;
    this.discount_product_ids = product_ids;
    return this;
  }

  build() {
    if (
      !isDateBetween({
        startDate: this.discount_start_date,
        endDate: this.discount_end_date,
      })
    ) {
      throw new BadRequest('Discount code has expired')
    }

    if (new Date(this.discount_start_date) > new Date(this.discount_end_date)) {
      throw new BadRequest('Start date must before end date')
    }

    return new DiscountBuilder();
  }
}

class DiscountService {

  static async createDiscountCode(bodyData) {
    const {
      name, description, type, value,
      code, stateDate, endDate, isActive,
      maxUses, maxUsesPerUser, minOrderValue,
      shopId, appliesTo, productIds, maxValue, usesCount
    } = bodyData;

    const foundDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shop_id: convertToObjectId(shopId)
    }).lean()

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequest('Discount code already exists')
    }

    const newDiscount = new DiscountBuilder()

    newDiscount
      .withName(name)
      .withDescription(description)
      .withType(type)
      .withValue(value)
      .withMaxValue(maxValue)
      .withCode(code)
      .withStartDate(stateDate)
      .withEndDate(endDate)
      .withMaxUses(maxUses)
      .withUsesCount(usesCount)
      .withMaxUsesPerUser(maxUsesPerUser)
      .withMinOrderValue(minOrderValue)
      .withShop(shopId)
      .withIsActive(isActive)
      .withAppliesTo(appliesTo)
      .withProductIds(appliesTo, productIds)
      .build();

    return discountModel.create(newDiscount);
  }

  static async updateDiscountCode(id, bodyData) {
    const {
      name, description, type, value,
      code, stateDate, endDate, isActive,
      maxUses, maxUsesPerUser, minOrderValue,
      shopId, appliesTo, productIds, maxValue, usesCount
    } = bodyData;

    const foundDiscount = await discountModel.findById(convertToObjectId(id))

    if (!foundDiscount) {
      throw new BadRequest('Discount not found')
    }

    const newDiscount = new DiscountBuilder()
    newDiscount
      .withName(name)
      .withDescription(description)
      .withType(type)
      .withValue(value)
      .withMaxValue(maxValue)
      .withCode(code)
      .withStartDate(stateDate)
      .withEndDate(endDate)
      .withMaxUses(maxUses)
      .withUsesCount(usesCount)
      .withMaxUsesPerUser(maxUsesPerUser)
      .withMinOrderValue(minOrderValue)
      .withShop(shopId)
      .withIsActive(isActive)
      .withAppliesTo(appliesTo)
      .withProductIds(appliesTo, productIds)
      .build();

    // TODO: Drop all fields that are null
    const updateDiscount = compactDeepObject(newDiscount);

    return foundDiscount.updateOne(updateDiscount);
  }

  /**
   * @description Get all discount codes available with products
   * @param {string} code
   * @param {string} shopId
   * @param {number} limit
   * @param {number} page
   *
   */

  static async getDiscountCodesWithProduct({
    code, shopId, limit = 50, page = 1
  }) {

    const foundDiscount = await checkDiscountCode({
      filter: {
        discount_code: code,
        discount_shop_id: convertToObjectId(shopId),
      }
    })

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequest('Discount not found')
    }

    const { discount_product_ids, discount_applies_to } = foundDiscount;
    let products = [];

    if (discount_applies_to === 'all') {
      // TODO: Get all products
      products = await getAllProducts({
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublish: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name', 'product_price', 'product_quantity'],
      })
    }

    if (discount_applies_to === 'specific_products') {
      // TODO: Get specific products
      products = await getAllProducts({
        filter: {
          id: { $in: discount_product_ids },
          isPublish: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name', 'product_price', 'product_quantity'],
      })
    }

    return products;
  }

  /**
   * @description Get all discount codes available for a shop
   * @param {string} code
   * @param {string} shopId
   * @param {number} limit
   * @param {number} page
   *
   */

  static async getDiscountCodesByShop({
    shopId, limit = 50, page = 1
  }) {

    const discountCodes = await getAllDiscountCodesWithUnSelect({
      filter: {
        discount_shop_id: convertToObjectId(shopId),
        discount_is_active: true
      },
      limit: +limit,
      page: +page,
      unSelect: ['__v', 'discount_shop_id', 'discount_is_active', 'discount_product_ids'],
    })

    return discountCodes;

  }


  /**
   * @description Get discount amount
   * @param {string} code
   * @param {string} shopId
   * @param {number} userId
   * @param {array} products
   * products = [
   *  {
   *   product_id: 'id',
   *   product_quantity: 1,
   *   product_price: 1000
   *  }
   * ]
   */

  static async getDiscountAmount({
    shopId, code, userId, products
  }) {

    const foundDiscount = await checkDiscountCode({
      filter: {
        discount_code: code,
        discount_shop_id: convertToObjectId(shopId),
      }
    })

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequest('Discount not found')
    }

    const {
      discount_max_uses,
      discount_min_order_value,
      discount_max_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_start_date,
      discount_end_date,
      discount_value,
      discount_type
    } = foundDiscount;

    // TODO: Check if discount code has been used up
    if (discount_max_uses === 0) {
      throw new BadRequest('Discount code has been used up')
    }

    if (
      !isDateBetween({
        startDate: discount_start_date,
        endDate: discount_end_date,
      })
    ) {
      throw BadRequest('Discount code has expired')
    }

    // TODO: Sum up all products price
    let total = 0
    if (discount_min_order_value > 0) {
      total = products.reduce((acc, product) => {
        return acc + (product.product_price * product.product_quantity)
      }, 0)

      if (total < discount_min_order_value) {
        throw new BadRequest('Discount code is not valid for this order')
      }
    }

    // TODO: Check if user has already used up discount code
    if (discount_max_uses_per_user > 0) {
      const userUsedDiscountCount = discount_users_used.filter(user => user.user_id === userId).length

      if (userUsedDiscountCount > 0 && userUsedDiscountCount > discount_max_uses_per_user) {
        throw new BadRequest('User has used up discount code')
      }
    }
    // console.log('total', total)

    // TODO: Get discount amount
    let discountAmount = 0
    if (discount_type === 'percentage') {
      const assumeDiscount = (discount_value / 100) * total
      discountAmount = assumeDiscount > discount_max_value ? discount_max_value : assumeDiscount
      // console.log('assumeDiscount', assumeDiscount)
      // console.log('discountAmount', discountAmount)
    } else {
      discountAmount = total > discount_max_value ? discount_max_value : total
      // console.log('discountAmount', discountAmount)

    }

    return {
      amount: discountAmount,
      totalOrder: total,
      totalPrice: total - discountAmount
    }
  }

  /**
   * @description Delete discount code
   * @param {string} shopId
   * @param {string} code
   * @returns deleted discount
   */
  static async deleteDiscountCode({ shopId, code }) {
    // TODO: Tips
    // TODO: Check if discount code has been used in another order
    // TODO: Create a new Schema discount history and add the deleted discount code to it

    const foundDiscount = await discountModel.findOneAndDelete({
      discount_shop_id: convertToObjectId(shopId),
      discount_code: code
    })

    return foundDiscount
  }

  /**
   * @description User cancel discount code
   * @param {string} shopId
   * @param {string} code
   * @returns cancel discount
   */

  static async cancelDiscountByUser({ shopId, code, userId }) {
    const foundDiscount = await checkDiscountCode({
      filter: {
        discount_code: code,
        discount_shop_id: convertToObjectId(shopId),
      }
    })

    if (!foundDiscount) {
      throw new BadRequest('Discount not found')
    }

    // TODO: Undo discount code uses and users used

    const updateDiscount = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      // TODO: Undo maxUse +1 and usesCount -1
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      },
      // TODO: Remove userId from discount_users_used
      $pull: {
        discount_users_used: userId
      }
    })

    return updateDiscount
  }
}

module.exports = DiscountService;