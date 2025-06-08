const jwt = require('jsonwebtoken');
const SECRET = process.env.MY_SECRET;

generateToken = (data) => {
    return jwt.sign(data, SECRET, { expiresIn: '1h' });
};

verifyToken = (token) => {
    return jwt.verify(token, SECRET);
};

module.exports = { generateToken, verifyToken }
