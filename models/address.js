const mongoose = require("mongoose");
const Joi = require("joi");

const addressSchema = new mongoose.Schema({
  cityName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isHeadquarter: {
    type: Boolean,
    default: false
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const Address = mongoose.model("Address", addressSchema);

const addressValidator = (address) => {
  const schema = Joi.object({
    cityName: Joi.string().required(),
    description: Joi.string().required(),
    isHeadquarter: Joi.boolean()
  });
  return schema.validate(address);
};

module.exports = { Address, addressValidator };
