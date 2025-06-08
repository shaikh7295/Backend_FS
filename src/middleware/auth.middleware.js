const { verifyToken } = require('../utils/jwt');

const verifyAuth = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const userData = verifyToken(token);
        req.user = userData;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid Token' });
    }
};


module.exports = { verifyAuth }
