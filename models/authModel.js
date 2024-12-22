const nodemailer = require('nodemailer');
const otpStore = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'popvibes.net@gmail.com',
        pass: 'your-email-password',
    },
});

module.exports = {
    sendOtp: (email) => {
        return new Promise((resolve, reject) => {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            otpStore[email] = otp;

            transporter.sendMail({
                from: '"Your App" <popvibes.net@gmail.com>',
                to: email,
                subject: 'Your OTP Code',
                text: `Your OTP code is: ${otp}`,
            }, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    },

    verifyOtp: (email, otp) => {
        return new Promise((resolve) => {
            if (otpStore[email] === otp) {
                delete otpStore[email];
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
};
