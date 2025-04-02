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

module.exports = {
    create
}