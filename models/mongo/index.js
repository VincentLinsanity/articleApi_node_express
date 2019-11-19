"use strict";

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const basename = path.basename(module.filename);
const models = {};

const getUri = setting => {
  const { hosts, database } = setting;
  let uri = "";
  const host = hosts.split(",");
  if (host.length > 1) {
    uri = `mongodb://${host[0]}`;
    for (let i = 1; i < host.length; i++) {
      uri += `,${host[i]}`;
    }
  } else {
    uri = `mongodb://${host[0]}`;
  }
  uri += `/${database}`;
  return uri;
};

const getOptions = setting => {
  const { user, pass } = setting;
  const options = {
    autoReconnect: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  };
  if (user !== "" && pass !== "") {
    Object.assign(options, { user, pass });
  }
  return options;
};

const setup = () => {
  return new Promise((resolve, reject) => {
    const config = require("../../config");
    const { setting } = config.mongo;
    const uri = getUri(setting);
    const options = getOptions(setting);
    const connections = mongoose.connection;
    mongoose.connect(uri, options);
    connections.once("open", () => {
      fs.readdirSync(__dirname)
        .filter(
          file =>
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
        )
        .forEach(file => {
          const model = require(path.join(__dirname, file))(models);
          models[model.name] = connections.model(
            model.name,
            model.schema,
            model.name
          );
        });
      resolve(models);
    });

    connections.on("error", error => {
      reject(error);
    });
  });
};

module.exports = { setup, models };
