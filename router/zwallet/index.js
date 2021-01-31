const express = require('express');
const router = express.Router();
const User = require('./userRouter')
const trx = require('./transactionRouter')
router
    .use('/user', User)
    .use('/transaction', trx)

module.exports = router