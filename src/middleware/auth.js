'use strict'
const JWT = require('jsonwebtoken');
const { HEADERS } = require("../constants/header.config");
const KeyTokenService = require('../services/keytoken.service');
const { NotFoundRequest, UnauthorizedRequest } = require('../core/error.response');
const forwardError = require('../helpers/forwardError');

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

// ! Old version
const authentication = forwardError(async (req, res, next) => {
  /**
   * 1. Check userId is existed
   * 2. get Access Token from header
   * 3. Verify Access Token
   * 4. Check Access Token is existed in DB
   * 5. check Access Token in keys Store
   */

  // TODO: Step 1: Check userId and accessToken is existed
  const userId = req.headers[HEADERS.CLIENT_ID]
  const accessToken = req.headers[HEADERS.AUTHORIZATION]

  if (!userId || !accessToken) {
    throw new UnauthorizedRequest('Invalid Request')
  }

  // TODO: Step 2: Found key token
  const keyStore = await KeyTokenService.findKeyTokenByUserID(userId)
  console.log('keyStore::', keyStore)
  if (!keyStore) {
    throw new NotFoundRequest('Not found key token')
  }

  // TODO: Step 3: Verify Access Token
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)

    if (decodeUser.userId !== userId) {
      throw new UnauthorizedRequest('Invalid Request')
    }

    req.keyStore = keyStore
    req.user = decodeUser // payload = { userId, email }
    return next()
  } catch (error) {
    console.log('error', error)
    throw error
  }
})

// * New version
const authenticationV2 = forwardError(async (req, res, next) => {
  /**
   * 1. Check userId is existed
   * 2. get Access Token from header
   * 3. Verify Access Token
   * 4. Check Access Token is existed in DB
   * 5. check Access Token in keys Store
   */

  // TODO: Step 1: Check userId and accessToken is existed
  const userId = req.headers[HEADERS.CLIENT_ID]
  const accessToken = req.headers[HEADERS.AUTHORIZATION]
  const refreshToken = req.headers[HEADERS.REFRESH_TOKEN]

  if (!userId || !accessToken) {
    throw new UnauthorizedRequest('Invalid Request')
  }

  // TODO: Step 2: Found key token
  const keyStore = await KeyTokenService.findKeyTokenByUserID(userId)
  console.log('keyStore::', keyStore)
  if (!keyStore) {
    throw new NotFoundRequest('Not found key token')
  }

  //* In case refresh token
  if (refreshToken) {
    // TODO: Step 3.1: Verify Refresh Token
    const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)

    if (decodeUser.userId !== userId) {
      throw new UnauthorizedRequest('Invalid Request')
    }

    // TODO: Step 4: Attach keyStore, user, refreshToken to req
    req.keyStore = keyStore
    req.user = decodeUser // payload = { userId, email }
    req.refreshToken = refreshToken

    return next()
  }

  //* In case access token
  // TODO: Step 3.2: Verify Access Token
  const decodeUser = JWT.verify(accessToken, keyStore.publicKey)

  if (decodeUser.userId !== userId) {
    throw new UnauthorizedRequest('Invalid Request')
  }

  // TODO: Step 4: Attach keyStore, user to req
  req.keyStore = keyStore
  req.user = decodeUser // payload = { userId, email }
  return next()
})

const verifyJWT = (token, keySecret) => {
  return JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  authentication,
  authenticationV2,
  verifyJWT
}