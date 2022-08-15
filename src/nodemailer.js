const nodemailer = require('nodemailer');

const transporte = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    // secure: false,
    auth: {
        user: 'dev.testes@outlook.com.br',
        pass: '123g456g'
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporte;