const express = require('express')
const router = express.Router();
const trx = require('./../../controller/zwalletController/transactionController')

router
        .post('/send', trx.sendMoney)
        .get('/history', trx.historyTrx)

module.exports = router