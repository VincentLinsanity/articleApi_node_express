"use strict";

const path = require("path");
const pathBase = path.resolve(__dirname, "..");
const config = {
  env: process.env.ENV || "development",
  log: {
    dir: path.resolve(pathBase, "log")
  }
};

let overrides = {};
if (config.env === "development") {
  overrides = require("./config.json");
} else {
  overrides = require(`./config_${config.env}.json`);
}

Object.assign(config, overrides);

if (config.env !== "development") {
  config.mongo = {
    setting: {
      hosts: process.env.MONGO_HOSTS || "127.0.0.1:27017",
      user: process.env.MONGO_USER || "",
      pass: process.env.MONGO_PASS || "",
      database: process.env.MONGO_DATABASE || "basic",
      replicaSet: process.env.MONGO_REPLICA || ""
    }
  };
}

module.exports = config;
