"use strict";

const path = require("path");
const name = path.basename(module.filename).split(".")[0];
const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

const schema = new Schema({
  account: {
    type: String,
    default: "",
    index: true
  },
  name: {
    type: String,
    default: ""
  },
  password: {
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
