'use strict'

const accessService = require("../services/access.service");

class AccessController {

  // signup
  async signUp(req, res, next) {
    try {
      console.log('[P]::signUp::', req.body);
      /**
       * CREATED 201
       */
      return res.status(200).json(await accessService.signUp(req.body))
    } catch (error) {

    }
  }
}

module.exports = new AccessController();