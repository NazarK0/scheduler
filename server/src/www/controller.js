const path = require('path')

module.exports.getMainPage = async (req, res) =>{
    res.render(path.join(__dirname,"..","global/views/layouts","main"),{title:"Головна"})
}