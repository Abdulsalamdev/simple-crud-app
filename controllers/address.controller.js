const {Address,addressValidator} = require("../models/address")
const addressService = require("../services/address.service")

const getAll =  async (req, res) => {
    try {
      const address = await addressService.getAll()
      res.status(200).send({
        message: "Address retrived successfully",
        data: address
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

const getOne =  async (req, res) => {
  const {id } = req.params
    try {
     const address = await addressService.getOne(id)
      res.status(200).send(address);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

const create = async (req, res) => {
  const {body:data} = req
  const { error } = addressValidator(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  try {
const address = await addressService.create(data)
    res.status(201).send({
      message: "Address created successfully",
      data: address
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

const editOne = async (req, res) => {
  const {params: {id}, boday} = req
    try {
     const address = await addressService.edit(id,boday)
      res.status(200).send({
        message: "Address edited Successfully",
        data: address
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  const deleteAddress = async (req, res) => {
    const {id}= req.params
    try {
      const address = await addressService.deleteAddress(id)
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
    deleteAddress,
  }