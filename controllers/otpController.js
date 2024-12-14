const nodemailer = require('nodemailer');
const Employee = require('../models/personModel');

let otpStore = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'popvibes.net@gmail.com',
        pass: 'gejl hpdl ergo qsdx'
    }
});

const otpController = {
    sendOTP: async (req, res) => {
        const { email, id } = req.body;

        try {
            const employee = await Employee.findByIdAndEmail(id, email);
            if (!employee) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'システムにIDが存在しません' 
                });
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            otpStore[email] = otp;

            try {
                await transporter.sendMail({
                    from: '"Your App" <popvibes.net@gmail.com>',
                    to: email,
                    subject: 'Your OTP Code',
                    text: `Your OTP code is: ${otp}`,
                });

                res.status(200).json({ 
                    success: true, 
                    message: 'OTPがメールに送信されました！' 
                });
            } catch (error) {
                res.status(500).json({ 
                    success: false, 
                    message: 'OTPを送信できません。もう一度お試しください！' 
                });
            }
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'データベースのクエリ中にエラーが発生しました' 
            });
        }
    },

    verifyOTP: (req, res) => {
        const { email, otp } = req.body;

        if (otpStore[email] === otp) {
            delete otpStore[email];
            res.status(200).json({ 
                success: true, 
                message: 'OTP認証に成功しました！' 
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: '無効なOTPです！' 
            });
        }
    }
};

module.exports = otpController;