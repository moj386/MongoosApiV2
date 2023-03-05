var mongoose = require('mongoose');
ProductSchema = require("../../Models/Product")
ProductSchema.index({ product_store_pin_location: "2dsphere", product_store_keywords:"text"}); 
module.exports = mongoose.model('Products', ProductSchema);


