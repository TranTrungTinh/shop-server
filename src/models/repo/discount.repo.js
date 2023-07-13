const discountModel = require('../discount.model');
const { getSelectFields, getUnSelectFields } = require('../../utils');

const getAllDiscountCodesWithUnSelect = async ({
  limit, page, sort, filter, unSelect
}) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

  const results = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectFields(unSelect))
    .lean()
    .exec();

  return results
}

const getAllDiscountCodesWithSelect = async ({
  limit, page, sort, filter, select
}) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

  const results = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectFields(select))
    .lean()
    .exec();

  return results
}

const checkDiscountCode = async ({ filter }) => {
  return await discountModel.findOne(filter).lean().exec();
}

module.exports = {
  getAllDiscountCodesWithUnSelect,
  getAllDiscountCodesWithSelect,
  checkDiscountCode
}