const express = require("express");
const router = express.Router();
const { Address, addressValidator } = require("../models/address");
const { auth } = require("../middleware/auth");
const { getAll } = require("../controllers/address.controller");

//Getting list of address
router.get("/", auth, getAll);

//Creating new Address
router.post("/", auth, async (req, res) => {
  const { error } = addressValidator(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
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
    res.status(500).send({ message: error.message });
  }
});

//Get a single address
router.get("/:id", auth, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) return res.status(404).send({ message: "Address not found" });
    res.status(200).send(address);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Editing address
router.put("/:id", auth, async (req, res) => {
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
});

//Deleting address
router.delete("/:id", auth, async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) return res.status(404).send({ message: "Address not found" });
    res.status(200).send({ message: "Address deleted successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});
module.exports = router;
