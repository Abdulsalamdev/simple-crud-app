const express = require("express");
const router = express.Router();
const { Address, addressValidator } = require("../models/address");

//Getting list of address
router.get("/", async (req, res) => {
  try {
    const address = await Address.find().sort("cityName");
    res.status(200).send(address);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Creating new Address
router.post("/", async (req, res) => {
  const { error } = addressValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { cityName, description, isHeadquarter } = req.body;
  try {
    const newAddress = new Address({
      cityName,
      description,
      isHeadquarter,
    });
    const savedAddress = await newAddress.save();
    res.status(201).send(savedAddress);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Get a single address
router.get("/:id", async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) return res.status(404).send({ message: "Address not found" });
    res.status(200).send(address);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

//Editing address
router.put("/:id", async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!address) return res.status(404).send({ message: "Address not found" });
    res.status(200).send(address);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

//Deleting address
router.delete("/:id", async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) return res.status(404).send({ message: "Address not found" });
    res.status(200).send({ message: "Address deleted successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
module.exports = router;
