const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const registerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    verificationToken: {
        type: String,
        required: false,
    },
    tokenExpires: {
        type: Date,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
});

// Password hashing before saving the user
registerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Generate verification token
registerSchema.methods.generateVerificationToken = function () {
    const token = crypto.randomBytes(20).toString('hex');
    this.verificationToken = token;
    this.tokenExpires = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours
    return token;
};

// Compare input password with the hashed password in the database
registerSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
