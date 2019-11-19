"use strict";

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const basename = path.basename(module.filename);

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
