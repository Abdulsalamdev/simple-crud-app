const {Address,addressValidator} = require("../models/address")

const getAll =  async (req, res) => {
    try {
      const address = await Address.find().sort("cityName");
      res.status(200).send(address);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

const getOne =  async (req, res) => {
    try {
      const address = await Address.findById(req.params.id);
      if (!address) return res.status(404).send({ message: "Address not found" });
      res.status(200).send(address);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

const create = async (req, res) => {
    const { cityName, description, isHeadquarter } = req.body;
  const { error } = addressValidator(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  try {
    const newAddress = new Address({
      cityName,
      description,
      isHeadquarter,
    });
    const savedAddress = await newAddress.save();
    res.status(201).send(savedAddress);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

const editOne = async (req, res) => {
    try {
      const address = await Address.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!address) return res.status(404).send({ message: "Address not found" });
      res.status(200).send(address);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  const deleteOne = async (req, res) => {
    try {
      const address = await Address.findByIdAndDelete(req.params.id);
      if (!address) return res.status(404).send({ message: "Address not found" });
      res.status(200).send({ message: "Address deleted successfully" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  module.exports = {
    getAll,
    create,
    editOne,
    getOne,
    deleteOne,
  }