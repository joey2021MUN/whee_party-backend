const jwt = require('./jwt');

module.exports = function authenticateToken(req, res, next)  {
    var authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }
    const token = authHeader.split(' ')[1];
    const legit = jwt.verifyToken(token);
    if (!legit) {
        return res.sendStatus(403);
    }
    req.legit = legit;

    next();
}
