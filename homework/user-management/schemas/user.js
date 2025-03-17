let mongoose = require ('mongoose')
let userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    },
    role:{
        type: mongoose.Types.ObjectId,
        ref: 'role',
        required: true
    }
},
{
    timestamp: true
})
module.exports = mongoose.model('user', userSchema)