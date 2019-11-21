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
      hosts: process.env.MONGO_SETTING_HOSTS || config.mongo.setting.hosts,
      user: process.env.MONGO_SETTING_USER || "",
      pass: process.env.MONGO_SETTING_PASS || "",
      database:
        process.env.MONGO_SETTING_DATABASE || config.mongo.setting.database,
      replicaSet: process.env.MONGO_SETTING_REPLICA || ""
    }
  };

  config.redis = {
    setting: {
      cluster:
        process.env.REDIS_SETTING_CLUSTER || config.redis.setting.cluster,
      hosts: process.env.REDIS_SETTING_HOSTS || config.redis.setting.hosts,
      tls: process.env.REDIS_SETTING_TLS || config.redis.setting.tls,
      password:
        process.env.REDIS_SETTING_PASSWORD || config.redis.setting.password
    }
  };
}

module.exports = config;
