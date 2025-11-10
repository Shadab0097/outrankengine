const express = require('express')
const { userAuth } = require('../middleware/userAuth')
const nodemailer = require('nodemailer')
const validator = require('validator')
const bcrypt = require('bcrypt');
const User = require('../model/user');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// Enhanced OTP store with expiration
const otpStore = {};
const profileRouter = express.Router()

// Fixed password encryption function
const passwordEncryption = async (password, saltRounds = 10) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Password encryption failed');
    }
}

const validateEditPassword = async (req) => {
    const newPassword = req.body.password

    if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Enter Strong Password 👁️👁️")
    }

    // Fixed: Added await and proper function call
    const newPasswordValid = await passwordEncryption(newPassword, 10)
    return newPasswordValid
}

// Helper function to clean expired OTPs
const cleanExpiredOTPs = () => {
    const now = Date.now();
    for (const email in otpStore) {
        if (otpStore[email].expiresAt < now) {
            delete otpStore[email];
        }
    }
}

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

profileRouter.post("/profile/forgot/password", async (req, res) => {
    try {
        const { fEmailId } = req.body
        const emailFromUser = fEmailId

        // Clean expired OTPs first
        cleanExpiredOTPs();

        if (!validator.isEmail(emailFromUser)) {
            throw new Error('Email is not valid')
        }

        // Find the user if present in DB
        const findUserByEmail = await User.findOne({ emailId: emailFromUser })
        if (!findUserByEmail) {
            throw new Error('Email is not registered')
        }

        function generateOTP() {
            return Math.floor(1000 + Math.random() * 9000).toString();
        }

        const createOtp = generateOTP()

        // Enhanced OTP storage with expiration (5 minutes)
        otpStore[emailFromUser] = {
            otp: createOtp,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes from now
            attempts: 0
        };

        // console.log(`🔐 OTP Generated for ${emailFromUser}: ${createOtp}`); // Debug log

        // const transport = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: "outrankengine100@gmail.com",
        //         pass: "rlre ging dzfy iqof"
        //     }
        // })

        // const mailOptions = {
        //     from: "outrankengine100@gmail.com",
        //     to: fEmailId,
        //     subject: "Your Reset Password OTP",
        //     text: `Your verification code is: ${createOtp}`,
        //     html: `<p>Hello 👋,</p>
        //        <p>Your OTP code is: <b>${createOtp}</b></p>
        //        <p>This code will expire in 5 minutes.</p>`
        // };

        async function sendMail() {
            try {
                const { data, error } = await resend.emails.send({
                    from: "OutrankEngine <noreply@outrankengine.online>",
                    to: [fEmailId],
                    subject: "Your Reset Password OTP",
                    text: `Your verification code is: ${createOtp}`,
                    html: `<p>Hello 👋,</p>
                   <p>Your OTP code is: <b>${createOtp}</b></p>
                   <p>This code will expire in 5 minutes.</p>`
                });

                if (error) {
                    console.error("Email error ❌", error);
                    return { success: false };
                }

                console.log("Email sent ✅", data);
                return { success: true };

            } catch (error) {
                console.error("Email error ❌", error);
                return { success: false };
            }
        }

        // sendMail();
        const emailResponse = await sendMail();


        if (!emailResponse.success) {
            delete otpStore[emailFromUser];
            throw new Error("Failed to send OTP email. Try again!");
        }


        // res.send("OTP sent to your email. Please verify it to reset password");


        // await transport.sendMail(mailOptions)



        res.send("OTP sent to your email. Please verify it to reset password")

    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(400).send(err.message)
    }
})

profileRouter.post('/profile/otp/verify', async (req, res) => {
    try {
        const { fEmailId, fOtp, newPassword } = req.body
        const emailId = fEmailId
        const userEnteredOtp = fOtp?.toString().trim();


        // console.log(`🔍 Verification attempt for ${emailId}`); 
        // console.log(`📧 Stored OTP data:`, otpStore[emailId]); 
        // console.log(`👤 User entered OTP: "${userEnteredOtp}"`); 

        // Clean expired OTPs
        cleanExpiredOTPs();

        // Check if OTP exists for this email
        if (!otpStore[emailId]) {
            throw new Error("OTP expired or not found. Please request a new OTP.");
        }

        const storedOtpData = otpStore[emailId];

        // Check if OTP has expired
        if (storedOtpData.expiresAt < Date.now()) {
            delete otpStore[emailId];
            throw new Error("OTP has expired. Please request a new OTP.");
        }

        // Increment attempt counter
        storedOtpData.attempts += 1;

        // Limit OTP attempts (max 3 attempts)
        if (storedOtpData.attempts > 3) {
            delete otpStore[emailId];
            throw new Error("Too many failed attempts. Please request a new OTP.");
        }

        // Compare OTPs (both as strings)
        if (storedOtpData.otp !== userEnteredOtp) {
            console.log(`❌ OTP Mismatch: Expected "${storedOtpData.otp}", Got "${userEnteredOtp}"`);
            throw new Error(`Invalid OTP. ${4 - storedOtpData.attempts} attempts remaining.`);
        }

        // console.log(`✅ OTP Verified successfully for ${emailId}`);

        // Find user by email
        const findUserByEmail = await User.findOne({ emailId });
        if (!findUserByEmail) {
            throw new Error("User not found");
        }

        // Validate new password
        if (!newPassword) {
            throw new Error("New password is required");
        }

        const oldPasswordHash = findUserByEmail.password

        // Compare new password with old password
        const comparePassword = await bcrypt.compare(newPassword, oldPasswordHash)
        if (comparePassword) {
            throw new Error('New password cannot be the same as your current password')
        }

        // Validate and encrypt new password
        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("Enter Strong Password 👁️👁️")
        }

        const newPasswordValid = await passwordEncryption(newPassword, 10)

        // Update password
        findUserByEmail.password = newPasswordValid
        await findUserByEmail.save()

        // Clear OTP after successful verification
        delete otpStore[emailId];

        // Log out user by clearing token
        res.cookie('token', null, { expires: new Date(Date.now()) })

        console.log(`🎉 Password updated successfully for ${emailId}`);
        res.send("Password updated successfully, please login again")

    } catch (err) {
        console.error('OTP verification error:', err);
        res.status(400).send(err.message)
    }
})

// Debug route to check stored OTPs (remove in production)
// profileRouter.get('/debug/otp', (req, res) => {
//     res.json(otpStore);
// });

module.exports = { profileRouter }
