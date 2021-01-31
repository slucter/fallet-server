const { response, db } = require('./../../helper/helper');
const { mail } = require('./../../helper/config')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');
require('dotenv').config()

module.exports = {
    sendMoney : async (req, res) => {
        try {
            const data = {
                sender_id : req.body.sender_id,
                receiver_id : req.body.receiver_id,
                msg: req.body.msg,
                amount: req.body.amount
            }
            const infoSender = await db('users').where({id: req.body.sender_id});
            const infoReceiver = await db('users').where({id: req.body.receiver_id});
            if(infoSender[0].saldo > req.body.amount){
                let senderMoney = parseInt(infoSender[0].saldo) - parseInt(req.body.amount);
                const minsaldo = await db('users').where({id: req.body.sender_id}).update({saldo: senderMoney})
                if(minsaldo > 0){
                    const send = await db('transaction').insert(data)
                    if(send.length > 0){
                        const receiveMoney = parseInt(infoReceiver[0].saldo) + parseInt(req.body.amount);
                        const plussaldo = await db('users').where({id: req.body.receiver_id}).update({saldo: receiveMoney})
                        if(plussaldo > 0) {
                            res.send('terkirim')
                        } else {
                            res.status(200).json(plussaldo)
                        }
                        res.status(200).json(plussaldo)
                    }
                    // res.status(200).json(send)
                } else {
                    res.send('saldo cukup tapi gagal update saldo')
                }
                // res.status(200).json(minsaldo)
            } else {
                res.send('saldo kurang')
            }
        }
        catch(error) {
            console.log(error)
        }
    },
    historyTrx: async (req, res) => {
        try {
            const user = req.query.user;
            const limit = req.query.limit;
            const page = req.query.page;
            const offsets = limit * page - limit;
            if(user){
                const count = await db('transaction')
                .where({sender_id: user})
                .orWhere({receiver_id: user}).orderBy('id', 'desc').count('receiver_id', {as: 'total'})
                const total = Math.ceil(count[0].total / limit)

                const history = await db('transaction')
                .innerJoin('users', 'transaction.sender_id', 'users.id')
                .select('transaction.*', 'users.name as name_sender', 'users.image').where({sender_id: user})
                .orWhere({receiver_id: user}).orderBy('id', 'desc').limit(limit).offset(offsets)
                response(res, {
                    totalPage: total,
                    limit: limit,
                    page: page,
                    result: history
                }, 200, null)
            } else {
                const history = await db('transaction')
                .innerJoin('users', 'transaction.sender_id', 'users.id')
                .select('transaction.*', 'users.name as name_sender').orderBy('id', 'desc')
                res.status(200).json(history)
            }
        }
        catch(error) {
            console.log(error)
        }
    }
}