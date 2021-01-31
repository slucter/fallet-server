require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Port = process.env.SRV_PORT;
const RouteZwallet = require('./router/zwallet/index');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/upload/zw', express.static('upload'))
app.use('/zwallet-api', RouteZwallet)
app.use('*', (req, res) => {
    res.status(404).json({
        statusCode: '404',
        message: 'NOT FOUND!'
    })
})
app.listen(Port,() => console.log(`Server runing on Port : ${Port}`))