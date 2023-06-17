Admin = require('../Model/ModelAdmin');
const CustomerMaster = require('../Model/ModelCustomers');
const Orders = CustomerMaster.Orders;


const jwtToken = require('../../utils/tokenHandler');
const bcrypt = require('bcryptjs');

exports.register = async function (req, res) {
    try {

        const lastnumber = await Increment('admin_user')
        var store = new Admin(req.body);
        store._id = lastnumber
        store.password = await bcrypt.hash(store.password, 10);
        const customer = await store.save();
        return res.json({ status: 1, message: 'Success', data: customer });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }

};

exports.login = async function (req, res) {
    try {
        const { _id, password } = req.body;
        const user = await Admin.findById(_id).select("+password");
        
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwtToken.createAdminToken(user)
            return res.json({ status: 1, message: 'Success', data: { token } });
        }
        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
}



exports.viewPendingOrders = async function (req, res) {
    try {
        const orders = await Orders.find({ order_staus: 1 })
        .sort({ 'order_datetime': -1 })
        .limit(50)
        return res.json({ status: 1, message: 'Success', data: orders });

    } catch (err) {
        res.json({ status: 0, message: err.message });
    }
};



exports.updateFCMToken = async function (req, res) {
    try {
        const { token } = req.body
        const { store_id } = req.user
        const user = await Admin.findById(store_id)
        const { notification_tokens } = user ? user : {}
        let _tokens = notification_tokens ? notification_tokens : []
        if (!_tokens.includes(token)) {
            _tokens.push(token)
        }
        const filter = { _id: store_id };
        const update = { notification_tokens: _tokens };

        const result = await Admin.findOneAndUpdate(filter, update);
        return res.json({ status: 1, message: 'Success', data: result });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};

exports.getFCMToken = async function (store_id) {
    const { notification_tokens } = await Admin.findById(store_id)
    return notification_tokens
}
