'use strict'

// TODO: External modules
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');

// TODO: Internal modules
const shopModel = require('../models/shop.model');
const { ShopRole } = require('../constants/shop.constants');
const KeyTokenService = require('./keytoken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getObjectData, getRandomString } = require('../utils');
const { NotFoundRequest, BadRequest, UnauthorizedRequest, ForbiddenRequest } = require('../core/error.response');
const ShopService = require('./shop.service');
const SALTY_ROUNDS = 10;


class AccessService {

  static async login({ email, password, refreshToken = null }) {
    // TODO: Step 1: Check email is existed
    const foundShop = await ShopService.findByEmail({ email })
    if (!foundShop) {
      throw new NotFoundRequest('Shop is not registered')
    }

    // TODO: Step 2: Check password
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new UnauthorizedRequest('Authentication failed')
    }

    // TODO: Step 3: Create accessToken and refreshToken
    const privateKey = getRandomString(64)
    const publicKey = getRandomString(64)

    const tokenPayload = {
      userId: foundShop._id,
      email: foundShop.email,
    }
    const tokens = await createTokenPair(tokenPayload, publicKey, privateKey)

    // TODO: Step 4: Save key token
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })

    return {
      shop: getObjectData({ fields: ['_id', 'name', 'email'], object: foundShop }),
      tokens
    }

  }

  static async signUp({ name, email, password }) {
    // Step 1: Check email is existed
    const holderShop = await ShopService.findByEmail({ email }) // lean mean return plain object

    if (holderShop) {
      throw new BadRequest('Email is existed')
    }

    // Step 2: Create new shop
    const passwordHash = await bcrypt.hash(password, SALTY_ROUNDS);
    const newShop = await shopModel.create({
      name, email, password: passwordHash, roles: [ShopRole.SHOP]
    })

    // Step 3: Maybe grant token for new shop
    if (newShop) {
      // Step 3.1: Random token
      const publicKey = getRandomString(64);
      const privateKey = getRandomString(64);

      // Step 3.2: Create jwt token
      const tokenPayload = {
        userId: newShop._id,
        email: newShop.email,
      }
      const tokens = await createTokenPair(tokenPayload, publicKey, privateKey)

      // Step 3.3: Save key token
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken
      })

      if (!keyStore) {
        throw new NotFoundRequest('Cannot create key token')
      }

      return {
        code: 201,
        shop: getObjectData({ fields: ['_id', 'name', 'email'], object: newShop }),
        tokens
      }
    }

    return {
      code: 200,
      shop: null,
      message: 'Cannot create new shop',
    }
  }

  static async logout(keyStore) {
    await KeyTokenService.removeKeyByID(keyStore._id)
    return true
  }

  static async refreshToken({ refreshToken }) {
    // TODO: check token is used
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)

    // TODO: Token maybe use by hacker
    if (foundToken) {
      const { userId } = verifyJWT(refreshToken, foundToken.privateKey)

      // TODO: Delete all token in keyStore
      await KeyTokenService.removeKeyByUserId(userId)

      throw new ForbiddenRequest('Something went wrong! Please login again')
    }

    // TODO: Check token is valid
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)

    if (!holderToken) {
      throw new UnauthorizedRequest('Invalid token')
    }

    const { userId, email } = verifyJWT(refreshToken, holderToken.privateKey)
    const foundShop = await ShopService.findByEmail({ email })

    if (!foundShop) {
      throw new UnauthorizedRequest('Shop is not registered')
    }

    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

    // TODO: Update new refreshToken and refreshTokenUsed
    // TODO Atomistic update
    await KeyTokenService.findByIdAndModify(holderToken._id, { newRefreshToken: tokens.refreshToken, oldRefreshToken: refreshToken})

    return {
      shop: { userId, email },
      tokens
    }
  }

}

module.exports = AccessService;