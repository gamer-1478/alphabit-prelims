const express = require('express');
const router = express.Router()
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')

router.get('/', checkAuthenticated, async (req, res) => {
    const user = req.user
    if(user.type_of_user==true){
            res.redirect('/retailer')
    } else {
        res.redirect('/consumer')
    }
})

module.exports = router;