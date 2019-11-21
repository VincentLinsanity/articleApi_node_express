"use strict";

const express = require("express");
const router = express.Router();
const usersService = require("../services/users");

/**
 * @swagger
 * definitions:
 *   usersLogin:
 *     description: request successful
 *     properties:
 *       code:
 *         type: number
 *         example: "201"
 *       message:
 *         type: string
 *         example: "ok"
 *       data:
 *         type: string
 *         example: eyJhbGciOiJIUzI1N
 *         description: "user token"
 */
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - users
 *     summary: "users login api"
 *     description: "使用者登入"
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: account
 *         required: true
 *       - in: body
 *         name: password
 *         required: true
 *     responses:
 *       201:
 *         schema:
 *         type: object
 *         $ref: '#/definitions/usersLogin'
 */
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
  res.status(201);
  res.send({ code: 201, message: "ok", data: result });
});

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - users
 *     summary: "users register api"
 *     description: "使用者註冊"
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: account
 *         required: true
 *       - in: body
 *         name: password
 *         required: true
 *       - in: body
 *         name: name
 *         required: true
 *     responses:
 *       201:
 *         schema:
 *         type: object
 */
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
  res.status(201);
  res.send({ code: 201, message: "ok", data: [] });
});

module.exports = router;
