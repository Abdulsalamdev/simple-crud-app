const {Address,addressValidator} = require("../models/address")

const getAll =  async (req, res) => {
    try {
      const address = await Address.find().sort("cityName");
      res.status(200).send(address);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  module.exports = {
    getAll
  }