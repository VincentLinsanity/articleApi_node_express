"use strict";

const { redis, REDIS_KEYS } = require("../caches");
const libs = require("../libs");

const self = {
  authorize: async (req, res, next) => {
    const account = req.headers["account"];
    const token = req.headers["token"];
    if (!account || !token) {
      res.sendStatus(401);
      return;
    }
    const key = REDIS_KEYS.API_USER_TOKEN(account);
    const tokenInCache = await redis.get(key);
    if (!tokenInCache || tokenInCache !== token) {
      res.sendStatus(401);
      return;
    }
    const user = libs.decodeToken(token);
    Object.assign(req, {
      user,
      authorize: true
    });
    await next();
    return;
  }
};

module.exports = self;
