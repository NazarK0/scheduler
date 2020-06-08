const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    category:String,
    cafedra: String,
    group:String,
    local:{
        email:String,
        password:String
    }
})

module.exports = mongoose.model('user',userSchema)
