const express = require('express')
const router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')

router.get('/', (req, res) => {
res.render('pages/type/retail', {"title":'Retailer Dashboard', "user":req.user})
})


module.exports = router;