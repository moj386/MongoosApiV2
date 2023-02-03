const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TokenKey = require('../middleware/secret_key');
const secret_key_value = TokenKey.key;



const createCustomerToken = (data) => {

    const { _id, customer_name, customer_mobile, customer_email } = data

    return jwt.sign(
        {
            user_id:_id,
            customer_name,
            customer_mobile,
            customer_email,
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




module.exports = {
    createCustomerToken,
    createStoreToken
}