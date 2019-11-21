"use strict";

const path = require("path");
const name = path.basename(module.filename).split(".")[0];
const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

// 使用者
const schema = new Schema({
  // 帳號
  account: {
    type: String,
    default: "",
    index: { unique: true }
  },
  // 密碼
  password: {
    type: String,
    default: ""
  },
  // 名稱
  name: {
    type: String,
    default: ""
  },
  // 加密亂數
  salt: {
    type: String,
    default: ""
  },
  create_time: {
    type: Date,
    default: moment().format("YYYY/MM/DD HH:mm:ss")
  },
  update_time: {
    type: Date,
    default: moment().format("YYYY/MM/DD HH:mm:ss")
  }
});

schema.statics.create = async function create(data) {
  const now = moment().format("YYYY/MM/DD HH:mm:ss");
  data.create_time = data.create_time || now;
  const doc = this(data);
  const result = await doc.save();
  return result;
};

module.exports = db => ({
  name,
  schema: schema
});
