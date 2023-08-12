'use strict'

const { CreatedResponse, OkResponse, UpdateResponse } = require("../core/success.response");
const notificationService = require("../services/notification.service");

class NotificationController {

  /**
 * @description Add to cart
 * @method POST /api/v1/cart
 * @param {JSON} product
 *
 */
  async listNotifications(req, res, next) {
    new OkResponse({
      message: 'Get list notify successfully',
      metadata: await notificationService.getNotifications({
        ...req.query,
      })
    }).send(res)
  }

}

module.exports = new NotificationController();