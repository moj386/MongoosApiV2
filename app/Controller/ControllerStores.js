Stores = require('../Model/ModelStores');
Product = require('../Model/ModelProducts');
Categories = require('../Model/ModelMasters');
Product = require('../Model/ModelProducts');
Increment = require('../../utils/fetchLastNumber');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TokenKey = require('../../middleware/secret_key');
const secret_key_value = TokenKey.key;


exports.register = async function (req, res) {
    try {

        const lastnumber = await Increment('stores')
        var store = new Stores(req.body);
        store._id = lastnumber
        encryptedPassword = await bcrypt.hash(store.store_password, 10);
        store.store_password = encryptedPassword;
        store.store_email = store.store_email.toLowerCase();
        const customer = await store.save();
        res.json({ status: 1, message: 'Success', data: customer });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};

exports.login = async function (req, res) {
    try {
        const { store_email, store_password } = req.body;
        if (!(store_email && store_password)) {
            res.status(400).send("All inputs are required");
        }
        const user = await Stores.findOne({ store_email }).select("+store_password");
        if (user && (await bcrypt.compare(store_password, user.store_password))) {
            const token = jwt.sign(
                {
                    user_id: user._id,
                    email: store_email
                },
                secret_key_value,
                {
                    expiresIn: "240h",
                }
            );
            user.store_access_token = token;
            user.store_password = null;
            res.json({ status: 1, message: 'Success', data: user });
            return;
        }
        res.status(400).send("Invalid Credentials");

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
}

exports.getNearBuyStores = async function (req, res) {
    const { long, latt } = req.body;
    var METERS_PER_MILE = 1000
    try {
        const data = await Stores.find({ store_pin_location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ long,latt ] }, $maxDistance: 8 * METERS_PER_MILE } } })
        res.json({ status: 1, message: 'Success', data: data });
    } catch (e) {
        res.json({ status: 0, message: e.message});
    }
}


exports.myproducts = function (req, res) {
    const { user_id } = req.user
    Product.find({ storeId: user_id }, function (err, data) {
        if (err) {
            res.json({ status: 0, message: err.message });
            return
        }
        res.json({ status: 1, message: 'Success', data });
    });
};


exports.addproduct = async function (req, res) {
    const commisionFee = 1.15;
    const baseURL = "https://zainexpress.ae/assets/photos/display/"
    try {
        const { user_id } = req.user
        var product = new Product(req.body);
        const lastnumber = await Increment('products')
        product._id = 'ZX' + lastnumber
        
        const discountPercentage = product.store_discount_percentage ? product.store_discount_percentage : 0;
        const storeRate = product.store_rate;
        var sellingRate = product.store_rate;
        if (discountPercentage && discountPercentage > 0) {
            sellingRate = (sellingRate - (sellingRate * discountPercentage) / 100).toFixed(2);
        }
        const rateBeforeDiscount = (storeRate * commisionFee).toFixed(2);
        sellingRate = (sellingRate * commisionFee).toFixed(2);
        product.price = sellingRate;
        product.price_before_discount = rateBeforeDiscount;
        product.store_discount_percentage = discountPercentage;
        product.storeId = user_id;
        product.image = baseURL + product.image

        const item = await product.save();
        res.json({ status: 1, message: 'Success', data: item });
    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};

exports.single = async function (req, res) {
    try {
        const { user_id } = req.user
        const { product } = req.body
        const data = await Product.find({ _id: product, storeId: user_id }).select("+store_rate")
        const top = data[0]
        res.json({ status: 1, message: 'Success', data: top });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }

};

exports.UpdateImages = async function (req, res) {
    try {
        const baseL = "https://zainexpress.ae/assets/photos/details/"
        const { product, photos } = req.body
        const __product = await Product.findById(product);
        const __imagesArray = __product.images
        let emptyArray = []
        photos.forEach(item => {
            const pic = baseL + item
            emptyArray.push(pic)
        });
        const newImages = [...new Set([...__imagesArray, ...emptyArray])];
        const data = await Product.updateOne({ _id: product }, { "$set": { images: newImages } })

        res.json({ status: 1, message: 'Success', data });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }

};

exports.updateSingle = async function (req, res) {
    const commisionFee = 1.15;
    const baseURL = "https://zainexpress.ae/assets/photos/display/"
    try {
        const { _id, image, name, uom, origin, brand, store_rate, store_discount_percentage, height, width, weight, photoHasChanged } = req.body
        const discountPercentage = store_discount_percentage ? store_discount_percentage : 0;
        var sellingRate = store_rate;

        if (discountPercentage && discountPercentage > 0) {
            sellingRate = (sellingRate - (sellingRate * discountPercentage) / 100).toFixed(2);
        }
        const rateBeforeDiscount = (store_rate * commisionFee).toFixed(2);
        sellingRate = (sellingRate * commisionFee).toFixed(2);

        const data = await Product.updateOne({ _id }, {
            "$set": {
                price: sellingRate,
                price_before_discount: rateBeforeDiscount,
                store_discount_percentage: discountPercentage,
                image: photoHasChanged ? baseURL + image : image,
                name, uom, origin, brand, height, width, weight, store_rate
            }
        })

        res.json({ status: 1, message: 'Success', data });

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
