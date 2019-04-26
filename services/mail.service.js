'use strict'

const nodemailer = require('nodemailer');
const process = require('process');

let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    tls: { rejectUnauthorized: false },
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

let mailOptions = function(subject, recipients, message){
    return {
        from: `RedDinámica <${process.env.EMAIL}>`,
        to: recipients,
        subject: subject,
        html: `<p>${message}</p>`
    };
}

exports.sendMail = function(subject, recipients, message){
    
    let emailData = mailOptions(subject, recipients, message);

    transporter.sendMail(emailData, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    transporter.close();
};