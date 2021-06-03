const jwt = require('jsonwebtoken');
const User = require("../model/user");

module.exports = (req, res, next) => {
    console.log(req.get('Cookie'))
    const tokenSession = req.get('Cookie').split(';')
        .filter(el => el.trim().startsWith('token='))[0]
        .split('=')[1];

    if (!tokenSession) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(tokenSession, 'tokenlogin');


    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    req.role = decodedToken.role;
    req.email = decodedToken.email;
    next();
};
