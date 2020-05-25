const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    f_name: String,
    s_name: String,
    th_name: String,
    phone: String,
    local:{
        email:String,
        password:String
    }
})

module.exports = mongoose.model('user',userSchema)