const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    if(!token) {
        return res.status(401).json({
            success: false,
            message: 'Authorization token is required.'
        })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decode.userId;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        })
    }
}

module.exports = authMiddleware;