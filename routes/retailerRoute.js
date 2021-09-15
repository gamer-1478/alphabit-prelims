const express = require('express')
const router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')

module.exports = router;