let mongoose = require('mongoose');
let categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        default: ""
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
},
{
    timestamp: true,
})
module.exports = mongoose.model('category', categorySchema);