'use strict'

const { CreatedResponse, OkResponse, UpdateResponse } = require("../core/success.response");
const commentService = require("../services/comment.service");

class CommentController {

  /**
 * @description Create a comment
 * @method POST /api/v1/comment
 * @param {JSON} product
 *
 */
  async addComment(req, res, next) {
    new CreatedResponse({
      message: 'Create a new comment',
      metadata: await commentService.addComment({
        ...req.body,
      })
    }).send(res)
  }

  async getComments(req, res, next) {
    new OkResponse({
      message: 'Get a list of comments',
      metadata: await commentService.getComments({
        ...req.query,
      })
    }).send(res)
  }

}

module.exports = new CommentController();