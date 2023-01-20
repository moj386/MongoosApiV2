var mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({

    title: { type: String, required: true },
    line1: { type: String, required: true },
    line2: String,
    latlang: String,
    area: String,
    state: String,
    country: String,
    mobile: { type: String, required: true },
    defaultAddress: { type: Boolean, required: true },
    status: { type: Boolean, default: true },
    created: {
      type: Date,
      default: Date.now
    }
  
  })

  module.exports = AddressSchema