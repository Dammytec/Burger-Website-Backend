const express = require('express')
const routes = express.Router()
const Register = require('../../register') 
const sendVerificationEmail = require('../verification/sendVerificationEmail')
const crypto = require('crypto');
const transporter = require('../verification/transporter')
const jwt = require('jsonwebtoken');
// Registration routes 

routes.post('/register' , async (req , res ) => {
   try {
    const { firstName , lastName , email , password} = req.body
    let user = await Register.findOne({email})

    if(user){
       return res.status(400).send({message:'user alredy exists'})
    }

    user = new Register({
       firstName,
       lastName,
       email,
       password
    })

    // generate verification token
    const verificationToken = user.generateVerificationToken()
    await user.save()
    // send verification to email

    await sendVerificationEmail(email, verificationToken)
    res.status(200).json({message:'registration successfuly'})
   } catch (error) {
     res.status(401).send({error: error.message})
   }
})
 

routes.get('/verify/:token', async (req ,res) => {
    try {
        const {token} = req.params
    const user = await Register.findOne({verificationToken: token , tokenExpires:{$gt : Date.now()}})

    if(!user){
        return res.status(401).json({message:'Invalid or expired verification token.'})
    }
    /// mark user as verified
    user.isVerified = true,
    user.verificationToken = null,
    user.tokenExpires = null

    await user.save()
    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
})

routes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await Register.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }
        console.log(user);
        
        // Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first.' });
        }
        console.log("Is user verified?", user.isVerified);

        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

routes.post('/reset-password', async (req , res) => {
  try {
    const {email} = req.body
    const user = await Register.findOne({email})
    if(!user){
        res.status(401).json({message: 'user not exist'})
    }

    const token = crypto.randomBytes(20).toString('hex')
    user.resetPasswordToken = token
    user.resetPasswordExpires = Date.now() + 3600000
    await user.save()

    const resetUrl = `https://burger-website-backend.vercel.app/reset-password/${token}`
    const mailOptions = {
        from : process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Request',
        text : `You are receiving this because you (or someone else) have requested a password reset for your account. Please click on the following link, or paste it into your browser to complete the process: ${resetUrl}`
    }

    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


routes.post('/reset-password/:token' , async (req , res) => {
   try {
    const user = await Register.findOne({
        resetPasswordToken : req.params.token,
        resetPasswordExpires : {$gt : Date.now()}
    })
    console.log(user);
    
    if(!user){
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    user.password = req.body.password,
    user.resetPasswordToken = null,
    user.resetPasswordExpires = null
    await user.save()

    res.status(200).json({ message: 'Password reset successful. You can now log in with your new password.' });
   } catch (error) {
    res.status(500).json({ error: error.message });
   }
})
module.exports = routes