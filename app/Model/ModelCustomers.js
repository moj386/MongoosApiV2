const mongoose = require("mongoose");

ProductSchema = require("../../Models/Product")
AddressSchema = require("../../Models/Address")
TimeSchema = require("../../Models/TimeMaster")
Address = require("../../Models/Address")
const userSchema = new mongoose.Schema({
    
    customer_name: String,
    customer_mobile: { type: String, required: true },
    customer_email: String,
    customer_password: { type: String, select: false },
    customer_login_token: { type: String },
    customer_notification_tokens:[String],
    customer_status: { type: Boolean, default: true, select: false },
    customer_created: { type: Date, default: Date.now, select: false },
    customer_addresses:[AddressSchema],
    customer_cart_products: [ProductSchema],
    customer_otp: { type: Number, select: false },
    customer_otp_expiry: { type: Date, select: false },
    customer_pay_token: String

});

const orderSchema = new mongoose.Schema({

  order_store_id: { type: String, required: true },
  order_customer_id:  { type: String, required: true },
  order_datetime:{ type: Date, default: Date.now },
  order_gross_amount: Number,
  order_discount_amount: Number,
  order_delivery_charges: Number,
  order_net_amount: Number,
  order_customer_email:  String,
  order_customer_mobile: String ,
  order_customer_comments: String,
  order_cooking_instructions: String,
  order_staus: Number,
  order_payment_status: Number,
  order_payment_collection_status: Number,
  order_payment_collected_amount: Number,
  order_delivery_status: String,
  order_assigned_by: String,
  order_assigned_to_driver_id: String,
  order_assigned_ts: Date,
  order_accepted_driver_id: String,
  order_accepted_driver_ts: Date,
  order_deliver_ts: Date,
  order_customer_rating: Number,
  order_customer_remarks: String,
  order_store_rating: Number,
  order_store_remarks: String,
  order_products:[ProductSchema],
  order_address: Address

});





orderSchema.index({ customer_id: 1});  

exports.Customer = mongoose.model("customers", userSchema);
exports.Orders = mongoose.model("orders", orderSchema);