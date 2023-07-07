const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey }) {
    const tokens = await keyTokenModel.create({
      user: userId,
      publicKey,
      privateKey
    })

    return tokens ? tokens.publicKey : null
  }
}

module.exports = KeyTokenService;