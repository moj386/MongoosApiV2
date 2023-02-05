const retry = require('async-retry');
CustomerMaster = require('../Model/ModelCustomers');
Products = require('../Model/ModelProducts');
Stores = require('../Model/ModelStores'); 


const jwtToken = require('../../utils/tokenHandler');

const apiKey = '13858cd2ca9a13126b43356621191d9e';
const apiSecret = 'c576cb5416a5d7062c25ecf84aac1310';
var smsglobal = require('smsglobal')(apiKey, apiSecret);


const Customer = CustomerMaster.Customer;
const Address = CustomerMaster.CustomerAddress;
const Orders = CustomerMaster.Orders;





//// CUSTOMER LOGIN

exports.login_register = async function (req, res) {
    var payload = 
    {
        origin: '00971552108371',
        destination: '00971526406502',
        message: 'This is a test message'
    }

    smsglobal.sms.send(payload, function (error, response) {
        console.log(response);
        console.log(error);
    });

    res.json({ status: 1, message: 'Success' });

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
        const data = await Product.find({ product_store_id : store_id })
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
       return  res.json({ status: 0, message: error.message });
    }

};





//// CUSTOMER ADDRESS

exports.newAddress = async function (req, res) {
    try {
        const { customer_id } = req.user;
        var __defaultAddress = false;
        const { title, line1, line2,line3, addres_latitude,addres_longitude, area, state, country, mobile, pin_location } = req.body


        const __customer = await Customer.findById({_id: customer_id});
        let { customer_addresses } = __customer ? __customer : {};
        if (customer_addresses && customer_addresses.lnegth === 0)
            __defaultAddress = true;
        customer_addresses.push({ title, line1, line2, line3, addres_latitude,addres_longitude, area, state, country, mobile, defaultAddress: __defaultAddress, pin_location })

        const result = await Customer.update({ _id: __customer._id }, { "$set": { customer_addresses } })
        return res.json({ status: 1, message: 'Success', data: __customer });


    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};

exports.viewAddress = async function (req, res) {
    try {
       
        const { customer_id } = req.user;
        const __customer = await Customer.findById({_id: customer_id});
        let { customer_addresses } = __customer;
        return res.json({ status: 1, message: 'Success', data: customer_addresses });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};

exports.deleteAddress = async function (req, res) {
    try {
        var __defaultAddress = false;
        const { customer_id } = req.user;
        const { address_id } = req.body;
        const __customer = await Customer.findById({_id: customer_id});
        const { customer_addresses } = __customer;

        //console.log(customer_addresses);

        let filter = customer_addresses.filter(x=> x._id === address_id)
        
        if (filter && filter.lnegth === 0){
            __defaultAddress = true;
            filter[0].defaultAddress =  __defaultAddress
        }
        
        await Customer.update({ _id: customer_id }, { "$set": { customer_addresses: filter } })

        return  res.json({ status: 1, message: 'Success', data: __customer });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};

exports.updateAddress = async function (req, res) {
    try {
        const { customer_id } = req.user;
        const { address_id } = req.body;
        const __customer = await Customer.findById({_id: customer_id});
        const { customer_addresses } = __customer;
        let filter = customer_addresses.filter(x=> x._id === address_id)



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


//// CUSTOMER CART


exports.addCart = async function (req, res) {
    try {
        const { customer_id } = req.user;
        const product = new Products(req.body)
        const __customer = await Customer.findById(customer_id);
    
        var { customer_cart_products } = __customer;
        const quantity = product.product_cart_qty;
        customer_cart_products = customer_cart_products.filter(x => x._id !== product._id)

        if (quantity > 0)
        customer_cart_products.push(product)

        Customer.updateOne({ _id: __customer._id }, { "$set": { customer_cart_products } }, function (err) {
            if (err)
                res.json({ status: 0, message: err.message });
            else
                res.json({ status: 1, message: 'Success', data: __customer });
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
 
        const total_amount =  customer_cart_products.reduce((acc, item) =>{
            const { product_cart_qty, product_price } = item
            return acc + (product_cart_qty * product_price)
        
          }, 0)
        const __single = customer_cart_products? customer_cart_products[0]:{}
        const { product_store_id } = __single? __single: {}

        const store = await Stores.findById(product_store_id);
        const { store_delivery_fee, store_latitude, store_longitude } = store ? store : {}

        const data = {
            productsCart: customer_cart_products,
            cartAmount: total_amount,
            grand_total: total_amount,
            item_total: total_amount,
            vat_total: total_amount * 0.05,
            store_delivery_fee,
            store_latitude,
            store_longitude
        }

        console.log(data);

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
        const { user_id } = req.user;
        const order = new Orders(req.body)
        const __customer = await Customer.findById(user_id);
        const { cartItems } = __customer;
        const shippingFee = 15;

        let cartTotalPrice = 0;
        let cartBeforeDiscountPrice = 0;
        let cartCouponPrice = 0;
        let cartNetAmount = 0;
        let deliveryCharges = 0;

        cartItems.forEach(item => {
            cartTotalPrice = + item.rate;
            cartBeforeDiscountPrice = + item.rateBeforeDiscount;
            deliveryCharges = + item.FreeShipping ? 0 : 1;
        });


        cartNetAmount = (cartTotalPrice - cartCouponPrice).toFixed(2);

        order.grossAmount = cartTotalPrice;
        order.discountAmount = (cartBeforeDiscountPrice - cartTotalPrice).toFixed(2);
        order.deliveryChargesStore = 0

        order.customer_id = user_id;
        order.customer_email = __customer.email;
        order.customer_mobile = __customer.mobile;
        order.customer_name = __customer.name;

        const fnSaveOrder = () => order.save();
        const fnClearCart = () => Customer.update({ _id: user_id }, { "$set": { cartItems: [] } });
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


function CalculateShippingFee(freeShipping, productSize) {
    if (freeShipping) {
        return 0
    }

    if (productSize === 1) { /// 15 AED


    }


    return 0;
}



// exports.view = function (req, res) {

//     Product.find({category: req.params.product_id }, function (err, data) {
//         if (err)
//             res.send(err);
//         res.json({
//             message: 'Contact details loading..',
//             data: data
//         });
//     });
// };


// // Handle update contact info
// exports.update = function (req, res) {
//     Contact.findById(req.params.contact_id, function (err, contact) {
//         if (err)
//             res.send(err);
//         contact.name = req.body.name ? req.body.name : contact.name;
//         contact.gender = req.body.gender;
//         contact.email = req.body.email;
//         contact.phone = req.body.phone;
// // save the contact and check for errors
//         contact.save(function (err) {
//             if (err)
//                 res.json(err);
//             res.json({
//                 message: 'Contact Info updated',
//                 data: contact
//             });
//         });
//     });
// };
// // Handle delete contact
// exports.delete = function (req, res) {
//     Contact.remove({
//         _id: req.params.contact_id
//     }, function (err, contact) {
//         if (err)
//             res.send(err);
//         res.json({
//             status: "success",
//             message: 'Contact deleted'
//         });
//     });
// };