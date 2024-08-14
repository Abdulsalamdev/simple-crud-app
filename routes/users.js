const express = require("express");
const router = express.Router();
const { User, userValidator, loginValidator } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

// Creating User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const { error } = userValidator(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const existedUser = await User.findOne({ email });
    if (existedUser)
      return res.status(400).send({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });
    const savedUser = await newUser.save();
    return res.status(201).send({
      message: "User Successfully Created",
      user: savedUser,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginValidator(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).send({ message: "Invald email or password" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).send({ message: "Invald email or password" });

    const accessToken = jwt.sign({ userId: user._id }, config.accessToken, {
      subject: "access API",
      expiresIn: "1h",
    });
    return res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = router;
