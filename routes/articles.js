"use strict";

const express = require("express");
const router = express.Router();
const middleware = require("../middlewares");
const articleService = require("../services/articles");

router.post("/", middleware.authorize, async (req, res) => {
  const { subject = "", content = "" } = req.body;
  if (subject === "" || content === "") {
    res.status = 422;
    res.send({
      code: 422,
      message: "incorrect body data",
      data: []
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
      message: error.message,
      data: []
    });
    return;
  }
  res.send({
    code: 201,
    message: "ok",
    data: []
  });
});

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
  res.status = 201;
  res.send({ code: 201, message: "ok", data: [] });
});

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
  res.status = 201;
  res.send({ code: 201, message: "ok", data: [] });
});

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
