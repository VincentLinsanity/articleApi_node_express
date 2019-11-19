"use strict";

const express = require("express");
const router = express.Router();
const usersService = require("../services/users");

router.post("/login", async (req, res) => {
  const { account, password } = req.body;
  if (!account || !password) {
    res.send("please provide correct data");
    return;
  }
  try {
    const token = await usersService.userLogin({ account, password });
    res.send({ token });
  } catch (error) {
    res.send("Error");
    console.log(error);
    return;
  }
});

router.post("/register", async (req, res) => {
  const { account, name, password } = req.body;
  if (!account || !name || !password) {
    res.send("please provide correct data");
    return;
  }
  try {
    await usersService.userCreate({ account, name, password });
  } catch (error) {
    res.send("Error");
    console.log(error);
    return;
  }
  res.send("OK");
});

module.exports = router;
