'use strict'

// TODO: External modules
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');

// TODO: Internal modules
const shopModel = require('../models/shop.model');
const { ShopRole } = require('../constants/shop.constants');
const KeyTokenService = require('./keytoken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getObjectData } = require('../utils');
const { NotFoundRequest, BadRequest } = require('../core/error.response');
const SALTY_ROUNDS = 10;


class AccessService {

  static async signUp({ name, email, password }) {
    // Step 1: Check email is existed
    const holderShop = await shopModel.findOne({ email }).lean() // lean mean return plain object
    console.log('holderShop::', holderShop)

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
      const publicKey = crypto.randomBytes(64).toString('hex');
      const privateKey = crypto.randomBytes(64).toString('hex');

      // Step 3.2: Save key token
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey
      })

      if (!keyStore) {
        throw new NotFoundRequest('Cannot create key token')
      }

      // Step 3.3: Create jwt token
      const tokenPayload = {
        userId: newShop._id,
        email: newShop.email,
      }
      const tokens = await createTokenPair(tokenPayload, publicKey, privateKey)

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

}

module.exports = AccessService;