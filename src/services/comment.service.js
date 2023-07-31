'use strict'

const { NotFoundRequest } = require("../core/error.response")
const commentModel = require("../models/comment.model")
const { getAllComments, getCommentById } = require("../models/repo/comment.repo")
const { getProductById } = require("../models/repo/product.repo")
const { convertToObjectId } = require("../utils")

/**
 * features
 * add comment [User, Shop]
 * get a list of comments [User, Shop]
 * delete comment [User, Shop | Admin]
 */

class CommentService {

  static async addComment({
    productId, userId, content, parentId = null
  }) {

    // TODO: Create comment first
    const comment = await commentModel.create({
      comment_product_id: productId,
      comment_user_id: userId,
      comment_content: content,
      comment_parent_id: parentId
    })

    // ? Comment child
    let rightValue = 1

    if (parentId) {
      // TODO: Find parent comment
      const parentComment = await getCommentById(parentId)
      if (!parentComment) throw new NotFoundRequest('Parent comment not found')

      rightValue = parentComment.comment_right

      await Promise.race([
        // TODO: Update many comments left
        commentModel.updateMany({
          comment_product_id: convertToObjectId(productId),
          comment_right: { $gte: rightValue }
        }, {
          $inc: { comment_right: 2 }
        }),
        // TODO: Update many comments right
        commentModel.updateMany({
          comment_product_id: convertToObjectId(productId),
          comment_left: { $gt: rightValue }
        }, {
          $inc: { comment_left: 2 }
        })
      ])
    } else {

      // ? Comment root
      // TODO: Get max right value
      const maxRightValue = await commentModel.findOne({
        comment_product_id: convertToObjectId(productId)
      },
      'comment_right',
      {
        sort: { comment_right: -1 }
      }).lean()

      // TODO: Index comment left and right
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1
      }
    }
    // TODO: Insert comment left and right
    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1

    await comment.save()
    return comment
  }

  static async getComments({ productId, parentId = null, page, limit }) {

    if (parentId) {
      const parentComment = await getCommentById(parentId)
      if (!parentComment) throw new NotFoundRequest('Parent comment not found')

      return await getAllComments({
        query: {
          comment_product_id: convertToObjectId(productId),
          comment_left: { $gt: parentComment.comment_left },
          comment_right: { $lt: parentComment.comment_right },
        },
        limit,
        page,
        select: ['comment_content', 'comment_left', 'comment_right', 'comment_parent_id']
      })
    }

    return await getAllComments({
      query: {
        comment_product_id: convertToObjectId(productId),
      },
      limit,
      page,
      select: ['comment_content', 'comment_left', 'comment_right', 'comment_parent_id']
    })
  }

  //TODO: deleteComment by Admin
  static async deleteComment({ id, productId }) {

    const product = await getProductById({ product_id: productId })
    if (!product) throw new NotFoundRequest('Product not found')

    const comment = await getCommentById(id)
    if (!comment) throw new NotFoundRequest('Comment not found')

    //TODO: 1. Get left and right value of comment
    const leftValue = comment.comment_left
    const rightValue = comment.comment_right

    //TODO: 2. Determine the number of comments to be deleted
    const widthBox = rightValue - leftValue + 1

    await Promise.allSettled([
      //TODO: 3. Delete comment
      commentModel.deleteMany({
        comment_product_id: convertToObjectId(productId),
        comment_left: { $gte: leftValue, $lte: rightValue }
      }),

      //TODO: 4. Update comment left
      commentModel.updateMany({
        comment_product_id: convertToObjectId(productId),
        comment_left: { $gt: rightValue }
      }, {
        $inc: { comment_left: -widthBox }
      }),

      //TODO: 5. Update comment right
      commentModel.updateMany({
        comment_product_id: convertToObjectId(productId),
        comment_right: { $gt: rightValue }
      }, {
        $inc: { comment_right: -widthBox }
      })
    ])

  }
}

module.exports = CommentService