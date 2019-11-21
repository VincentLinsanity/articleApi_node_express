"use strict";

const express = require("express");
const routes = require("./routes");
const bodyParser = require("body-parser");
const { mongo } = require("./models");
const { api } = require("./config");
const { port } = api;

mongo.setup();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
routes.setup(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`server listen on ${port}`);
});

module.exports = app;
