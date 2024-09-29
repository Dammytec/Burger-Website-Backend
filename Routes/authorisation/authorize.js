const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token from header:', token); // Add this line
    const jwtSecret = process.env.ACCESS_TOKEN_SECRET;
     if (!token) {
        console.log('No token provided'); // Debugging line
        return res.sendStatus(403); // Forbidden if no token
    }
    if (!jwtSecret) {
        console.error('ACCESS_TOKEN_SECRET is not set'); // Debugging line
        throw new Error("ACCESS_TOKEN_SECRET must have a value");
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            console.error('Token verification failed:', err.message); // Add this line
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
