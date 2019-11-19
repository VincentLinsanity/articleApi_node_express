"use strict";

const crypto = require("crypto");
const { mongo } = require("../models");
const libs = require("../libs");

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
    const { salt, password: storedPassword, name } = user;
    const verify = await libs.verifyPassword(password, salt, storedPassword);
    if (!verify) throw "account or password incorrect";
    const token = libs.signJWT({ account, name });
    return token;
  }
};

module.exports = self;
