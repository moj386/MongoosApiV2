var mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
    _id: {type: String},
    timeDesc: String,
    timeEnd: Number,
    timeState: String,
    status: { type: Boolean, default: true}
}); 

module.exports = timeSchema