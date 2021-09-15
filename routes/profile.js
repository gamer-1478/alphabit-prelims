const express = require('express');
const router = express.Router()
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')

router.get('/', checkAuthenticated, async (req, res) => {
    var type_of = new Promise((resolve, reject) => {
        if (req.user.type_of_user == true) {
            resolve("Retailer")
        }
        else {
            resolve("Consumer")
        }
    }).then((result) => { return result })

    res.render('pages/profile', { title: "Profile", "user": req.user, "usertype":await type_of})
})
module.exports = router;