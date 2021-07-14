const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { users, exercise } = require("./models/Users.js");
const uri =
  "mongodb+srv://admin:anypasswilldo@clusterinsta.eqeae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

router.get("/", (req, res) => {
  res.sendStatus(200);
});
router.post("/users", (req, res) => {
  const username = req.body.username;
  users.find({ username }).then(async (data) => {
    if (data.length) {
      res.send("Username already taken");
    } else {
      const person = new users({
        _id: mongoose.Types.ObjectId(),
        username,
      });
      const data = await person.save();
      res.send({
        username: data.username,
        _id: data._id,
      });
    }
  });
});

router.get("/users", (req, res) => {
  users.find({}).then((allUsers) => {
    const allData = allUsers.map((each) => {
      return {
        username: each.username,
        _id: each._id,
      };
    });
    res.send(allData);
  });
});

router.post("/users/:_id/exercises", async (req, res) => {
  const user_id = req.params._id;
  const description = req.body.description;
  const duration = Number.parseInt(req.body.duration);

  let date = req.body.date != "" ? req.body.date : Date.now();
  date = new Date(date);
  date = date.toDateString();

  const user = await users.findOne({ _id: user_id });
  user.log.push({ description, duration, date });
  user.save().then(() => {
    users.updateOne({ _id: user_id }, { $inc: { count: 1 } });
    res.send({
      _id: user_id,
      username: user.username,
      description,
      duration,
      date,
    });
  });
});

router.get("/users/:_id/logs", async (req, res) => {
  const id = req.params._id;
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;

  console.log(from, to, limit);

  from = new Date(from).getTime();
  to = new Date(to).getTime();

  const user = await users.findOne({ _id: req.params._id });
  const log = await user.log;
  let filteredLog = log;

  if (from) {
    filteredLog = log.filter((item) => {
      let nowDate = new Date(item.date).getTime();
      const condition1 = from - nowDate <= 0;
      const condition2 = to - nowDate > 0;
      return condition1 && condition2;
    });
  }

  if (from) {
    limit = limit || filteredLog.length;
    limit = Number.parseInt(limit);
    res.send({
      _id: id,
      username: user.username,
      from: new Date(from).toDateString(),
      to: new Date(to).toDateString(),
      count: limit,
      log: filteredLog.slice(0, limit),
    });
  } else {
    limit = limit || filteredLog.length;
    limit = Number.parseInt(limit);
    res.send({
      _id: id,
      username: user.username,
      count: limit,
      log: filteredLog.slice(0, limit),
    });
  }
});

module.exports = router;
