const express = require("express");
const router = express.Router();
const { Address, addressValidator } = require("../models/address");
const { auth } = require("../middleware/auth");
const { getAll, getOne, create } = require("../controllers/address.controller");

//, auth
//Getting list of address
router.get("/", getAll);

//Creating new Address
router.post("/", create);

//Get a single address
router.get("/:id",getOne);

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
