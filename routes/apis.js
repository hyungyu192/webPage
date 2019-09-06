var express = require('express');
var router = express.Router();

const crypto = require("crypto");

const { User, sequelize } = require('../models');
sequelize.sync();

// /apis/join
router.post('/join', async (req, res, next) => {
  const identity = req.body.identity;
  const exist = await User.findOne({ where: { identity }});
  if (exist) {
    return res.status(400).send("exist user");
  }
  const password = crypto.createHash('sha256').update(req.body.password).digest('hex');
  const nickname = req.body.nickname;
  console.log(identity, password, nickname);
  await User.create({
    identity,
    password,
    nickname,
    level: 0,
  });
  res.send('test complete');
});

router.post('/login', async(req, res, next) => {
  const identity = req.body.identity;
  const password = crypto.createHash('sha256').update(req.body.password).digest('hex');
  const user = await User.findOne({
    where: { identity, password }
  });
  if (user) {
    req.session.user = user;
    return res.send("success");
  }
  return res.status(400).send("login failed.");
});

module.exports = router;
