const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,  
    }, 'access', {expiresIn: '14d'});
}

const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,  
    }, 'access', {expiresIn: '14d'});
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
}