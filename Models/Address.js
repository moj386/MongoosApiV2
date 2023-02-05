var mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({

    title: { type: String, required: true },
    line1: { type: String, required: true },
    line2: String,
    line3: String,
    addres_latitude: Number, 
    addres_longitude: Number,
    pin_location:  { type: { type: String }, coordinates: [] },
    area: String,
    state: String,
    country: { type: String, default: "AE" },
    mobile: { type: String, required: true },
    defaultAddress: { type: Boolean, required: true },
    status: { type: Boolean, default: true },
    created: { type: Date, default: Date.now }
  
  })

  module.exports = AddressSchema