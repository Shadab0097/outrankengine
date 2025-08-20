const jwt = require('jsonwebtoken');
const User = require('../model/user');

const userAuth = async (req, res, next) => {
    try {
        // Get token from cookies
        const { token } = req.cookies // optional chaining for safety
        if (!token) {
            return res.status(401).json({ success: false, error: 'Please log in to continue.' });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
        }

        // Find user from DB
        const loggedInUser = await User.findById(decoded._id);
        if (!loggedInUser) {
            return res.status(404).json({ success: false, error: 'User does not exist.' });
        }

        // Attach user to request
        req.user = loggedInUser;
        next();
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, error: 'Authentication failed. Please try again later.' });
    }
};

module.exports = { userAuth };
