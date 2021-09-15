const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const reqString = {type:String, required:true}
const reqNumber = {type:Number, required: true}
const productSchema = new Schema({
    "title": reqString,
    "description": reqString,
    "price": reqNumber,

})
const Product = mongoose.model('Product', productSchema)
module.exports = Product;