"use strict";

const { redis, REDIS_KEYS } = require("../caches");

const self = {
  authorize: async (req, res, next) => {
    const account = req.headers["account"];
    if (!account) {
      res.send(401);
      return;
    }
    const key = REDIS_KEYS.API_USER_TOKEN(account);
    const token = await redis.get(key);
    if (!token) {
      res.send(401);
      return;
    }
    req.authorize = true;
    await next();
    return;
  }
};

module.exports = self;
