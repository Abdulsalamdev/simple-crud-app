const Joi = require("joi");
const { required } = require("joi");
const mongoose = require("mongoose");
const { refreshToken } = require("../config");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    minlength: [5, "Username must be at least 5 characters long"],
    maxlength: [30, "Username cannot exceed 30 characters"],
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "username is required"],
    validate: {
      validator: function (v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    minlength: [8, "Password must be at least 8 characters long"],
    required: true,
  },
  confirmPassword: {
    type: String,
    minlength: [8, "Password must be at least 8 characters long"],
    required: true,
  },
  // role: {
  //   type: String,
  //   enum: ["admin", "user"],
  //   default: "user",
  // },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

const refreshTokenSchema = new mongoose.Schema({
  refreshToken: String,
  userId: String,
});

const RefreshToken = mongoose.model("refreshToken", refreshTokenSchema);
const User = mongoose.model("User", userSchema);

const userValidator = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(5).max(30).required(),
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    // role: Joi.string(),
  });
  return schema.validate(user);
};
const loginValidator = (user) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(user);
};
module.exports = { User, userValidator, loginValidator, RefreshToken };
