require('dotenv').config
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_MAILER,
        pass: process.env.PW_MAILER,
    }
});

module.exports = {
    mail: transporter
}