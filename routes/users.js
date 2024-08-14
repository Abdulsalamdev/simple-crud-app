const express = require("express");
const router = express.Router();
const {
  User,
  userValidator,
  loginValidator,
  RefreshToken,
} = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { auth } = require("../middleware/auth");
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
      id: savedUser._id,
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

    const accessToken = jwt.sign({ userId: user._id }, config.accessToken, {
      subject: "Access API",
      expiresIn: config.accessTokenExpiresIn,
    });

    const refreshToken = jwt.sign({ userid: user._id }, config.refreshToken, {
      subject: "Refresh API",
      expiresIn: config.refreshTokenexpiresIn,
    });
    const newRefreshToken = new RefreshToken({
      refreshToken,
      userId: user._id,
    });
    const savedRefreshToken = await newRefreshToken.save();
    console.log(savedRefreshToken);
    return res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
      // userId: user._id,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//RfreshToken
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).send({ message: "refresh token not found" });

    const decodedRefreshToken = jwt.verify(refreshToken, config.refreshToken);
    const userRefreshToken = await RefreshToken.findOne({
      refreshToken,
      userId: decodedRefreshToken.userid,
    });
    console.log({ decodedRefreshToken, userRefreshToken, refreshToken });

    if (!userRefreshToken)
      return res.status(403).send({ message: " refresh token not found" });
    const updateRefreshToken = await RefreshToken.findOneAndUpdate(
      {
        _id: userRefreshToken._id,
      },
      { newRefreshToken }
    );
    await updateRefreshToken.save();
    // await RefreshTokene();

    const accessToken = jwt.sign(
      { userId: decodedRefreshToken.userId },
      config.accessToken,
      {
        subject: "Access API",
        expiresIn: config.accessTokenExpiresIn,
      }
    );

    const newRefreshToken = jwt.sign(
      { userid: decodedRefreshToken.userId },
      config.refreshToken,
      {
        subject: "Refresh API",
        expiresIn: config.refreshTokenexpiresIn,
      }
    );

    return res.status(200).send({
      accessToken,
      newRefreshToken,
    });
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      return res.status(401).send({ message: "refresh token invalid expired" });
    }
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
