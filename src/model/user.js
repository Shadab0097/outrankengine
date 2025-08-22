
const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        trim: true,

    },
    lastName: {
        type: String,
        require: true,
        trim: true,

    },
    emailId: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('please write valid email')
            }
        }

    },
    password: {
        type: String,
        require: true,
        trim: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('write strong password')
            }
        }

    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    token: {
        type: Number,
        default: 10000
    }

}, { timestamps: true })


module.exports = mongoose.model('User', userSchema)