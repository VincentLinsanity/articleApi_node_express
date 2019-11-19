"use strict";

const fs = require("fs");
const path = require("path");
const basename = path.basename(module.filename);

const routes = {
  setup: app => {
    // handle index api, use root path /api
    fs.readdirSync(__dirname)
      .filter(file => {
        return file.slice(-3) === ".js" && file !== basename;
      })
      .map(file => {
        const router = require(path.join(__dirname, file));
        const name = file.split(".")[0];
        app.use(`/api/${name}`, router);
      });
  }
};

module.exports = routes;
