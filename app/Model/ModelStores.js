var mongoose = require('mongoose');

var storesSchema = mongoose.Schema({
  _id: String,
  store_password: { type: String, required: true, select: false },
  store_name:  { type: String, required: true },
  store_flat_discount :  { type: Number },
  store_state_docno:  { type: String },
  store_area_docno:  { type: String },
  store_pin_location:  { type: { type: String }, coordinates: [] },
  store_address: { type: String, required: true },
  store_mobile:  { type: String, required: true, unique: true  },
  store_email:  { type: String, required: true, unique: true },
  store_phone: { type: String },
  store_last_login: { type: Date },
  store_rating: { type: Number },
  store_total_reviews:  { type: Number },
  store_image:  { type: String },
  store_delivery_fee: {  type: Number },
  store_avg_delivery_minutes: {  type: Number },
  store_best_opt1: {  type: String },
  store_best_opt2: {  type: String },
  store_best_opt3: {  type: String },
  store_best_opt4: {  type: String },
  store_access_token: String,
  store_notification_tokens:[],
  
  store_create_date: {
        type: Date,
        default: Date.now,
        select: false
    },
  store_keywords: String,
});

storesSchema.index({ store_pin_location: "2dsphere", store_keywords: "text" })
module.exports = mongoose.model('stores', storesSchema);
