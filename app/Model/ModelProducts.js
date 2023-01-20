var mongoose = require('mongoose');
ProductSchema = require("../../Models/Product")


ProductSchema.index({ product_active_status: 1} , {product_keywords: 1}, {product_store_id: 1});  
module.exports = mongoose.model('Products', ProductSchema);
