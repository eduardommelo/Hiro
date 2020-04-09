const { Schema } = require('mongoose');
module.exports = new Schema({
    _id: {
        type: String
    },
    roles: {
        type: Array,
        default: [] // ['owner', 'subowner', 'operator', 'developer', 'supervisor', 'designer']
    },
})