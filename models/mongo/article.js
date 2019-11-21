"use strict";

const path = require("path");
const name = path.basename(module.filename).split(".")[0];
const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

// 文章
const schema = new Schema({
  // 作者user_id
  user_id: {
    type: String
  },
  // 主題
  subject: {
    type: String,
    default: "",
    index: true
  },
  // 內容
  content: {
    type: String,
    default: ""
  },
  // 刪除狀態 0:未刪除, 1:已刪除
  deleted: {
    type: Number,
    default: 0
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

schema.statics.list = function(pagination, condition = {}, projection = {}) {
  return new Promise((resolve, reject) => {
    const { page, size, order, desc } = pagination;
    const promises = [this.countDocuments(condition)];
    const promise = this.find(condition, projection)
      .limit(Number(size))
      .sort(`${desc === true ? "-" : ""}${order}`)
      .skip((Number(page) - 1) * Number(size));
    promises.push(promise);
    Promise.all(promises)
      .then(results => {
        const count = results[0];
        const rows = results[1];
        const datas = { count, rows };
        datas.rows = datas.rows.map(row => {
          return row;
        });
        resolve(datas);
      })
      .catch(error => reject(error));
  });
};

module.exports = db => ({
  name,
  schema: schema
});
