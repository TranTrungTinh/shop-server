const { getSelectFields } = require("../../utils");
const commentModel = require("../comment.model");

const getAllComments = async ({ query, limit = 50, page = 1, select }) => {
  const skip = (page - 1) * limit

  return await commentModel.find(query)
    .skip(skip)
    .limit(limit)
    .select(getSelectFields(select))
    .sort({ comment_left: 1 })
    .lean()
    .exec();
}

const getCommentById = async (id) => {
  return await commentModel.findById(id).lean().exec();
}

module.exports = {
  getAllComments,
  getCommentById
}