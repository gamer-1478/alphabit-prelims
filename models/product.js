const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const reqString = { type: String, required: true }
const reqNumber = { type: Number, required: true }

const productSchema = new Schema({
    "title": reqString,
    "description": reqString,
    "price": reqNumber,
    "image_": reqString,
    'category': reqString,
    'rating': {
        'rate': reqNumber,
        'count': reqNumber
    },
    'count': {
        type: Number,
        required: false
    }
}, { collection: 'products' })

const Product = mongoose.model('Product', productSchema)
module.exports = Product;