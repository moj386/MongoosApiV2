var mongoose = require('mongoose');
var admin_user = mongoose.Schema({
    _id: String,
    password: { type: String, required: true, select: false },
    name: String,
    mobile: String,
    role: String,
    status: Boolean,
    notification_tokens:[],
});

module.exports = mongoose.model('admin_user', admin_user);