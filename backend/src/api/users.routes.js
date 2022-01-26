const express = require("express");
const services = require("../services");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtConfig = require("../configs/jwt.config");

router.post("/api/creatUser", async (req, res) => {
  const body = req.body;
  console.log("aki");
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(body.password, salt);
  console.log(body);
  const [user] = await services.users.creat({
    ...body,
    password: passwordHash
  });
  console.log("aki");
  console.log("aki");
  res.send(user._doc);
});

router.post("/api/login", async (req, res) => {
  const body = req.body;
  try{
    console.log("f");
  const [user] = await services.users.findByEmail(body.email);

  const isValid = await bcrypt.compare(body.password, user.password);

  if (!isValid) return res.status(400).json({ msg: "Invalid credentials." });

  const token = jwt.sign({ id: user._id }, jwtConfig.secret);

  res.send({ token, user: user._doc });
  }catch (error) {
    console.log("error");
    return res.status(400).json({ msg: "Invalid credentials." });
    }
    console.log("ff");
});

router.post("/api/auth", async (req, res) => {
  const [, token] = req.headers.cookie.split("=");

  if (!token) return res.json(false);

  const verified = jwt.verify(token, jwtConfig.secret);
  if (!verified) return res.json(false);

  res.send(true);
});

router.get("/api/getUser", async (req, res) => {
  const { userId } = req.params;

  const posts = await services.users.findById(userId);

  res.send(posts);
});


module.exports = router;
