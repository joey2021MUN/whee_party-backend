const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('./key/private.key', 'utf8');
const publicKey = fs.readFileSync('./key/public.crt', 'utf8');

module.exports = {
    generateAccessToken: function (email) {
        // expires after 30 minutes (1800 seconds = 30 minutes)
        return jwt.sign({
            email: email,
        }, privateKey, { 
            algorithm: 'RS256',
            expiresIn: '1800s',
        });
    },
    verifyToken: function (token) {
        try {
            return jwt.verify(token, publicKey, {
                algorithms: ['RS256'],
            });
        } catch (err) {
            return null;
        }
    },
    isJwtValid: function (token) {
        return this.verifyToken(token) !== null;
    },
}
