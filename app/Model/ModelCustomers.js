const mongoose = require("mongoose");

ProductSchema = require("../../Models/Product")
AddressSchema = require("../../Models/Address")
TimeSchema = require("../../Models/TimeMaster")
Address = require("../../Models/Address")
OrderStoreSchema = require('../../Models/Stores');

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
    customer_cart: {
      products: [ProductSchema],
      gross_amount: Number,
      delivery_fee: Number,
      vat_amount: Number,
      service_charges: Number,
      discount_amount: Number,
      other_amount: Number,
      net_amount: Number
    },
    customer_wishlist_restaurant:[String],
    customer_wishlist_products:[String],
    customer_otp: { type: Number, select: false },
    customer_otp_expiry: { type: Date, select: false },
    customer_otp_last_retry: { type: String, select: false },
    customer_otp_max_retries: { type: Number, select: false , default: 0 },
    customer_pay_token: String

});

const orderSchema = new mongoose.Schema({
  _id: String,
  order_store_id: { type: String, required: true },
  order_customer_id:  { type: String, required: true },
  order_datetime:{ type: Date, default: Date.now },
  order_gross_amount: Number,
  order_vat_amount: Number,
  order_discount_amount: Number,
  order_delivery_charges: Number,
  order_service_charges: Number,
  order_net_amount: Number,
  order_customer_email:  String,
  order_customer_mobile: String ,
  order_customer_comments: String,
  order_cooking_instructions: String,

  order_status: { type: Number, default: 1 },  //  1 open | 0 closed | 2 delivered 
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
  order_store_accept_status: { type: Number, default: 0 },
  order_store_accept_ts: Date,
  order_store_payment_status: Boolean,
  order_store_paid_amount: Number,
  order_customer_rating: Number,
  order_customer_remarks: String,
  order_store_rating: Number,
  order_store_remarks: String,
  order_products:[ProductSchema],
  order_customer_address: Address,
  order_store_address: OrderStoreSchema

});


orderSchema.index({ customer_id: "1"});  

exports.Customer = mongoose.model("customers", userSchema);
exports.Orders = mongoose.model("orders", orderSchema);