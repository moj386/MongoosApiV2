const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TokenKey = require('../middleware/secret_key');
const secret_key_value = TokenKey.key;



const createCustomerToken = (data) => {

    const { _id, customer_name, customer_mobile, customer_email, customer_addresses } = data

    return jwt.sign(
        {
            customer_id:_id,
            customer_name,
            customer_mobile,
            customer_email,
            customer_address_verification: customer_addresses.length > 0,
            customer_name_verification: customer_name? true: false,
            type:'USER'
        },
        secret_key_value,
        {
            expiresIn: "2400h",
        }
    );
}

const createStoreToken = (data) => {

    const { _id, store_name, store_mobile, store_email } = data

    return jwt.sign(
        {
            store_id:_id,
            store_name,
            store_mobile,
            store_email,
            type:'STORE'
        },
        secret_key_value,
        {
            expiresIn: "2400h",
        }
    );
}

const createAdminToken = (data) => {

    const { _id, name, mobile, role  } = data

    return jwt.sign(
        {
            store_id:_id,
            name,
            mobile,
            role,
        },
        secret_key_value,
        {
            expiresIn: "2400h",
        }
    );
}




module.exports = {
    createCustomerToken,
    createStoreToken,
    createAdminToken
}