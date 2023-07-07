'use strict'

const accessService = require("../services/access.service");

class AccessController {

  // TODO: API signup
  async signUp(req, res, next) {
    return res.status(200).json(
      await accessService.signUp(req.body)
    )
  }
}

module.exports = new AccessController();