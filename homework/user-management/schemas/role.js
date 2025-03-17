let mongoose = require ('mongoose')
let roleSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    },
},
{
    timestamp: true
})
module.exports = mongoose.model('role', roleSchema)