Stores = require('../Model/ModelStores');
Product = require('../Model/ModelProducts');
Categories = require('../Model/ModelMasters');
Product = require('../Model/ModelProducts');
Increment = require('../../utils/fetchLastNumber');
const jwtToken = require('../../utils/tokenHandler');


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TokenKey = require('../../middleware/secret_key');
const secret_key_value = TokenKey.key;


exports.register = async function (req, res) {
    try {

        const lastnumber = await Increment('stores')
        var store = new Stores(req.body);
        store._id = lastnumber
        store.store_password = await bcrypt.hash(store.store_password, 10);
        store.store_email = store.store_email.toLowerCase();
        const customer = await store.save();

        return res.json({ status: 1, message: 'Success', data: customer });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};

exports.login = async function (req, res) {
    try {
        const { store_email, store_password } = req.body;
        const user = await Stores.findOne({ store_email }).select("+store_password");

        if (user && (await bcrypt.compare(store_password, user.store_password))) {
            const token = jwtToken.createStoreToken(user)
            return res.json({ status: 1, message: 'Success', data: { token } });
        }
        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
}

exports.getNearBuyStores = async function (req, res) {
    const { long, latt } = req.body;
    console.log(long, latt);
    var METERS_PER_MILE = 1000
    try {
        const data = await Stores.find({ store_pin_location: { $nearSphere: { $geometry: { type: "Point", coordinates: [latt, long] }, $maxDistance: 108 * METERS_PER_MILE } } })
        res.json({ status: 1, message: 'Success', data: data });
    } catch (e) {
        res.json({ status: 0, message: e.message });
    }
}

exports.myproducts = async function (req, res) {
    try {
        const { store_id } = req.user
        const data = await Product.find({ product_store_id : store_id })
        return res.json({ status: 1, message: 'Success', data });

    } catch (e) {
        return res.json({ status: 0, message: e.message })
    }
};

exports.addproduct = async function (req, res) {
    const commisionFee = 1;
    try {
        const { store_id } = req.user
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
        product. product_status = false
        product. product_is_customisable = false
       
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
        const baseL = "https://zainexpress.ae/assets/photos/display/"
        const { product_id , product_image } = req.body
       
        const filter = { _id: product_id };
        const update = { product_image: baseL+product_image  };
        const result = await Product.findOneAndUpdate( filter, update );

        return res.json({ status: 1, message: 'Success', data: result });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }

};

exports.updateStatus = async function (req, res) {
    try {
        const { product_id , product_status } = req.body
       
        const filter = { _id: product_id };
        const update = { product_status  };
        const result = await Product.findOneAndUpdate( filter, update );

        return res.json({ status: 1, message: 'Success', data: result });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }

};

exports.updateSingle = async function (req, res) {
    const commisionFee = 1;
    try {
     

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

        console.log('xxxx',product);


        const data = await Product.findOneAndUpdate({ _id: product._id },product, { new: true })

       

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


