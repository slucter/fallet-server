const { response, db } = require('./../../helper/helper');
const { mail } = require('./../../helper/config')
const bcrypt = require('bcryptjs');
const md5 = require('md5')
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid')
require('dotenv').config()

module.exports = {
    getById : async (req, res) => {
        try {
            const id = req.params.id;
            const user = await db('users').select('*').where({id : id});
            response(res, user, 200, null)
            
        } catch(eror) {
            console.log(error)
        }
    },
    getAll : async (req, res) => {
       try {
        const idu = req.query.idu;
        const search = req.query.search;
        const page = req.query.page;
        const limit = req.query.limit;
        const offset = limit * page - limit;

        if (search) {
            const count = await db('users').where('name', 'like', `%${search}%`).orWhere('phone', 'like', `%${search}%`).count('id', {as : 'total'});
            const total = Math.ceil(count[0].total / limit)
            const src = await db('users').select('*').where('phone', 'like', `%${search}%`).orWhere('name', 'like', `%${search}%`)
            .limit(limit).offset(offset);
            response(res, {
                totalPage: total,
                limit: limit,
                page: page,
                result: src
            }, 200, null)
        }
        if (!search) {
            const count = await db('users').count('id', {as : 'total'});
            const total = Math.ceil(count[0].total / limit)
            const get = await db('users').select('*').limit(limit).offset(offset);
            response(res, {
                totalPage: total,
                limit: limit,
                page: page,
                result: get
            }, 200, null)
        } 
       }
       catch(error) {
           console.log(error)
           response(res,{ message: 'Internal Server Error'},500,null)
       }
    },
    signupUser : async (req, res) => {
        try {
           const passCrypt = await new Promise((resolve, reject) => {
               bcrypt.hash(req.body.password, 10, (err, hash) => {
                   if(err){
                       reject(response(res, {message: 'bcrypt Error'}, 200, null))
                   } else {
                       resolve(hash);
                   }
               })
           })
           const name = req.body.email;
           const nameSplit = name.split('@')[0];
           const data = {
                name : `${nameSplit}`,
                username: req.body.username,
                email: req.body.email,
                password: passCrypt,
                role_user: 1,
                uuid: uniqid(req.body.username),
                pin: 0,
                image: `${process.env.BASE_URL}/upload/zw/default.jpg`,
            }
            const cekEmail = await db('users').where({email : req.body.email});
            const ceksUsername = await db('users').where({'username' : data.username});
            if(cekEmail.length == 1){
                response(res,{ message: 'Email Was Exist'},200,null)
            } else if(ceksUsername.length == 1){
                response(res,{ message: 'Username Was Exist'},200,null)
            } else {
                const register = await db('users').insert(data);
                response(res,{ message: 'Was Success', register},200,null)
            }

          
        }
        catch(error){
            console.log(error);
        }
    },
    loginUser : async (req, res) => {
        try {
            const data = {
                email: req.body.email,
                password:  req.body.password
            }
            const cekUserTrue = await db('users').where({email: data.email});
            const userData =  cekUserTrue[0];
            const randInt = (length) => {
                let res = ''
                let char = '1234567890'
                for(let i = 0; i < length; i++) {
                    res += char.charAt(Math.floor(Math.random() * char.length))
                }
                return res;
            }
            console.log(cekUserTrue.length);
            if(cekUserTrue.length > 0) {
                if(userData.is_verified === 0 ) {
                    userData.key_verif = md5(userData.email);
                    let rand = randInt(3)
                    const option = {
                        from: 'Fallet Corp',
                        to: userData.email,
                        subject: `Fallet verification #${rand}`,
                        text: `${process.env.URL_VUE_APP}/verify/${userData.key_verif}`,
                    }
                    mail.sendMail(option, (err, info) => {
                        if(err){
                            response(res, { response: 'User Not Verified', msg: 'send failed'}, 200, null)
                        } else {
                            const tok = jwt.sign({id: userData.id, email: userData.email, role: userData.role_user, pin: userData.pin}, process.env.JWT_KEY);
                            response(res, { response: 'User Not Verified', msg: 'mail sended',key : userData.key_verif, token: tok }, 200, null)
                        }
                    })
                } else {
                    const crypt = await new Promise((resolve, reject) => {
                        bcrypt.compare(data.password, userData.password, (err, hash) => {
                            if(err) { 
                                reject(response(res, { msg: 'Bcryt Error'}, 200, null))
                            } else {
                                resolve(hash)
                            }
                        })
                    })
                    // console.log(crypt)
                    if(crypt) {
                        delete userData.password;
                        const token = jwt.sign({id: userData.id, email: userData.email, role: userData.role_user, pin: userData.pin}, process.env.JWT_KEY);
                        userData.token = token
                        response(res, { msg: 'success', userData}, 200, null)
                    } else {
                        response(res, { msg: 'Failed'}, 200, null)
                    }
                }
            } else {
                response(res, { msg : 'Failed'}, 200, null)
            }
            
        }
        catch(error){
            console.log(error)
        }
    },
    patch_verified: async (req, res) => {
        const token = req.params.token;
        const data = jwt.verify(token, process.env.JWT_KEY)
        const pveriv = await db('users').where({id : data.id}).update({is_verified: 1})
        if(pveriv > 0) {
            response(res, { msg: 'Success'}, 200, null)
        } else {
            response(res, { msg: 'Failed'}, 200, null)
        }
    },
    patchImage: async (req, res) => {
        try {
            const data = {
                image: `${process.env.BASE_URL}/upload/zw/${req.file.filename}`,
            }
            const patch = await db('users').where({id: req.params.id}).update(data);
            response(res,{ msg: 'success', patch},200,null)
        } catch(error) {
            console.log(error);
        }
    },
    patchUserSetting : async (req, res) => {
        try {
            const data = {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone
            }
            const user = req.params.id;
            const update = await db('users').where({id: user}).update(data)
            response(res,{ message: 'Success Update User!', update},200,null)
        } catch(error) {
            console.log(error)
        }
    },
    updateUser: async (req, res) => {
        try {
            const user = req.params.id;
            const data = {
                name : req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
                role_user: req.body.role_user,
                uuid: req.body.uuid,
                pin: req.body.pin,
                image: req.body.image
            }
            const update = await db('users').where({id: user}).update(data);
            response(res,{ message: 'Success Update User!', update},200,null)
        }
        catch(error) {
            console.log(error)
        }
    },
    setUserPin: async (req, res) => {
        try {
            const idUser = req.tokenData.id;
            console.log(req.tokenData)
            const patchPin = await db('users').where({id: idUser}).update({pin: req.body.newPin});
            if(patchPin == 0) {
                return response(res,{ message: 'Failed Update Pin!'},200,null)
            } else {
                return response(res,{ message: 'Success Update Pin!', patchPin},200,null)
            }
        }
        catch(error) {
            console.log(error);
            response(res,{ message: 'Failed', error},200,null)
        }
    },
    sendLinkPass: (req, res) => {
        db('users').where({email : req.body.email}).then((result) => {
            if(result.length == 0){
                response(res,{ message: 'Email tidak terdaftar!'},200,null)
            } else {
                const option = {
                    from: 'irhashjeh@gmail.com',
                    to: result[0].email,
                    subject: req.body.subject,
                    text: req.body.text,
                }
                mail.sendMail(option, (err, info) => {
                    if(err){
                        response(res, err, 401, null);
                    } else {
                        response(res, info, 200, null);
                    }
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    },
    changeNewPassword: (req, res) => {
        const opp = req.body.oldPassword;
        const npp = req.body.newPassword;
        const token = req.mytoken;
            jwt.verify(token, process.env.JWT_KEY, (err1, dataToken) => {
                if(err1) return response(res,{ msg: 'Jwt Error' }, 200, null) // Error token handled by midleware
                db('users').where({'id': dataToken.id}).then((result) => {
                    const data = result[0]
                    bcrypt.compare(opp, data.password, (err2, hash1) => {
                        if (err2) return response(res,{ msg: 'BcryptCompare Error', err2 }, 200, null)
                        if (!hash1) return response(res,{ msg: 'password not match' }, 200, null)
                        bcrypt.hash(npp, 10, (err3, hash2) => {
                            if(err3) return response(res,{ msg: 'BcryptHash Error' }, 200, null)
                            db('users').where({id: dataToken.id}).update({password: hash2}).then((result) => {
                                if (result === 1) return response(res,{ msg: 'success' }, 200, null)
                                return response(res,{ msg: 'failed' }, 200, null)
                            })
                            .catch((error) => {
                                response(res,error, 200, null)
                            })
                        })
                    })
                })
                .catch((error) => {
                    response(res,error, 200, null)
                })
            });
        
    },
    deleteUser: async (req, res) => {
        try {
            const id = req.params.id;
            const del = await db('users').where({id: id}).del();
            if(del == 0) response(res,{ message: 'Failed Delete User!', del},200,null)
            if(del > 0) response(res,{ message: 'Success Delete User!', del},200,null)
        }
        catch(error) {
            console.log(error)
        }
    }
}