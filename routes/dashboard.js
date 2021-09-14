const express = require('express');
const router = express.Router()
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')

router.get('/', checkAuthenticated, async (req, res) => {
    res.render('pages/dashboard')
})

module.exports = router;