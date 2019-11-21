"use strict";

const crypto = require("crypto");
const { mongo } = require("../models");
const libs = require("../libs");
const { redis, REDIS_KEYS } = require("../caches");

const self = {
  userCreate: async data => {
    const { account, name, password } = data;
    const salt = crypto.randomBytes(128).toString("base64");
    const hashedPassword = await libs.hashPassword(password, salt);
    const user = {
      account,
      name,
      password: hashedPassword,
      salt
    };
    await mongo.models.user.create(user);
    return true;
  },

  userLogin: async data => {
    const { account, password } = data;
    const user = await mongo.models.user.findOne({ account });
    if (!user || user.length < 1) throw "user not found";
    const { salt, password: storedPassword, name, _id } = user;
    const verify = await libs.verifyPassword(password, salt, storedPassword);
    if (!verify) throw "account or password incorrect";
    const token = libs.signJWT({ account, name, id: _id });
    const key = REDIS_KEYS.API_USER_TOKEN(account);
    await redis.set(key, token);
    await redis.expire(key, 86400);
    return token;
  }
};

module.exports = self;
