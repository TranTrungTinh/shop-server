'use strict'

const { CreatedResponse, OkResponse } = require("../core/success.response");
const accessService = require("../services/access.service");

class AccessController {

  // TODO: API login
  async login(req, res, next) {
    new OkResponse({
      message: 'Login successfully',
      metadata: await accessService.login(req.body)
    }).send(res)
  }

  // TODO: API signup
  async signUp(req, res, next) {
    new CreatedResponse({
      message: 'Registered successfully',
      metadata: await accessService.signUp(req.body)
    }).send(res)
  }

  // TODO: API logout
  async logout(req, res, next) {
    new OkResponse({
      message: 'Logout successfully',
      metadata: await accessService.logout(req.keyStore) // keyStore is from middleware authentication
    }).send(res)
  }

  // TODO: API refresh token
  async refreshToken(req, res, next) {
    // new OkResponse({
    //   message: 'Refresh token successfully',
    //   metadata: await accessService.refreshToken(req.body)
    // }).send(res)

    // TODO: v2 optimize
    new OkResponse({
      message: 'Refresh token successfully',
      metadata: await accessService.refreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      }) // middleware authenticationV2
    }).send(res)
  }
}

module.exports = new AccessController();