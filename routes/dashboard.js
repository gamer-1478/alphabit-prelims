const express = require('express');
const router = express.Router()
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')

router.get('/', checkAuthenticated, async (req, res) => {

    //user is of type retailer. 
    if (req.user.type_of_user == true) {
        res.render('pages/type/retail', { "title": 'Retailer Dashboard', "user": req.user })
    }

    //if user is of type consumer
    else {
        Product.find().then((result) => {
            if (result.length) {
                console.log(result.length)
            }
        })
        res.render('pages/type/consumer', { "title": 'Consumer Dashboard', "user": req.user, "products": products })
    }
})

module.exports = router;