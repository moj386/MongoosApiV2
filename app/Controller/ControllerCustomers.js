const retry = require('async-retry');
CustomerMaster = require('../Model/ModelCustomers');
Products = require('../Model/ModelProducts');
Stores = require('../Model/ModelStores');

const Stripe = require("stripe");
const stripe = Stripe('sk_test_51JyCUYBT956xZwz7nei3IIxmGn8dWakQ4tNhI6zAaJ6HoNYrA38lm9KlDtZCiKWLCE1sQaA1afVtqPPvVDbuwY8G00two4ZMaZ');

const jwtToken = require('../../utils/tokenHandler');

const apiKey = 'e9907a376d362dbabe3a07e13c2925ac';
const apiSecret = '215952874d24c537c040fcd6d2200739';
var smsglobal = require('smsglobal')(apiKey, apiSecret);
Increment = require('../../utils/fetchLastNumber');

const Customer = CustomerMaster.Customer;
const Address = CustomerMaster.CustomerAddress;
const Orders = CustomerMaster.Orders;


//// CUSTOMER LOGIN

exports.login_register = async function (req, res) {
    var payload =
    {
        origin: 'test',
        destination: '00971552108371',
        message: 'This is a test message'
    }

    try{
        const data  = await smsglobal.sms.send(payload)
        res.json({ status: 1, message: data });
    }catch(e){
        res.json({ status: 1, message: e });
    }
   
    
    // smsglobal.sms.send(payload, function (error, response) {
    //     return res.json({ status: 1, message: error, response });
    // });

   

}

exports.register = async function (req, res) {

    try {
        const { customer_id } = req.user;
        const { customer_name } = req.body;
        const filter = { _id: customer_id };
        const update = { customer_name };

        const result = await Customer.findOneAndUpdate(filter, update);
        result.customer_name = customer_name
        const token = jwtToken.createCustomerToken(result)
        return res.json({ status: 1, message: 'Success', data: { token } });

    } catch (err) {
        return res.json({ status: 0, message: err.message });
    }

};

exports.otp_request = async function (req, res) {
    const { customer_mobile } = req.body;
    const customer_otp = Math.floor(Math.random() * 90000) + 10000;
    var now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    now = new Date(now);
    try {
        await Customer.updateOne({ customer_mobile }, { $set: { customer_otp, customer_otp_expiry: now } }, { upsert: true });
        res.json({ status: 1, message: 'Success', data: { otp: customer_otp } });
    } catch (e) {
        res.json({ status: 0, message: e.message });
    }
}

exports.login = async function (req, res) {
    try {

        const { customer_mobile, otp } = req.body;
        const result = await Customer.findOne({ customer_mobile }).select("+customer_otp").select("+customer_otp_expiry")
        if (!result) {
            return res.json({ status: 0, message: "User not fond!" });
        }

        const { customer_otp_expiry, customer_otp } = result
        const now = new Date();
        if (String(customer_otp) !== String(otp)) {
            return res.json({ status: 0, message: "Wrong OTP" });
        }
        if (customer_otp_expiry < now) {
            return res.json({ status: 0, message: "OTP has expired, please try again" });
        }
        const token = jwtToken.createCustomerToken(result)
        return res.json({ status: 1, message: 'Success', data: { token } });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
}

exports.loginstatus = async function (req, res) {

    const { user_id } = req.user
    console.log(user_id);

    res.status(200).send("Welcome 🙌 ");
}

exports.verifyLocation = async function (req, res) {

    // const { curr_long, curr_latt } = req.body;

    // var METERS_PER_MILE = 1000
    // try {
    //     const data = await Stores.find({ store_pin_location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ long,latt ] }, $maxDistance: 8 * METERS_PER_MILE } } })
    //     res.json({ status: 1, message: 'Success', data: data });
    // } catch (e) {
    //     res.json({ status: 0, message: e.message});
    // }

}

//////////// products ///////////

exports.products = async function (req, res) {
    try {
        const { store_id } = req.body
        const data = await Product.find({ product_store_id: store_id })
        return res.json({ status: 1, message: 'Success', data });

    } catch (e) {
        return res.json({ status: 0, message: e.message })
    }
};

exports.see_store = async function (req, res) {
    try {
        const { store_id } = req.body
        const store = await Stores.findById(store_id);
        return res.json({ status: 1, message: 'Success', data: store });
    } catch (error) {
        return res.json({ status: 0, message: error.message });
    }

};


//// CUSTOMER ADDRESS

exports.newAddress = async function (req, res) {
    try {
        const { customer_id } = req.user;
        var __defaultAddress = false;
        const { title, line1, line2, line3, addres_latitude, addres_longitude, area, state, country, mobile, pin_location } = req.body


        const __customer = await Customer.findById({ _id: customer_id });
        let { customer_addresses } = __customer ? __customer : {};
        if (customer_addresses.length === 1) {
            __defaultAddress = true;
        }

        customer_addresses.push({ title, line1, line2, line3, addres_latitude, addres_longitude, area, state, country, mobile, defaultAddress: __defaultAddress, pin_location })

        await Customer.update({ _id: __customer._id }, { "$set": { customer_addresses } })
        return res.json({ status: 1, message: 'Success', data: customer_addresses });


    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};
exports.viewAddress = async function (req, res) {
    try {

        const { customer_id } = req.user;
        const __customer = await Customer.findById(customer_id);
        let { customer_addresses } = __customer;
        return res.json({ status: 1, message: 'Success', data: customer_addresses });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};
exports.viewAddress_single = async function (req, res) {
    try {

        const { customer_id } = req.user;
        const __customer = await Customer.findById({ _id: customer_id });
        let { customer_addresses } = __customer;
        const single = customer_addresses.filter(x => x.defaultAddress === true)[0]
        
        if(!single){
            const _single = customer_addresses[0]
            return res.json({ status: 1, message: 'Success', data: _single });
        }
    
        return res.json({ status: 1, message: 'Success', data: single });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};
exports.deleteAddress = async function (req, res) {
    try {
        var __defaultAddress = false;
        const { customer_id } = req.user;
        const { address_id } = req.body;

        const __customer = await Customer.findById({ _id: customer_id });
        const { customer_addresses } = __customer;

        let filter = customer_addresses.filter(x => x._id.toHexString() !== address_id)

        if (filter && filter.length === 1) {
            __defaultAddress = true;
            filter[0].defaultAddress = __defaultAddress
        }

        const ret = filter.find(x=> x.defaultAddress === true)

        await Customer.updateOne({ _id: customer_id }, { "$set": { customer_addresses: filter } })

        return res.json({ status: 1, message: 'Success', data: ret });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};
exports.updateAddress = async function (req, res) {
    try {
        const { customer_id } = req.user;
        const { address_id } = req.body;
        const __customer = await Customer.findById({ _id: customer_id });
        const { customer_addresses } = __customer;
        let filter = customer_addresses.filter(x => x._id === address_id)



        var address = new Address(req.body);
        address.save(function (err) {
            if (err)
                res.json({ status: 0, message: err.message });
            else
                res.json({ status: 1, message: 'Success', data: token });
        });
    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};
exports.setDefaultAddress = async function (req, res) {
    try {
        const { customer_id } = req.user;
        const { address_id } = req.body;
        let __customer = await Customer.findById(customer_id);
        const { customer_addresses } = __customer;
        
        const ook = customer_addresses.reduce((acc, item)=>{
            const { _id } = item
            if( _id.toHexString() === address_id ){
                item.defaultAddress= true
            }else{
                item.defaultAddress= false
            }
            acc.push(item)
            return acc
        },[])
        __customer.customer_addresses = ook
        const result = await __customer.save()
        return res.json({ status: 1, message: 'Success', data: result });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};

//// CUSTOMER CART


exports.addCart = async function (req, res) {
    try {
        const { customer_id } = req.user;
        const product = new Products(req.body)
        const __customer = await Customer.findById(customer_id);
        const { customer_cart_products } = __customer;
        let removeOtherStores = customer_cart_products.filter(x => String(x.product_store_id) === String(product.product_store_id))
        const quantity = product.product_cart_qty;
        removeOtherStores = removeOtherStores.filter(x => x._id !== product._id)
        if (quantity > 0)
            removeOtherStores.push(product)

        Customer.updateOne({ _id: __customer._id }, { "$set": { customer_cart_products: removeOtherStores } }, function (err) {
            if (err)
                return res.json({ status: 0, message: err.message });
            else
                return res.json({ status: 1, message: 'Success', data: __customer });
        });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};
exports.viewCart = async function (req, res) {
    try {
        const { customer_id } = req.user;
        const __customer = await Customer.findById(customer_id);
        const { customer_cart_products } = __customer;

        const total_amount = customer_cart_products.reduce((acc, item) => {
            const { product_cart_qty, product_price } = item
            return acc + (product_cart_qty * product_price)

        }, 0)
        const __single = customer_cart_products ? customer_cart_products[0] : {}
        const { product_store_id } = __single ? __single : {}

        const store = await Stores.findById(product_store_id);
        const { store_delivery_fee, store_latitude, store_longitude, store_name } = store ? store : {}
        const __products = customer_cart_products.sort((a, b) => new Date(b.product_created_ts) - new Date(a.product_created_ts));
        const data = {
            productsCart: __products,
            cartAmount: total_amount,
            grand_total: total_amount,
            item_total: total_amount,
            vat_total: total_amount * 0.05,
            store_delivery_fee,
            store_latitude,
            store_longitude,
            store_name,
            store_id: product_store_id
        }

        return res.json({ status: 1, message: 'Success', data: data });

    } catch (err) {
        console.log(err);
        res.json({ status: 0, message: err.message });
    }

};
exports.deleteCart = async function (req, res) {
    try {
        const { customer_id } = req.user;
        const __customer = await Customer.findById(customer_id);

        Customer.update({ _id: __customer._id }, { "$set": { customer_cart_products: [] } }, function (err) {
            if (err)
                res.json({ status: 0, message: err.message });
            else
                res.json({ status: 1, message: 'Success', data: __customer });
        });
    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
};


//// ORDERS

exports.addOrder = async function (req, res) {
    try {
        const { customer_id } = req.user;
        const order = new Orders(req.body)
        const __customer = await Customer.findById(customer_id);
        const { customer_cart_products } = __customer;

        const __store = await Stores.findById(order.order_store_id);


        const lastnumber = await Increment('orders')

        let cartTotalPrice = 0;
        let cartBeforeDiscountPrice = 0;
        let cartCouponPrice = 0;
        let cartNetAmount = 0;
        let cartDeliveryCharges = 0;


        customer_cart_products.forEach(item => {
            cartTotalPrice = + item.product_cart_amount;
            cartBeforeDiscountPrice = + item.product_price_before_discount
        });
        cartNetAmount = (cartTotalPrice - cartCouponPrice).toFixed(2);

        order._id = lastnumber;
        order.order_gross_amount = cartTotalPrice;
        order.order_discount_amount = (cartBeforeDiscountPrice - cartTotalPrice).toFixed(2);
        order.order_delivery_charges = cartDeliveryCharges;
        order.order_service_charges = 0;
        order.order_net_amount = cartNetAmount;

        order.order_customer_id = customer_id;
        order.order_customer_email = __customer.customer_email;
        order.order_customer_mobile = __customer.customer_mobile;
        order.order_products = customer_cart_products
        order.order_store_address = __store


        const fnSaveOrder = () => order.save();
        const fnClearCart = () => Customer.updateOne({ _id: customer_id }, { "$set": { customer_cart_products: [] } });
        const numRetry = { retries: 3 }

        await retry(fnSaveOrder, numRetry).then(async data => {
            await retry(fnClearCart, numRetry)
            res.json({ status: 1, message: 'Success', data });
        }).catch((error) => {
            res.json({ status: 0, message: error.message })
        });
    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
};
exports.viewOrder = async function (req, res) {
    try {
        const { order_id } = req.body;
        const order = await Orders.findById(order_id)
        return res.json({ status: 1, message: 'Success', data: order });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
};
exports.viewOrderHome = async function (req, res) {
    try {
        const { customer_id } = req.user;
        const order = await Orders.find({ order_customer_id: customer_id })
            .sort({ 'order_datetime': -1 })
            .limit(25)

        let store_list = []    
        order.map(item => {
            const { order_store_address } = item
            store_list.push(order_store_address)
        })
        const key = '_id';
        const uniqueStore = [...new Map(store_list.map(item => [item[key], item])).values()]



        // const list_store = order.reduce((acc, item) => {
        //     const { order_store_address } = item

        //     console.log(order_store_address);

        //     return acc.push( order_store_address)
        // }, [])


        // const store_list = await Orders.aggregate([
        //     { $match: { order_customer_id: customer_id } },
        //     { $sort: { order_datetime: -1 } },
        //     { $group: { _id: '$order_store_address._id', max: { 
        //         store_name: '$order_store_address.store_name',
        //         store_image: '$order_store_address.store_image',
        //      } } },
        //     { $limit: 5 }
        // ])


        // const store_list = await Orders.aggregate([
        //     { $match: { order_customer_id: customer_id } },
        //     { $sort: { order_datetime: -1 } },
        //     { $group: { _id: '$order_store_id', count: { $sum: 1 } } },
        //     { $limit: 5 }
        // ])

        // const list_store = store_list.reduce((acc, item) => {
        //     const { _id } = item
        //     console.log('list_store', _id);
        //     return acc.push(_id)
        // }, [])


        return res.json({ status: 1, message: 'Success', data: uniqueStore });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
};
exports.updateOrderInstruction = async function (req, res) {
    try {
        const { order_id, instructions } = req.body;
        const filter = { _id: order_id };
        const update = { order_cooking_instructions: instructions };
        const result = await Orders.findOneAndUpdate(filter, update);
        return res.json({ status: 1, message: 'Success', data: result });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
};
exports.viewOrders = async function (req, res) {
    try {
        const { customer_id } = req.user;
        const orders = await Orders.find({ order_customer_id: customer_id })
        return res.json({ status: 1, message: 'Success', data: orders });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
};
exports.repeatOrder = async function (req, res) {
    try {
        const { customer_id } = req.user
        const { order_id } = req.body;
        const order = await Orders.findById(order_id)
        const { order_products } = order

        const __customer = await Customer.findById(customer_id);

        Customer.updateOne({ _id: __customer._id }, { "$set": { customer_cart_products: order_products } }, function (err) {
            if (err)
                return res.json({ status: 0, message: err.message });
            else
                return res.json({ status: 1, message: 'Success', data: order_products });
        });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
};



////// payments

exports.makePayment = async function (req, res) {
    try {

        const { customer_id } = req.user
        const { canSaveCard, order_net_amount } = req.body
        let ephemeralKey = {}

        const customer_data = await Customer.findById(customer_id)
        let { customer_pay_token } = customer_data ? customer_data : {}

        if (!customer_pay_token && canSaveCard) {
            const customer = await stripe.customers.create();
            customer_pay_token = customer.id
            await Customer.updateOne({ _id: customer_id }, { customer_pay_token })
        }
        if (canSaveCard) {
            ephemeralKey = await stripe.ephemeralKeys.create(
                { customer: customer_pay_token },
                { apiVersion: '2022-08-01' }
            )
        }

        let pay_intent = {
            amount: Math.round(order_net_amount * 100),
            currency: "AED",
            setup_future_usage: 'on_session',
            automatic_payment_methods: { enabled: true }
        }

        if (canSaveCard) {
            pay_intent = Object.assign({}, pay_intent, { customer: customer_pay_token })
        }

        const paymentIntent = await stripe.paymentIntents.create(pay_intent);

        const clientSecret = paymentIntent.client_secret;
        return res.json({
            status: 1, message: "Payment initiated", data: {
                paymentIntent: clientSecret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer_pay_token
            }
        });
    } catch (err) {
        return res.json({ status: 0, message: err.message })
    }

}

///// WISHLIST    

exports.add_wishlist_products = async function (req, res) {

    try {
        let added = false
        const { customer_id } = req.user;
        const { product_id } = req.body;
        const __customer = await Customer.findById(customer_id);
        let { customer_wishlist_products } = __customer


        if (customer_wishlist_products.includes(product_id)) {
            customer_wishlist_products = customer_wishlist_products.filter(x => x !== product_id)

        } else {
            customer_wishlist_products.push(product_id)
            added = true
        }

        Customer.updateOne({ _id: customer_id }, { "$set": { customer_wishlist_products } }, function (err) {
            if (err)
                return res.json({ status: 0, message: err.message });
            else
                return res.json({ status: 1, message: 'Success', data: added });
        });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
}

exports.add_wishlist_restaurant = async function (req, res) {

    try {
        let added = false
        const { customer_id } = req.user;
        const { product_id } = req.body;
        const __customer = await Customer.findById(customer_id);
        let { customer_wishlist_restaurant = [] } = __customer

        if (customer_wishlist_restaurant.includes(product_id)) {
            customer_wishlist_restaurant = customer_wishlist_restaurant.filter(x => x !== product_id)
        } else {
            customer_wishlist_restaurant.push(product_id)
            added = true
        }

        Customer.updateOne({ _id: customer_id }, { "$set": { customer_wishlist_restaurant } }, function (err) {
            if (err)
                return res.json({ status: 0, message: err.message });
            else
                return res.json({ status: 1, message: 'Success', data: { added } });
        });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
}


exports.view_wishlist_products = async function (req, res) {

    try {
        const { customer_id } = req.user;
        const __customer = await Customer.findById(customer_id);
        let { customer_wishlist_products } = __customer

        const products = await Products.find({ _id: customer_wishlist_products })

        return res.json({ status: 1, message: 'Success', data: products });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
}

exports.view_wishlist_restaurant = async function (req, res) {

    try {
        const { customer_id } = req.user;
        const __customer = await Customer.findById(customer_id);
        let { customer_wishlist_restaurant } = __customer

        console.log('customer_wishlist_restaurant', customer_wishlist_restaurant);

        const restaurant = await Stores.find({ _id: customer_wishlist_restaurant })

        console.log('restaurant', restaurant);

        return res.json({ status: 1, message: 'Success', data: restaurant });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
}

exports.search = async function (req, res) {

    const { keyword, long, latt } = req.body;
    var METERS_PER_MILE = 1000
    const where_location = { store_pin_location: { $nearSphere: { $geometry: { type: "Point", coordinates: [latt, long] }, $maxDistance: 108 * METERS_PER_MILE } }, store_keywords: keyword }
    const where_search = { product_store_pin_location: { $nearSphere: { $geometry: { type: "Point", coordinates: [latt, long] }, $maxDistance: 108 * METERS_PER_MILE } }, product_keywords: keyword }

    try {
        const store = await Stores.find(where_location)
        const products = await Products.find(where_search)

        res.json({ status: 1, message: 'Success', data: { store, products } });
    } catch (e) {
        res.json({ status: 0, message: e.message });
    }
}