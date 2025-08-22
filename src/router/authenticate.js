const express = require('express');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const nodemailer = require('nodemailer');
const { fromAbortSignal } = require('puppeteer');

const authRouter = express.Router();

// Utility function for sending errors
function sendError(res, message, statusCode = 400) {
    return res.status(statusCode).json({ success: false, error: message });
}

// Generate JWT token
function generateToken(userId) {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// SIGNUP
let pendingUsers = {}; // temporary store for OTP -> user data

// SIGNUP with OTP
authRouter.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, emailId, password, otp } = req.body;

        // If OTP is not provided → Step 1: Generate OTP
        if (!otp) {
            // Validation
            if (!firstName || !lastName) return sendError(res, 'Please enter your first and last name 📛');
            if (!validator.isEmail(emailId)) return sendError(res, 'Please enter a valid Email 📩');
            if (!validator.isStrongPassword(password)) return sendError(res, 'Please enter a strong password 🔑');

            // Check if user already exists
            const existingUser = await User.findOne({ emailId });
            if (existingUser) return sendError(res, 'User already exists. Please log in.', 409);

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Generate OTP
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

            // Store user data temporarily (keyed by email)
            pendingUsers[emailId] = { firstName, lastName, emailId, passwordHash, otp: generatedOtp };


            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "outrankengine100@gmail.com",
                    pass: "rlre ging dzfy iqof"
                }
            })

            const mailOptions = {
                from: "outrankengine100@gmail.com",
                to: emailId,
                subject: "Your OTP Verification Code",
                text: `Your verification code is: ${generatedOtp}`,
                html: `<p>Hello 👋,</p>
         <p>Your OTP code is: <b>${generatedOtp}</b></p>
         <p>This code will expire in 5 minutes.</p>`
            };
            await transport.sendMail(mailOptions)

            console.log(`OTP for ${emailId}: ${generatedOtp}`);

            return res.status(200).json({
                success: true,
                message: 'OTP sent to your email. Please verify 📩'
            });
        }


        const pendingUser = pendingUsers[emailId];
        if (!pendingUser) return sendError(res, 'No pending signup found ❌', 404);

        if (pendingUser.otp !== otp) return sendError(res, 'Invalid OTP 🚫');

        // Create user in DB
        const user = new User({
            emailId: pendingUser.emailId,
            firstName: pendingUser.firstName,
            lastName: pendingUser.lastName,
            password: pendingUser.passwordHash,
            isVerified: true,
        });

        await user.save();

        // Remove from pending list
        delete pendingUsers[emailId];

        // Generate token
        const token = generateToken(user._id);
        res.cookie('token', token, {
            secure: true,
            sameSite: 'Lax',
            httpOnly: true,
            path: '/',
            expires: new Date(Date.now() + 48 * 3600000) // 8 hours
        });

        return res.status(201).json({
            success: true,
            message: 'Signup successful after OTP verification ✅',
            data: user
        });
    } catch (err) {
        console.error(err);
        return sendError(res, 'Something went wrong during signup.', 500);
    }
});

//LOGIN 
authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Find user
        const registeredUser = await User.findOne({ emailId });
        if (!registeredUser) return sendError(res, 'User not found. Please sign up first.', 404);

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, registeredUser.password);
        if (!isPasswordValid) return sendError(res, 'Invalid credentials.', 401);

        // Generate token
        const token = generateToken(registeredUser._id);
        res.cookie('token', token, {
            secure: true,
            sameSite: 'Lax',
            httpOnly: true,
            path: '/',
            expires: new Date(Date.now() + 48 * 3600000) // 8 hours
        });

        res.json({ success: true, message: 'Login successful ✅', data: registeredUser });
    } catch (err) {
        console.error(err);
        return sendError(res, 'Something went wrong during login. Please try again later.', 500);
    }
});

//LOGOUT
authRouter.post('/logout', (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0),
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });
    res.json({ success: true, message: 'Logout successful 🚪' });
});

module.exports = { authRouter };
