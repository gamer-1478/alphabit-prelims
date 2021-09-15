const express = require('express')
const router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')
const Product = require('../models/product')
const { fetch_get } = require('../reusable/misc_reuse')
const products = {}

/*router.get('/add_data', async (req, res) => {
    const response = await fetch_get('https://fakestoreapi.com/products/')
    await response.forEach(async element => {
        var prod = new Product({ title: element.title, description: element.description, price: element.price, category:element.category, image_: element.image, rating: { rate: element.rating.rate, count: element.rating.count } })
        await prod.save(function (err, book) {
            if (err) return console.error(err);
            console.log(book.name + " saved to bookstore collection.");
        });
    });
    res.send('hi')
})*/

module.exports = router;