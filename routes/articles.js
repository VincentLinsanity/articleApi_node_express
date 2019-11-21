"use strict";

const express = require("express");
const router = express.Router();
const middleware = require("../middlewares");
const articleService = require("../services/articles");

/**
 * @swagger
 * definitions:
 *   articlesCreate:
 *     description: request successful
 *     properties:
 *       code:
 *         type: number
 *         example: "201"
 *       message:
 *         type: string
 *         example: "ok"
 */
/**
 * @swagger
 * /api/articles:
 *   post:
 *     tags:
 *       - articles
 *     summary: "articles create api"
 *     description: "建立文章"
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: account
 *         required: true
 *       - in: header
 *         name: token
 *         required: true
 *       - in: body
 *         name: subject
 *         required: true
 *       - in: body
 *         name: content
 *         required: true
 *     responses:
 *       201:
 *         schema:
 *         type: object
 *         $ref: '#/definitions/articlesCreate'
 */
router.post("/", middleware.authorize, async (req, res) => {
  const { subject = "", content = "" } = req.body;
  if (subject === "" || content === "") {
    res.status(422);
    res.send({
      code: 422,
      message: "incorrect body data"
    });
    return;
  }
  const data = {
    user_id: req.user.id,
    subject,
    content
  };
  try {
    await articleService.articleCreate(data);
  } catch (error) {
    res.send({
      code: 400,
      message: error.message
    });
    return;
  }
  res.send({
    code: 201,
    message: "ok"
  });
});

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     tags:
 *       - articles
 *     summary: "articles update api"
 *     description: "更新文章"
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: account
 *         required: true
 *       - in: header
 *         name: token
 *         required: true
 *       - in: body
 *         name: subject
 *         required: false
 *       - in: body
 *         name: content
 *         required: false
 *     responses:
 *       201:
 *         schema:
 *         type: object
 */
router.put("/:id", middleware.authorize, async (req, res) => {
  const { id } = req.params;
  const { subject = "", content = "" } = req.body;
  const data = {};
  if (subject !== "") Object.assign(data, { subject });
  if (content !== "") Object.assign(data, { content });
  try {
    await articleService.articlePut(id, req.user.id, data);
  } catch (error) {
    res.send({
      code: 400,
      message: error.message,
      data: []
    });
    return;
  }
  res.status(201);
  res.send({ code: 201, message: "ok", data: [] });
});

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     tags:
 *       - articles
 *     summary: "articles deleted api"
 *     description: "刪除文章"
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: account
 *         required: true
 *       - in: header
 *         name: token
 *         required: true
 *     responses:
 *       201:
 *         schema:
 *         type: object
 */
router.delete("/:id", middleware.authorize, async (req, res) => {
  const { id } = req.params;
  try {
    await articleService.articleDelete(id, req.user.id);
  } catch (error) {
    res.send({
      code: 400,
      message: error.message,
      data: []
    });
    return;
  }
  res.status(201);
  res.send({ code: 201, message: "ok", data: [] });
});

/**
 * @swagger
 * definitions:
 *   articlesGet:
 *     description: request successful
 *     properties:
 *       code:
 *         type: number
 *         example: "200"
 *       message:
 *         type: string
 *         example: "ok"
 *       data:
 *         type: []
 *         example: [{"subject": "test","content": "test", "author": {
            "account": "12345",
            "name": "1234"
        }}]
 */
/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     tags:
 *       - articles
 *     summary: "articles get api"
 *     description: "取得文章詳情"
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         schema:
 *         type: object
 *         $ref: '#/definitions/articlesGet'
 */
router.get("/:id", middleware.authorize, async (req, res) => {
  const { id = "" } = req.params;
  if (id === "") {
    res.status(422);
    res.send({
      code: 422,
      message: "incorrect url parameter",
      data: []
    });
    return;
  }
  let result = {};
  try {
    result = await articleService.articleGet(id);
  } catch (error) {
    res.send({
      code: 400,
      message: error.message,
      data: []
    });
    return;
  }
  res.send({ code: 200, message: "ok", data: result });
});

/**
 * @swagger
 * definitions:
 *   articlesList:
 *     description: request successful
 *     properties:
 *       code:
 *         type: number
 *         example: "200"
 *       message:
 *         type: string
 *         example: "ok"
 *       data:
 *         type: []
 *         example: [{"subject": "test","content": "test", "_id": "5dd6482c8b1aedc1f31d36d5"}]
 */
/**
 * @swagger
 * /api/articles:
 *   get:
 *     tags:
 *       - articles
 *     summary: "articles list api"
 *     description: "取得文章列表"
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         schema:
 *         type: object
 *         $ref: '#/definitions/articlesList'
 */
router.get("/", async (req, res) => {
  const { size, page, desc, order } = req.query;
  let data = [];
  try {
    data = await articleService.articleList(size, page, order, desc);
  } catch (error) {
    res.send({
      code: 400,
      message: error.message,
      data: []
    });
    return;
  }
  res.send({ code: 200, message: "ok", data });
});

module.exports = router;
