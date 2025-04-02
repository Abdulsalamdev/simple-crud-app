const { deleteOne } = require("../controllers/address.controller");
const {Address} = require("../models/address")

const create = async (data) => {
    const address = new Address({
        cityName: data.cityName,
        description: data.description,
        isHeadquarter: data.isHeadquarter,
      });

      await address.save();
      return address
}

const getAll = async () => {
    const address = await Address.find().sort("cityName");
    return address
}

const getOne = async (id) => {
    const address = await Address.findById(id);
    if(!address) {
        throw new Error("Address not found")
    }

    return address
}
const edit = async (id,body) => {
    const address = await Address.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      if(!address) {
        throw new Error("Address not found")
    }

    return address
}
const deleteAddress = async (id) => {
    const address = await Address.findByIdAndDelete(id);

    if(!address) {
        throw new Error("Address not found")
    }

    return address
}
module.exports = {
    create,
    getAll,
    getOne,
    edit,
    deleteAddress
}