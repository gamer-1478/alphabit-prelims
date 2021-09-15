const express = require('express')
const router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')
const Product = require('../models/product')


router.post('/sellForm', async (req, res) => {
    console.log(req.body)
    var prod = new Product({ title: req.body.title, description: req.body.description, price: req.body.price, category: req.body.category, image_: req.body.image, rating: { rate: 5, count: 0 } })
    await prod.save(function (err, product) {
        if (err) { 
            res.send({ message: 'Product Failed To Be Added', sucess: false, error:err })
            return console.error(err) 
        };
        res.send({ message: 'Product Added Successfully', sucess: true })
        console.log(product.title + " saved to products collection.");
    });
})

module.exports = router;