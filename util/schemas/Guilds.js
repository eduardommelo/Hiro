const { Schema } = require('mongoose');
module.exports = new Schema({
    _id: {
        type: String
    },
    prefix: {
        type: String,
        default: process.env.PREFIX
    }
})