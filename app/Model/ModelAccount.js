var mongoose = require('mongoose');
// Setup schema
var contactSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});
// Export Contact model
var Contact = module.exports = mongoose.model('contact', contactSchema);


module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}