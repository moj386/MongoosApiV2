const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TokenKey = require('../middleware/secret_key');
const secret_key_value = TokenKey.key;



const createCustomerToken = (data) => {

    const { _id, customer_name, customer_mobile, customer_email } = data

    return jwt.sign(
        {
            customer_id: _id,
            customer_name,
            customer_mobile,
            customer_email
        },
        secret_key_value,
        {
            expiresIn: "2400h",
        }
    );
}


module.exports = {
    createCustomerToken
}