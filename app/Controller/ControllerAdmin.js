Admin = require('../Model/ModelAdmin');
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
