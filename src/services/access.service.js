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
const SALTY_ROUNDS = 10;


class AccessService {

  static async signUp({ name, email, password }) {
    try {
      // Step 1: Check email is existed
      const holderShop = await shopModel.findOne({ email }).lean() // lean mean return plain object
      console.log('holderShop::', holderShop)

      if (holderShop) {
        return {
          code: 'aaa',
          message: 'Shop already existed. Please register with another email',
        }
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
          return {
            code: 'aaa',
            message: 'keyStore:: Cannot create token pair',
          }
        }

        // Step 3.3: Create jwt token
        const tokenPayload = {
          userId: newShop._id,
          email: newShop.email,
        }
        const tokens = await createTokenPair(tokenPayload, publicKey, privateKey)

        return {
          code: 201,
          metadata: {
            shop: getObjectData({ fields: ['_id', 'name', 'email'], object: newShop }),
            tokens
          }
        }
      }

      return {
        code: 200,
        message: 'Cannot create new shop',
      }

    } catch (error) {
      return {
        code: 400,
        message: error.message,
        status: 'error'
      }
    }
  }

}

module.exports = AccessService;