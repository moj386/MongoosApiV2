var mongoose = require('mongoose');
ProductSchema = require("../../Models/Product")
ProductSchema.index({ product_store_pin_location: "2dsphere" }); 
module.exports = mongoose.model('Products', ProductSchema);


