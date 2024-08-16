const express = require("express");
const router = express.Router();
const { User, userValidator, loginValidator } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { auth } = require("../middleware/auth");

// Token generator
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, config.accessToken, {
    subject: "Access API",
    expiresIn: config.accessTokenExpiresIn,
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, config.refreshToken, {
    subject: "Refresh API",
    expiresIn: config.refreshTokenexpiresIn,
  });
};
// Creating User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
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
    await newUser.save();

    return res.status(201).send({
      message: "User Successfully Created",
      id: newUser._id,
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
      return res.status(401).send({ message: "Invald email or passwor" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).send({ message: "Invald email or password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshtoken = refreshToken;
    await user.save();

    return res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// RfreshToken
router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const user = await User.find({ refreshToken });
    if (!user) res.status(401).send({ message: " refresh token not found" });
    const decodedRefreshToken = jwt.verify(refreshToken, config.refreshToken);
    if (!decodedRefreshToken)
      return res.status(402).send({ message: "Verify refresh token" });
    const accessToken = generateAccessToken(user);

    return res.status(200).send({
      id: user._id,
      accessToken,
    });
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      return res.status(400).send({ message: "refresh token invalid expired" });
    }
    res.status(500).send({ message: error.message });
  }
});

//LogOut
router.post("/log-out", async (req, res) => {
  const { refreshToken } = req.body;
  console.log(refreshToken);
  try {
    const user = await User.find({ refreshToken });
    if (!user) return res.status(401).send({ message: "Inavlid Token" });

    // await user.save();

    return res.status(204);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});
module.exports = router;
