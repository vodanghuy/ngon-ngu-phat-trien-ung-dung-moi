let mongoose = require('mongoose')
let userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: [true, "Username must be unique"],
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    fullName:{
        type: String,
        default: ""
    },
    avatarURL:{
        type: String,
        default: ""
    },
    status:{
        type: Boolean,
        default: false
    },
    role:{
        type: mongoose.Types.ObjectId,
        ref: 'role'
    },
    loginCount:{
        type: Number,
        default: 0,
        min: 0
    }
},
{
    timestamps: true
})
module.exports = mongoose.model("user", userSchema)