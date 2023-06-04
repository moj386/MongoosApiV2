Stores = require('../Model/ModelStores');
Product = require('../Model/ModelProducts');
Categories = require('../Model/ModelMasters');
Increment = require('../../utils/fetchLastNumber');
const jwtToken = require('../../utils/tokenHandler');
const bcrypt = require('bcryptjs');
CustomerMaster = require('../Model/ModelCustomers');
const Orders = CustomerMaster.Orders;
const { BlobServiceClient } = require("@azure/storage-blob");
const connStr = "DefaultEndpointsProtocol=https;AccountName=zainexpressassets;AccountKey=L8QacscQxsGVWbhjSVNozCkuxBulccPj5Yt8SHNZtE92OJO+DMRgsSGUU+EgDZTZLW2gir9sflh6+ASt7I6T2w==;EndpointSuffix=core.windows.net";
const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const imagesMimeRegex = new RegExp("image/(.*)");
const axios = require('axios');
const email = require('../../middleware/emailService');
const baseL = "https://zainexpressassets.blob.core.windows.net/assets/"



exports.register = async function (req, res) {
    try {
        const password = '667544' //Math.floor(Math.random() * 899999 + 100000)
        const lastnumber = await Increment('stores')
        var store = new Stores(req.body);

        store._id = lastnumber
        store.store_password = await bcrypt.hash(password, 10);
        store.store_email = store.store_email.toLowerCase();
        const customer = await store.save();

        const text = `Your login id is ${store.store_email} and your password is ${password}. \n\nThank you for being a partner with Zeshop.`
        const subject = 'New account registration | Zeshop'

        if (store.store_status) {
            email.sendEmail(store.store_email, subject, text)
            sendSMS(store.store_mobile, text)

        }

        return res.json({ status: 1, message: 'Success', data: customer });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};

const sendSMS = async (mobile, text) => {
    try {
        const smsURL = encodeURIComponent(`https://api.rmlconnect.net:8443/bulksms/bulksms?username=ZainTrans&
        password=N5cq}-2C&type=0&dlr=1&destination=${mobile}&source=ZeShop&message=${text}`)
        await axios.get(smsURL)
    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

}


exports.smstest = async function (req, res) {
    try {
        email.sendEmail('asiapc000@gmail.com', 'test', 'test mail')
        return res.json({ status: 1, message: 'Success', data: 'done' });
    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
}


exports.login = async function (req, res) {
    try {
        const { store_email, store_password } = req.body;
        const user = await Stores.findOne({ store_email }).select("+store_password");

        if (user && user.store_status && (await bcrypt.compare(store_password, user.store_password))) {
            const token = jwtToken.createStoreToken(user)
            return res.json({ status: 1, message: 'Success', data: { token } });
        }
        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
}


exports.store_update = async function (req, res) {
    try {
        const password = '123456'
        var store = new Stores(req.body);
        store.store_email = store.store_email.toLowerCase();

        const customer = await Stores.findOneAndUpdate(
            { _id: store._id },
            store,
            { upsert: true, setDefaultsOnInsert: true },
        );

        const text = `Your login id is ${store.store_email} and your password is ${password}. \n\nThank you for being a partner with Zeshop.`
        const subject = 'New account registration | Zeshop'
        sendSMS(store.store_mobile, text)
        email.sendEmail(store.store_email, subject, text)

        return res.json({ status: 1, message: 'Success', data: customer });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};


exports.update_store_photo = async function (req, res) {
    try {
        const { store_id } = req.user
        const { product_image } = req.files
        const containerClient = blobServiceClient.getContainerClient("assets");
        if (!product_image) return res.sendStatus(400);
        if (!imagesMimeRegex.test(product_image.mimetype)) return res.sendStatus(400);
        const fileName = store_id + '_' + Date.now() + '.jpg';
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.upload(product_image.data, product_image.size);

        const filter = { _id: store_id };
        const update = { store_image: baseL + fileName };
        const result = await Stores.findOneAndUpdate(filter, update);
        return res.json({ status: 1, message: 'Success', data: result });

    } catch (e) {
        return res.json({ status: 0, message: e.message })
    }
}

exports.list = async function (req, res) {
    try {
        const data = await Stores.find({})
        return res.json({ status: 1, message: 'Success', data: data });
    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
}


exports.getNearBuyStores = async function (req, res) {
    const { long, latt } = req.body;
    var METERS_PER_MILE = 1000
    try {
        const data = await Stores.find({ store_pin_location: { $nearSphere: { $geometry: { type: "Point", coordinates: [latt, long] }, $maxDistance: 108 * METERS_PER_MILE } } })
        return res.json({ status: 1, message: 'Success', data: data });
    } catch (e) {
        res.json({ status: 0, message: e.message });
    }
}

exports.getNearBuyStoresV2 = async function (req, res) {
    const { long, latt } = req.body;
    const METERS_PER_MILE = 1000;
    const currentHH = new Date().getHours();
    const currentMM = new Date().getMinutes();
    const currentNumber = parseFloat(`${currentHH}.${currentMM}`)
    const location = [parseFloat(latt), parseFloat(long)]
    try {
        const data = await Stores.aggregate([
            {
                $geoNear: {
                    includeLocs: "sstore_pin_location",
                    distanceField: "distance",
                    near: { type: "Point", coordinates: location },
                    maxDistance: 10 * METERS_PER_MILE,
                    spherical: true
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "product_store_id",
                    as: "products"
                }
            },
            {
                $match: {
                    "products.product_status": true,
                    "products.product_available_fm": { $lte: currentNumber },
                    "products.product_available_till": { $gte: currentNumber },
                }
            },
            {
                "$project": {
                    _id: 1,
                    store_name: 1,
                    store_flat_discount: 1,
                    store_state_docno: 1,
                    store_area_docno: 1,
                    store_pin_location: 1,
                    store_address: 1,
                    store_mobile: 1,
                    store_email: 1,
                    store_phone: 1,
                    store_rating: 1,
                    store_total_reviews: 1,
                    store_image: 1,
                    store_delivery_fee: 1,
                    store_avg_delivery_minutes: 1,
                    store_best_opt1: 1,
                    store_best_opt2: 1,
                    store_best_opt3: 1,
                    store_best_opt4: 1,
                }
            }

        ])

        // const data = await Stores.find(
        //     { 
        //         _id: { $in: Product.distinct("field2") },
        //         store_pin_location: { $nearSphere: { $geometry: { type: "Point", coordinates: [latt, long] }, $maxDistance: 108 * METERS_PER_MILE } }
        //     })


        // const data = await Product.find({ 
        //     product_store_pin_location: { $nearSphere: { $geometry: { type: "Point", coordinates: [latt, long] }, $maxDistance: 108 * METERS_PER_MILE } },
        //     product_status: true,
        //     product_available_fm: { $lte: currentNumber },
        //     product_available_till: { $gte: currentNumber }},
        //     { "_id": 0, "product_store_id": 1 })

        //     const __storeList = data.reduce((acc, item) =>{
        //         return acc.push(item.product_store_id)
        //     },[])
        //const stores =  await Stores.find({ store_pin_location: { $nearSphere: { $geometry: { type: "Point", coordinates: [latt, long] }, $maxDistance: 108 * METERS_PER_MILE } } })



        res.json({ status: 1, message: 'Success', data: data });
    } catch (e) {
        res.json({ status: 0, message: e.message });
    }
}

exports.getSuggestionList = async function (req, res) {
    const { long, latt, term } = req.body;
    const METERS_PER_MILE = 1000;
    const currentHH = new Date().getHours();
    const currentMM = new Date().getMinutes();
    const currentNumber = parseFloat(`${currentHH}.${currentMM}`)
    const location = [parseFloat(latt), parseFloat(long)]

    try {

        const data = await Product.aggregate([
            {
                "$search": {
                    "index": "autocomplete",
                    "compound": {
                        "must": [
                            {
                                "autocomplete": {
                                    "query": `${term}`,
                                    "path": "product_store_keywords",
                                    "fuzzy": {
                                        "maxEdits": 2,
                                        "prefixLength": 3
                                    }
                                },
                            },
                            {
                                "geoWithin": {
                                    "circle": {
                                        "center": {
                                            "type": "Point",
                                            "coordinates": location
                                        },
                                        "radius": 100 * METERS_PER_MILE
                                    },
                                    "path": "product_store_pin_location"
                                }
                            }
                        ]
                    }
                }
            },
            {
            "$match": {
                    "product_status": true,
                    "product_available_fm": { $lte: currentNumber },
                    "product_available_till": { $gte: currentNumber },

                }
            },
            {
                "$project": {
                    _id: 1,
                    product_store_id: 1,
                    product_title: 1,
                    product_images: 1,
                    product_store_keywords: 1,
                    product_keywords: 1

                }
            }
        ])

        const data2 = await Product.aggregate([
            {
                "$search": {
                    "index": "autocomplete",
                    "compound": {
                        "must": [
                            {
                                "autocomplete": {
                                    "query": `${term}`,
                                    "path": "product_keywords",
                                    "fuzzy": {
                                        "maxEdits": 2,
                                        "prefixLength": 3
                                    }
                                },
                            },
                            {
                                "geoWithin": {
                                    "circle": {
                                        "center": {
                                            "type": "Point",
                                            "coordinates": location
                                        },
                                        "radius": 100 * METERS_PER_MILE
                                    },
                                    "path": "product_store_pin_location"
                                }
                            }
                        ]
                    }
                }
            },
            {
            "$match": {
                    "product_status": true,
                    "product_available_fm": { $lte: currentNumber },
                    "product_available_till": { $gte: currentNumber },

                }
            },
            {
                "$project": {
                    _id: 1,
                    product_store_id: 1,
                    product_title: 1,
                    product_images: 1,
                    product_store_keywords: 1,
                    product_keywords: 1

                }
            }
        ])
        res.json({ status: 1, message: 'Success', data: data });
    } catch (e) {
        res.json({ status: 0, message: e.message });
    }
}

// exports.getSuggestionList = async function (req, res) {
//     const { long, latt, term } = req.body;
//     const METERS_PER_MILE = 1000;
//     const currentHH = new Date().getHours();
//     const currentMM = new Date().getMinutes();
//     const currentNumber = parseFloat(`${currentHH}.${currentMM}`)
//     const location = [parseFloat(latt), parseFloat(long)]

//     try {
//         const data = await Product.aggregate([
//             // {
//             //     $geoNear: {
//             //         includeLocs: "product_store_pin_location",
//             //         distanceField: "distance",
//             //         near: { type: "Point", coordinates: location },
//             //         maxDistance: 100 * METERS_PER_MILE,
//             //         query: { category: "Parks" },
//             //         spherical: true
//             //     }
//             // },
//             {
//                 $search: {
//                   index: "search_index",
//                   text: {
//                     query: term,
//                     path: {
//                       wildcard: "*"
//                     }
//                   }
//                 },
//                 "should": {
//                     "near": {
//                       "origin": {
//                         "type": "Point",
//                         "coordinates": location
//                       },
//                       "pivot": 100 * METERS_PER_MILE,
//                       "path": "product_store_pin_location"
//                     }
//                   }
//               },
//             {
//                 $match: {
//                     "product_status": true,
//                     "product_available_fm": { $lte: currentNumber },
//                     "product_available_till": { $gte: currentNumber },

//                 }
//             },
//             {
//                 "$project": {
//                     _id: 1,
//                     product_store_id: 1,
//                     product_title: 1,
//                     product_images: 1

//                 }
//             }

//         ])
//         res.json({ status: 1, message: 'Success', data: data });
//     } catch (e) {
//         res.json({ status: 0, message: e.message });
//     }
// }



exports.myproducts = async function (req, res) {
    try {
        const { store_id } = req.user
        const data = await Product.find({ product_store_id: store_id })

        return res.json({ status: 1, message: 'Success', data });

    } catch (e) {
        return res.json({ status: 0, message: e.message })
    }
};

exports.adminProducts = async function (req, res) {
    try {
        const { store_id } = req.body
        const data = await Product.find({ product_store_id: store_id })
        return res.json({ status: 1, message: 'Success', data });
    } catch (e) {
        return res.json({ status: 0, message: e.message })
    }
};

exports.myOrders = async function (req, res) {
    try {
        const { store_id } = req.user
        const data = await Orders.find({ order_store_id: store_id })
        return res.json({ status: 1, message: 'Success', data });

    } catch (e) {
        return res.json({ status: 0, message: e.message })
    }
};

exports.singleOrders = async function (req, res) {
    try {
        const { order_id } = req.body
        const data = await Orders.findById(order_id)
        return res.json({ status: 1, message: 'Success', data });

    } catch (e) {
        return res.json({ status: 0, message: e.message })
    }
};

exports.singleOrderStatus = async function (req, res) {
    try {
        const { order_id, order_status } = req.body
        const data = await Orders.findById(order_id)

        data.order_store_accept_status = order_status
        data.order_store_accept_ts = new Date()
        await data.save()

        return res.json({ status: 1, message: 'Success', data });

    } catch (e) {
        return res.json({ status: 0, message: e.message })
    }
};


exports.myPayments = async function (req, res) {
    try {
        const { store_id } = req.user
        const data = await Orders.find({ order_store_id: store_id, order_store_payment_status: true })


        return res.json({ status: 1, message: 'Success', data });

    } catch (e) {
        return res.json({ status: 0, message: e.message })
    }
};


exports.addproduct = async function (req, res) {
    const commisionFee = 1;
    try {
        const { store_id } = req.user
        const __store = await Stores.findById(store_id)
        const { store_pin_location, store_keywords } = __store

        var product = new Product(req.body);
        const lastnumber = await Increment('products')
        product._id = 'ZX' + lastnumber
        product.product_store_id = store_id;

        const discountPercentage = product.product_discount_percentage ? product.product_discount_percentage : 0;
        const storeRate = product.product_store_price;
        var sellingRate = product.product_store_price;

        if (discountPercentage && discountPercentage > 0) {
            sellingRate = (sellingRate - (sellingRate * discountPercentage) / 100).toFixed(2);
        }
        const rateBeforeDiscount = (storeRate * commisionFee).toFixed(2);
        sellingRate = (sellingRate * commisionFee).toFixed(2);
        product.product_price = sellingRate;
        product.product_price_before_discount = rateBeforeDiscount;
        product.product_discount_percentage = discountPercentage;
        product.product_status = false
        product.product_is_customisable = false
        product.product_store_pin_location = store_pin_location
        product.product_keywords = product.product_title,
            product.product_store_keywords = store_keywords

        const item = await product.save();

        return res.json({ status: 1, message: 'Success', data: item });
    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};

exports.single = async function (req, res) {
    try {
        const { store_id } = req.user
        const { product_id } = req.body

        const data = await Product.find({ _id: product_id, product_store_id: store_id }).select("+product_store_price")
        const top = data[0]
        return res.json({ status: 1, message: 'Success', data: top });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }

};

exports.UpdateImages = async function (req, res) {
    try {
        const { store_id } = req.user;
        const { product_id } = req.body
        const { product_image } = req.files
        const list = await uploadPic(product_image, store_id)
        let { product_images } = await Product.findById(product_id)
        const mergeResult = [].concat(product_images, list);

        const filter = { _id: product_id };
        const update = { product_images_list: mergeResult, product_images: mergeResult };
        const result = await Product.findOneAndUpdate(filter, update);

        return res.json({ status: 1, message: 'Success', data: result });

    } catch (error) {
        console.log(error);
        res.json({ status: 0, message: error.message });
    }

};

exports.deleteImages = async function (req, res) {
    try {
        const { product_id, imageName } = req.body
        const { product_images } = await Product.findById(product_id)
        const list = product_images.filter(x => x !== imageName)
        const filter = { _id: product_id };
        const update = { product_images_list: list, product_images: list };
        const result = await Product.findOneAndUpdate(filter, update);

        return res.json({ status: 1, message: 'Success', data: list });

    } catch (error) {
        console.log(error);
        res.json({ status: 0, message: error.message });
    }

};


const uploadPic = async (files, store_id) => {
    const containerClient = blobServiceClient.getContainerClient("assets");
    let imgNames = []

    if (Array.isArray(files)) {
        for (const file of files) {
            const fileName = store_id + '_' + 1 + '_' + Date.now() + '.jpg';
            const blockBlobClient = containerClient.getBlockBlobClient(fileName);
            await blockBlobClient.upload(file.data, file.size);
            imgNames.push(baseL + fileName)
        }
        return imgNames
    }

    const fileName = store_id + '_' + 1 + '_' + Date.now() + '.jpg';
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.upload(files.data, files.size);
    imgNames.push(baseL + fileName)
    return imgNames


}

exports.updateStatus = async function (req, res) {
    try {
        const { product_id, product_status } = req.body

        const filter = { _id: product_id };
        const update = { product_status };
        const result = await Product.findOneAndUpdate(filter, update);

        return res.json({ status: 1, message: 'Success', data: result });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};

exports.updateSingle = async function (req, res) {
    const commisionFee = 1;
    try {

        const { store_id } = req.user
        const __store = await Stores.findById(store_id)
        const { store_pin_location, store_keywords } = __store

        var product = new Product(req.body);
        const discountPercentage = product.product_discount_percentage ? product.product_discount_percentage : 0;
        const storeRate = product.product_store_price;
        var sellingRate = product.product_store_price;


        if (discountPercentage && discountPercentage > 0) {
            sellingRate = (sellingRate - (sellingRate * discountPercentage) / 100).toFixed(2);
        }
        const rateBeforeDiscount = (storeRate * commisionFee).toFixed(2);
        sellingRate = (sellingRate * commisionFee).toFixed(2);
        product.product_price = sellingRate;
        product.product_price_before_discount = rateBeforeDiscount;
        product.product_discount_percentage = discountPercentage;
        product.product_store_pin_location = store_pin_location
        product.product_store_keywords = store_keywords


        const data = await Product.findOneAndUpdate({ _id: product._id }, product, { new: true })



        return res.json({ status: 1, message: 'Success', data });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};

exports.addColor = async function (req, res) {
    try {
        const baseL = 'https://zainexpressappstorage.blob.core.windows.net/designphotos/'
        const { productID, colorName, colorCode, imageName, sizes } = req.body
        const __product = await Product.findById(productID);
        let __imagesArray = __product.variation
        const pic = baseL + imageName
        const newItem = { colorCode, colorName, image: pic, size: sizes }
        __imagesArray.push(newItem)
        const data = await Product.updateOne({ _id: productID }, { "$set": { variation: __imagesArray } })
        res.json({ status: 1, message: 'Success', data });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }

};

exports.updateExtraInfo = async function (req, res) {
    try {
        const { productID, extraInfo } = req.body
        const data = await Product.updateOne({ _id: productID },
            { "$set": { fullDescription: extraInfo } })
        res.json({ status: 1, message: 'Success', data });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }

};

exports.myStore = async function (req, res) {
    try {
        const { store_id } = req.user
        const data = await Stores.findById(store_id)
        return res.json({ status: 1, message: 'Success', data: data });
    } catch (error) {
        res.json({ status: 0, message: error.message });
    }

};

exports.updateFCMToken = async function (req, res) {
    try {
        const { token } = req.body
        const { store_id } = req.user
        const user = await Stores.findById(store_id)
        const { store_notification_tokens } = user ? user : {}
        let _tokens = store_notification_tokens ? store_notification_tokens : []
        if (!_tokens.includes(token)) {
            _tokens.push(token)
        }
        const filter = { _id: store_id };
        const update = { store_notification_tokens: _tokens };
        const result = await Stores.findOneAndUpdate(filter, update);
        return res.json({ status: 1, message: 'Success', data: result });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};

exports.getFCMToken = async function (store_id) {
    const { store_notification_tokens } = await Stores.findById(store_id)
    return store_notification_tokens
}

