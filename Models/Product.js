var mongoose = require('mongoose');


const option_details = {
    option_detail_desc: String,
    option_detail_additionl_amount: Number,
    option_detail_status: Boolean
}
const __variation = {
    option_desc: String,
    option_is_mandatory: Boolean,
    option__mandatory_count: Number,
    option_status: Boolean,
    option_details: option_details
}

const size_details = mongoose.Schema({

    name: { type: String, required: true, unique: true },
    gross_rate: Number,
    rate: Number,
    discount: Number,
    status: Boolean,
    selected: Boolean
})

const choice_list_details = mongoose.Schema({
    cld_name: { type: String, required: true, unique: true },
    cld_price: Number,
    cld_ranking: Number,
    cld_selected: Boolean,
    selected: Boolean
})

const choice_sections_list = mongoose.Schema({
    choice_name: { type: String, required: true, unique: true },
    choice_mnq: { type: Number, required: true },
    choice_mxq: { type: Number, required: true },
    choice_ranking: Number,
    choice_status: { type: Boolean, default: true },
    choice_updateRate: Boolean,
    choice_list:[choice_list_details]
})
var ProductSchema = mongoose.Schema({
    _id: String,
    product_store_id: { type: String, required: true },
    product_title: { type: String, required: true },
    product_store_price: { type: Number, required: false },
    product_discount_percentage: { type: Number, required: true },
    product_price_before_discount: { type: Number, required: true },
    product_price: { type: Number, required: true },
    product_detail_title: { type: String, required: true },
    product_dietary_info: { type: Boolean, required: true },
    product_rating: { type: Number, required: false },
    product_total_reviews: { type: Number, required: false },
    product_image_name: { type: String, required: false },
    product_status: { type: Boolean, required: true },

    product_available_fm: { type: Number, required: false },
    product_available_till: { type: Number, required: false },
    product_images: [String],
    product_images_list: [String],

    product_category: [String],
    product_variation: [__variation],
    product_active_status: Boolean,
    product_keywords: String,
    product_store_keywords: String,
    product_cart_qty: Number,
    product_cart_amount: Number,
    product_created_ts: { type: Date, default: Date.now },
    product_store_pin_location: { type: { type: String }, coordinates: [] },
    product_sizes: [size_details],
    product_is_customisable: { type: Boolean, required: true },
    product_opening_time: String,
    product_closing_time: String,
    product_available_times: [{ start_time: String, end_time: String }],
    choice_sections: [ choice_sections_list ]


});
module.exports = ProductSchema




// const __size = {
//     name: String,
//     stock: Number
// }
// const __variation = {
//     colorCode: String,
//     colorName: String,
//     image: String,
//     size:[__size]
// }

// var ProductSchema = mongoose.Schema({
//     _id: String,
//     storeId:{ type: Number, required: true },
//     name: { type: String, required: true },
//     origin: { type: String, required: true },
//     brand: { type: String, required: true },
//     uom: { type: String, required: true },
//     store_rate: { type: Number, required: true, select: false },
//     store_discount_percentage: { type: Number, required: true },
//     commission_percentage: { type: Number, required: true, select: false },
//     price_before_discount: { type: Number, required: true },
//     price: { type: Number, required: true },
//     new: Boolean,
//     rating: Number,
//     image: String,
//     category: { type: String, },
//     subCategory: { type: String,},
//     featured: [String],
//     tags: [String],
//     images: [String],
//     shortDescription: String,
//     fullDescription: String,
//     variation:[__variation],
//     isActive: { type: Number,  default: 5, select: false },
//     height: { type: Number, required: true},
//     width: { type: Number, required: true},
//     weight: { type: Number, required: true},
//     condition: { type: String, required: true},
//     stocks:Number,
//     selectedProductColor: String,
//     selectedProductSize: String,
//     quantity: Number,
//     productSize:Number
// });

// module.exports = ProductSchema