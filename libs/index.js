"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config");
const crypto = require("crypto");
const keyLen = 64;
const algorithm = "sha512";
const iterations = 10000;

const self = {
  hashPassword: (password, salt) => {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        Buffer.from(password, "utf8"),
        salt,
        iterations,
        keyLen,
        algorithm,
        (err, hash) => {
          if (err) reject(err);
          resolve(hash.toString("hex"));
        }
      );
    });
  },

  verifyPassword: async (password, salt, storedPassword) => {
    const hashedPassword = await self.hashPassword(password, salt);
    return hashedPassword === storedPassword;
  },

  signJWT: (data = {}) => {
    const { secret = "default_secret" } = config;
    return jwt.sign(data, secret);
  },

  verifyJWT: (token = "") => {
    const { secret = "default_secret" } = config;
    try {
      jwt.verify(token, secret);
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }
};

module.exports = self;
