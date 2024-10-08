const nodemailer = require('nodemailer')
const { eventNames } = require('../../products')

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
    port: 465, // e.g., 587 for TLS
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // This is sometimes needed for self-signed certificates
    }
    
})

module.exports = transporter