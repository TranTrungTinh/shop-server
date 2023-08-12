const notificationModel = require("../models/notification.model")

class NotificationService {

  static async sendNotification({
    type = 'ORDER-001',
    receiverId = 1,
    senderId = 1,
    options = {}
  }) {
    let notifyContent = ''

    if (type === 'SHOP-001') {
      notifyContent = '@@@ vừa mới thêm 1 sản phẩm mới: @@@@'
    } else if (type === 'PROMOTION-001') {
      notifyContent = '@@@ vừa mới thêm 1 chương trình khuyến mãi mới: @@@@'
    }

    return await notifyContent.create({
      noti_type: type,
      noti_senderId: senderId,
      noti_receiverId: receiverId,
      noti_content: notifyContent,
      noti_options: options
    }).lean()
  }

  static async getNotificationByUserId(userId) {}
  static async getNotificationByShopId(shopId) {}

  static async getNotifications({
    userId = 1,
    type = 'ALL',
    isRead = 0,
    limit = 50,
    page = 1
  }) {

    const match = {
      noti_receiverId: userId
    }

    if (type !== 'ALL') {
      match.noti_type = type
    }

    return await notificationModel.aggregate([
      {
        $match: match
      },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          noti_receiverId: 1,
          noti_content: 1,
          noti_options: 1,
          // noti_isRead: 1,
          noti_createdAt: 1,
          // noti_updatedAt: 1
        },
        $limit: limit,
        $skip: (page - 1) * limit
      }
    ])
  }

}

module.exports = NotificationService;