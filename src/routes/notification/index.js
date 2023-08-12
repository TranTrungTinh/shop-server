'use strict'

// TODO: External modules
const express = require('express');
const router = express.Router();

// TODO: Internal modules
const notificationController = require('../../controllers/notification.controller');
const forwardError = require('../../helpers/forwardError');
const { /*authentication*/ authenticationV2 } = require('../../middleware/auth');

router.use(authenticationV2)
router.get('', forwardError(notificationController.listNotifications));

module.exports = router;