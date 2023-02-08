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
    option_details:option_details 
}

var ProductSchema = mongoose.Schema({
    _id: String,
    product_store_id:{ type: Number, required: true },
    product_title: { type: String, required: true },
    product_store_price: { type: Number, required: true, select: false },
    product_discount_percentage: { type: Number, required: true },
    product_price_before_discount: { type: Number, required: true },
    product_price: { type: Number, required: true },
    product_detail_title: { type: String, required: true },
    product_dietary_info: { type: Boolean, required: true },
    product_rating: { type: Number, required: false },
    product_total_reviews: { type: Number, required: false },
    product_is_customisable: { type: Boolean, required: true },
    product_image: { type: String, required: false },
    product_status: { type: Boolean, required: true },
    product_available_fm: { type: Date, required: true },
    product_available_till: { type: Date, required: true },
    product_category:[String],
    product_variation:[__variation],
    product_active_status:Boolean,
    product_keywords: String,
    product_cart_qty: Number,
    product_cart_amount: Number,
    product_created_ts: { type: Date, default: Date.now }
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