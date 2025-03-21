const loginSchema = require("../../model/adminModel/loginSchema");
const CryptoJS = require('crypto-js');
const Jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const hbs = require('nodemailer-express-handlebars');
const path = require("path");
const config = require("../../Config/Config")
const express = require('express');
const { checkOtp, generateOtp, getJwtToken } = require("../../service/loginHelper/loginhelper");
const { mailsend } = require("../../service/loginHelper/sendmailhelper");
const { status } = require("init");
const { encryptData, decryptData } = require("../../utils/securedata");
const exp = require("constants");
require("dotenv").config();




const register = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            res.json({
                status: false,
                message: "Cannot Empty email or pass",
            })
            return;
        }

        const endata = {
            _email: email,
            _password: password
        }
        const en = encryptData(endata)

        const de = decryptData(en)
        const { _email, _password } = de

        if (_email && _password) {
            const data = await loginSchema.findOne({ email: _email });
            if (data !== null) {
                res.send({ status: false, message: "All ready register" });
            } else {
                const encryptPass = encryptData(_password);
                const obj = new loginSchema({
                    email: _email,
                    password: encryptPass
                })
                const responce = await obj.save();

                if (responce) {
                    res.send({ status: true, message: "Register Success" });
                } else {
                    res.send({ status: false, message: "Register failed" });
                }
            }
        } else {
            res.send({ status: false, message: "Register failed" });
        }

    } catch (error) {
        console.log(error);
        res.send({ status: false, message: "Register failed" });
    }
}

const logIn = async (req, res) => {
    try {
        const { enData } = req.body
        const decryptcheck = decryptData(enData)
        const { email, password } = decryptcheck

        const data = await loginSchema.findOne({ email: email });

        if (data === null) {
            res.json({ status: false, message: "data is not found!" })
            return
        }

        const originalPass = decryptData(data?.password)
        // const pass = CryptoJS.AES.decrypt(data.password, process.env.SECRET_KEY);
        // const originalPass = pass.toString(CryptoJS.enc.Utf8);

        if (originalPass === password) {
            const isValid = await checkOtp({ start: data?.otpExp });

            if (isValid && data.otp !== 0) {
                res.json({
                    status: false,
                    message: "Please Enter Otp"
                })
                return
            } else {
                const GenrOtp = await generateOtp();
                const UpdateOtpData = {
                    otp: GenrOtp,
                    otpExp: new Date(),
                }

                const otpupdate = await loginSchema.findOneAndUpdate({ email: email }, { $set: UpdateOtpData }, { new: true, upsert: true }).exec();

                const resmail = await mailsend({
                    to: email,
                    otp: GenrOtp,
                    subject: 'Dex Login OTP',
                    method: "otp",
                })

                if (resmail.status) {
                    res.json({
                        status: true,
                        message: "OTP sent successfully!"
                    })
                    return;
                }
            }

        } else {
            res.send({ status: false, message: "Invalid password" });
            return;
        }

    } catch (err) {
        console.log(err);
        res.send({ status: false, message: "Err Login failed" });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { enData } = req.body;

        const decryptcheck = decryptData(enData)
        const { otp, email } = decryptcheck

        const adminData = await loginSchema.findOne({ email: email });

        if (adminData) {
            if (adminData.otp === Number(otp)) {
                const isValid = await checkOtp({ start: adminData?.otpExp });

                if (isValid) {

                    const Login_key = "login-secret-key";
                    const token = Jwt.sign({ AdminId: adminData._id }, Login_key, {
                        expiresIn: '30d',
                    });


                    const updatecre = {
                        otp: 0,
                        otpExp: new Date()
                    }

                    const updateval = await loginSchema.findOneAndUpdate(
                        { email: email },
                        { $set: updatecre },
                        { new: true, upsert: true }
                    ).exec();

                    if (updateval) {
                        res.json({
                            status: true,
                            message: "Login successfully!",
                            token: token
                        })
                    } else {
                        res.json({ status: false, message: "Login update failed..." })
                    }

                } else {
                    const updatecre = {
                        otp: 0,
                        otpExp: new Date()
                    }

                    // const updateval = await loginSchema.findOneAndUpdate(
                    //     { email: email },
                    //     { $set: updatecre },
                    //     { new: true, upsert: true }
                    // ).exec();

                    res.json({
                        status: false,
                        message: "Your OTP has expired!",
                    })
                }

            } else {
                res.json({
                    status: false,
                    message: "Please enter a valid OTP!"
                })
            }
        } else {
            res.json({
                status: false,
                message: "Admin doesn't exist!"
            })
        }

    } catch (error) {
        console.log("VerifyOtp error:", error);
        res.json({
            status: false,
            message: "Error VerifyOtp!"
        })
    }
}

const forgetpassword = async (req, res) => {
    try {
        const { enData } = req.body;

        const decryptcheck = decryptData(enData)
        const email = decryptcheck

        const emailusers = await loginSchema.findOne({ email: email });

        if (emailusers === null) {
            res.json({
                status: false,
                message: "Admin doesn't exist!",
            });
            return;
        }

        const secret_forget = 'forget-secret-key'
        const usertoken = Jwt.sign({ AdminId: emailusers._id }, secret_forget, {
            expiresIn: '2m',
        });

        const forget_link = `${config.Admin_FrontEnd_Url}resetpassword/${usertoken}`;
      
        const resmail = await mailsend({
            to: email,
            subject: "Resetpassword Success",
            method: "reset",
            token:forget_link,
          });

        // const resmail = await mailsend({
        //     to: email,
        //     otp: forget_link,
        //     subject: 'Forget password',
        //     method: "forget",
        // })

        if (resmail.status) {
            res.json({
                status: true,
                message: "Email sent successfully",
                userToken: usertoken
            })
        }
        else {
            res.json({ status: false, message: "something went error email" })
        }

    } catch (error) {
        console.log("forget-err", error)
        res.send({ status: false, message: "Err forget failed" });
    }
}


const resetpassword = async (req, res) => {
    try {
        const { enData } = req.body;
        const decryptcheck = decryptData(enData)
        const { token, password } = decryptcheck;

        const secret_forget = 'forget-secret-key'
        const verified = Jwt.verify(token, secret_forget);
        const userid = verified.AdminId;

        // const decrypt_password = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
        const decrypt_password = encryptData(password);

        const dtemail = await loginSchema.findById(userid);
        const email = dtemail.email;

        const updateval = await loginSchema.findByIdAndUpdate(
            { _id: userid, },
            { $set: { password: decrypt_password, } },
            { new: true, upsert: true }
        ).exec();

        if (updateval) {
            
            const Thankyoumail = await mailsend({
                to: email,
                subject: 'Resetpassword Success',
                method: "reset",
            })

            res.send({ status: true, message: "Password updated!" });
     
        } else {
            res.send({ status: false, message: "Password updated failed!" });
        }
    } catch (error) {
        console.log("resetpassword error", error);
        if (error instanceof Jwt.JsonWebTokenError) {
            res.json({ status: false, message: "invalid token" })
        } else if (error instanceof Jwt.TokenExpiredError) {
            res.json({ status: false, message: "expired token" })
            console.log("expired token");
        }
    }
}

const getisadmincheck = async (req, res) => {
    try {
        const data = await loginSchema.find().select({ _id: 1, email: 1 });
        if (data.length === 0) {
            res.json({status:false,message:"data not found"})
            return;
        }
        else {
            res.json({ status: true, message: "successful get", data: data })
        }
    } catch (error) {
        console.log("AdminTokenCheck", error);
        res.json({status:false,message:"AdminTokenCheck not found"})
    }
}
// const e = decryptData("U2FsdGVkX1+OQTqoLE1G8w9iWje4oN1eivKlWklO1Jk=");
module.exports = {
    register,
    logIn,
    verifyOtp,
    forgetpassword,
    resetpassword,
    getisadmincheck
}


