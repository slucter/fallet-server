const jwt = require('jsonwebtoken')
const multer = require('multer');
const { checkout } = require('../router/zwallet');
const { response } = require('../helper/helper')
const path = require('path');
require('dotenv');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'-irhash-'+file.originalname)
    }
  })
  
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1 },
    fileFilter: (req, file, cb) => {
        if(!file.originalname.match(/\.(JPG|jpg|PNG|png|GIF|gif|JPEG|jpeg)$/)){
            return cb({ code: 'EXTENSION_DENIED'}, false)
        }
        cb(undefined, true)
    }
 })

  
module.exports = {
    authorization: (req, res, next) => {
        let token = req.headers.authorization;
        if(token){
            token = token.split(' ')[0];
            jwt.verify(token, process.env.JWT_KEY, (err, result) => {
                if(err){
                    return res.status(403).json({
                    status: 'forbidden',
                    message: err
                    })
                } else if(result.role == 1){
                    req.mytoken = token
                    req.tokenData = result
                    next()
                } else {
                   return res.status(403).json({
                        status: 'forbidden',
                        message: 'Can not access!'
                    })
                }
            })
        } else {
            return res.status(403).json({
                status: 'forbidden',
                message: 'Login first!'
            })
        }
    },
    upload: upload,
    validation: (err, req, res, next) => {
       response(res, { msg: err.code }, 200, null)
       next()
    }
}