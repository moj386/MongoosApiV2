const mongoose = require("mongoose");
TimeSchema = require("../../Models/TimeMaster")


const dateSchema = new mongoose.Schema({
    _id: {type: String},
    docno: Number
}); 

const mainCategories = new mongoose.Schema({
    _id: String,
    description: String,
    image1: String,
    image2: String,
    orderby: Number,
    status: Boolean
}); 

const subCategories = new mongoose.Schema({
    _id: String,
    description: String,
    image1: String,
    image2: String,
    orderby: Number,
    status: Boolean,
    category_docno: String
}); 

const origins = new mongoose.Schema({
    _id: String,
    description: String,
    country_code: String,
    isActive: Boolean,
}); 

const units = new mongoose.Schema({
    _id: String,
    description: String,
    isActive: Boolean,
}); 

const brands = new mongoose.Schema({
    _id: String,
    description: String,
    image: String,
    order: Number,
    isActive: Boolean
}); 

const tags = new mongoose.Schema({
    _id: String,
    description: String,
    image: String,
    order: Number,
    isActive: Boolean
}); 

const featured = new mongoose.Schema({
    _id: String,
    description: String,
    image: String,
    order: Number,
    isActive: Boolean
}); 

const colors = new mongoose.Schema({
    _id: String,
    description: String,
    image: String,
    order: Number,
    isActive: Boolean
}); 

const sizes = new mongoose.Schema({
    _id: String,
    description: String,
    image: String,
    order: Number,
    isActive: Boolean
}); 


const increment = new mongoose.Schema({
    _id: String,
    seq: Number,
}); 

  
const hero_banners = new mongoose.Schema({
    _id: String,
    description: String,
    url: String,
    click_type: String,
    click_action: String,
    click_param1: String,
    click_param2: String,
    active_status: Boolean,
    end_time: Date
}); 



exports.Dates = mongoose.model("date_master", dateSchema);
exports.Times = mongoose.model("time_master", TimeSchema);
exports.Categories = mongoose.model("category_master", mainCategories);
exports.subCategories = mongoose.model("sub_category_master", subCategories);
exports.Origins = mongoose.model("origin_master", origins);
exports.Units = mongoose.model("unit_master", units);
exports.Brands = mongoose.model("brand_master", brands);
exports.Tags = mongoose.model("tag_master", tags);
exports.Featured = mongoose.model("featured_master", featured);
exports.Colors = mongoose.model("color_master", colors);
exports.Sizes = mongoose.model("size_master", sizes);
exports.HeroBanners = mongoose.model("hero_banners", hero_banners);


exports.Increment = mongoose.model("increment_master", increment);