const express = require('express')
const router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')
const Product = require('../models/product')
const { fetch_get } = require('../reusable/misc_reuse')


/*router.get('/add_data', async (req, res) => {
    const response = await fetch_get('https://fakestoreapi.com/products/')
    await response.forEach(async element => {
        var prod = new Product({ title: element.title, description: element.description, price: element.price, category:element.category, image_: element.image, rating: { rate: element.rating.rate, count: element.rating.count } })
        await prod.save(function (err, prodcut) {
            if (err) return console.error(err);
            console.log(product.title + " saved to products collection.");
        });
    });
    res.send('hi')
})*/

router.post('/search_form', ((req, res) => {
const query = req.body.query;
Product.find({$or: [{title:{'$regex': query, "$options": "i"}}, {description: {'$regex': query, "$options":"i"}}]}).then((result)=> {
    const products = result;

    res.render('pages/type/consumer', {title: 'Consumer Dashboard', user:req.user, products:products})
})
}))


module.exports = router;