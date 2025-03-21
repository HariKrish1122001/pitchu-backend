const nodemailer = require("nodemailer")
const config = require("../../Config/Config")
const express = require('express');
const hbs = require('nodemailer-express-handlebars');
const path = require("path");
require("dotenv").config();



exports.mailsend = async (mailDatas = {}) => {
    const { to, otp, subject, method,token } = mailDatas;
    const otpString = otp?.toString();

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_AUTH_USERMAIL,
            pass: process.env.SMTP_AUTH_PASSWORD,
        }
    })
    try {
        const viewPath = path.resolve(__dirname, '../../view/');
        transporter.use('compile', hbs({
            viewEngine: {
                extName: '.handlebars',
                layoutsDir: viewPath,
                defaultLayout: false,
                express
            },
            viewPath: viewPath,
            extName: '.handlebars',
        }))


        var mailOptions = {
            from: process.env.SMTP_AUTH_USERMAIL,
            // to: to,
            to: to,
            subject: subject,
            template: '',
            context: {}
            // html: emailtemp,
        };

        switch (method) {
            case 'otp':
                mailOptions.template = 'otp';
                mailOptions.context = {
                    otp: otpString
                };
                break;
            case 'forget':
                mailOptions.template = 'main';
                mailOptions.context = {
                    link: otpString
                };
            case 'reset':
                mailOptions.template = 'reset';
                mailOptions.context = {
                    token: token 
                };
                break;
                case 'Register':
                mailOptions.template = 'Register';
                mailOptions.context = {
                    token: token 
                };
                break;
            default:
                throw new Error('Invalid method');
        }

        const info = await transporter.sendMail(mailOptions);

        if (info.response) {
            return {
                status: true,
                message: "Email sent successfully",
            };
        } else {
            return {
                status: false,
                message: "something went error email",
            };
        }

    } catch (error) {
        console.log("Error sending mail:", error);
        return {
            status: false,
            message: "Error sending mail"
        }
    }
}

