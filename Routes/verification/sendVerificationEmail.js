const transporter = require('../verification/transporter')

const sendVerificationEmail = async (email , token) => {
    console.log('Before sending email...');
    const verificationUrl = `https://burger-website-backend.vercel.app/verify/${token}`;

    console.log('Verification URL:', verificationUrl);
    console.log('Creating mail options...')
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email Address',
        text: `Please verify your email by clicking on the following link: ${verificationUrl}. The link will expire in 24 hours.`
    };
    console.log('Sending email...');

    const retries = 3; // Number of retry attempts

    for (let i = 0; i < retries; i++) {
        try {
            await transporter.sendMail(mailOptions);
            console.log('Verification email sent successfully.');
            break;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === retries - 1) throw error;  // Throw error after last attempt
        }
    }
};


module.exports = sendVerificationEmail