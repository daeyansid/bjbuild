// authMiddleware.js
const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Check if the Authorization header exists
    if (!authHeader) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
    }

    try {
        // Directly use the token from the Authorization header
        const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);

        // Attach the decoded user info to the request object
        req.user = decoded;
        next();
    } catch (err) {
        // Respond with a 403 status if token verification fails
        return res.status(403).json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
};

module.exports = ensureAuthenticated;
