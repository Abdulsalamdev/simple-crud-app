const express = require("express");
const { register, login, refreshToken, logOut, forgetPassword, verifyOtp, resetPassword } = require("../controllers/user.controller");
const { auth } = require("../middleware/auth");
const userroutes = express.Router();

// Creating User
userroutes.post("/register",register);

// Login User
userroutes.post("/login",login);

// RfreshToken
userroutes.post("/refresh-token", auth, refreshToken);

//LogOut
userroutes.post("/log-out", auth, logOut);

// Forget password
userroutes.post("/forget-password", forgetPassword);

//Verify otp
userroutes.post("/verify-otp", verifyOtp);

//reset Password
userroutes.post("/reset-password", resetPassword);

module.exports = userroutes ;
