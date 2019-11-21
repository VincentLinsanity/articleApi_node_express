"use strict";

const express = require("express");
const router = express.Router();
const usersService = require("../services/users");

router.post("/login", async (req, res) => {
  const { account, password } = req.body;
  if (!account || !password) {
    res.status(422);
    res.send({ code: 422, message: "please provide correct data", data: [] });
    return;
  }
  let result = "";
  try {
    result = await usersService.userLogin({ account, password });
  } catch (error) {
    res.status(400);
    res.send({ code: 400, message: error.message, data: [] });
    return;
  }
  res.status = 201;
  res.send({ code: 201, message: "ok", data: result });
});

router.post("/register", async (req, res) => {
  const { account, name, password } = req.body;
  if (!account || !name || !password) {
    res.status(422);
    res.send({ code: 422, message: "please provide correct data", data: [] });
    return;
  }
  try {
    await usersService.userCreate({ account, name, password });
  } catch (error) {
    res.status(400);
    res.send({ code: 400, message: error.message, data: [] });
    return;
  }
  res.status = 201;
  res.send({ code: 201, message: "ok", data: [] });
});

module.exports = router;
