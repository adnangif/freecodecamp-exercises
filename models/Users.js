const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  log: [
    // {
    //   description: {
    //     type: String,
    //     required: true,
    //   },
    //   duration: {
    //     type: Number,
    //     required: true,
    //   },
    //   date: {
    //     type: Date,
    //     default: Date.now,
    //   },
    // },
  ],
});

const users = new mongoose.model("User", usersSchema);
const exercise = new mongoose.model("Exercise", exerciseSchema);
module.exports = { users, exercise };
