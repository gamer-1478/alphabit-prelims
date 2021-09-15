const express = require('express')
const router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')
const Product = require('../models/product')
const https = require('https')
const products = {}
router.get('/', (req, res) => {
    Product.find().then((result)=> {
        if(result.length) {
            console.log(result)
        } else {
            https.get('https://fakestoreapi.com/products/1', (resp)=> {
                resp.on('data', (data)=> {
                    const products = JSON.parse(data);
                })
            })

        }
    })
    res.render('pages/type/consumer', {"title":'Consumer Dashboard', "user":req.user, "products": products})
})


module.exports = router;