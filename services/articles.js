"use strict";

const { mongo } = require("../models");

const self = {
  articleCreate: async data => {
    const { user_id, subject, content } = data;
    const article = {
      user_id,
      subject,
      content
    };
    await mongo.models.article.create(article);
    return true;
  },

  articleGet: async id => {
    const data = await mongo.models.article.findOne(
      { _id: id, deleted: 0 },
      { __v: 0, deleted: 0 }
    );
    if (!data) return {};
    const { user_id } = data;
    const user = await mongo.models.user.findOne(
      { _id: user_id },
      { _id: 0, __v: 0, password: 0, salt: 0, create_time: 0, update_time: 0 }
    );
    Object.assign(data._doc, { author: user });
    delete data._doc.user_id;
    return data._doc;
  },

  articleList: async (
    size = 10,
    page = 1,
    order = "create_time",
    desc = true
  ) => {
    const data = await mongo.models.article.list(
      { size, page, order, desc },
      { deleted: 0 },
      { __v: 0, deleted: 0, create_time: 0, update_time: 0, user_id: 0 }
    );
    return data;
  },

  articlePut: async (id, user_id, data) => {
    const article = await mongo.models.article.findOne({ _id: id });
    if (article.user_id !== user_id) throw { message: "permission denied" };
    await mongo.models.article.updateOne({ _id: id }, data);
    return true;
  },

  articleDelete: async (id, user_id) => {
    const article = await mongo.models.article.findOne({ _id: id });
    if (article.user_id !== user_id) throw { message: "permission denied" };
    await mongo.models.article.updateOne({ _id: id }, { deleted: 1 });
  }
};

module.exports = self;
