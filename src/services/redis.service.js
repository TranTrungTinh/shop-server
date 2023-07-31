'use strict'

// TODO Implement redis optimistic lock

const redis = require('redis')
const util = require("util");
const env  = require('../configs/environment.config');

const { reservationInventory } = require('../models/repo/inventory.repo');
const redisClient = redis.createClient({
  password: env.redis.password,
  socket: {
    host: env.redis.host,
    port: env.redis.port
  }
})

const pexpireAsync = util.promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = util.promisify(redisClient.setEx).bind(redisClient)
const deleteAsync = util.promisify(redisClient.del).bind(redisClient)

const acquireLock = async ({ productId, quantity, cartId }) => {
  const key = `lock:v2023:${productId}`
  const retryCount = 5
  const expireTime = 3000

  for (const time in retryCount) {
    const lockKey = await setnxAsync(key, expireTime)
    console.log('Result::', lock)

    //* If lock === 1 => lock success
    if (lockKey) {
      // TODO: Process checkout
      const isReservation = await reservationInventory({
        productId, cartId, quantity
      })

      if (!isReservation.modifiedCount) {
        await pexpireAsync(key, expireTime)
        return lockKey
      }

      return null
    }

    await new Promise((resolve) => setTimeout(resolve, 50))
  }
}

const releaseLock = async (lockKey) => {
  return await deleteAsync(lockKey)
}

module.exports = {
  acquireLock,
  releaseLock
}