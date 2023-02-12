
var mongoose = require('mongoose');

var OrderStoreSchema = mongoose.Schema({
  _id: String,
  store_name:  { type: String },
  store_flat_discount :  { type: Number },
  store_state_docno:  { type: String },
  store_area_docno:  { type: String },
  store_pin_location:  { type: { type: String }, coordinates: [] },
  store_address: { type: String,  },
  store_mobile:  { type: String},
  store_email:  { type: String},
  store_phone: { type: String },
  store_last_login: { type: Date },
  store_rating: { type: Number },
  store_total_reviews:  { type: Number },
  store_image:  { type: String },
  store_delivery_fee: {  type: Number },
  store_avg_delivery_minutes: {  type: Number }
});

OrderStoreSchema.index({ store_pin_location: "2dsphere"})

module.exports = OrderStoreSchema