require('dotenv').config()
const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'localhost',
      user : process.env.DB_USERNAME,
      password : process.env.DB_PASS,
      database : 'zwalletdb'
    }
  });
module.exports = {
    response : (res, result, status, err) => {
        const resResult = {};
        resResult.status = 'succes';
        resResult.statusCode = status;
        resResult.result = result;
        resResult.err = err || null;
        return res.status(status).json(resResult);
    },
    db : knex,

    
}