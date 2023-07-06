'use strict'
const JWT = require('jsonwebtoken');

const createTokenPair = (payload, publicKey, privateKey) => {

  // TODO: Create access token
  const accessToken = JWT.sign(payload, publicKey, {
    expiresIn: '2h',
  })

  // TODO: Create refresh token
  const refreshToken = JWT.sign(payload, privateKey, {
    expiresIn: '7 days',
  })

  // JWT.verify(accessToken, publicKey, (err, decoded) => {
  //   if (err) {
  //     console.log('error verify::', err)
  //   } else {
  //     console.log('decode::', decoded)
  //   }
  // })

  return {
    accessToken,
    refreshToken
  }
}

module.exports = {
  createTokenPair
}