'use strict'

const { CreatedResponse } = require("../core/success.response");
const accessService = require("../services/access.service");

class AccessController {

  // TODO: API signup
  async signUp(req, res, next) {
    new CreatedResponse({
      message: 'Registered successfully',
      metadata: await accessService.signUp(req.body)
    }).send(res)
  }
}

module.exports = new AccessController();