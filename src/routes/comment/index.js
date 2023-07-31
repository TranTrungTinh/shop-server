'use strict'

// TODO: External modules
const express = require('express');
const router = express.Router();

// TODO: Internal modules
const commentController = require('../../controllers/comment.controller');
const forwardError = require('../../helpers/forwardError');
const { /*authentication*/ authenticationV2 } = require('../../middleware/auth');

router.use(authenticationV2)
router.get('', forwardError(commentController.getComments));
router.post('', forwardError(commentController.addComment));

module.exports = router;