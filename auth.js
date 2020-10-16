const jwt = require("jsonwebtoken");
require('dotenv').config();

function isAdmin(req, res, next) {
    if (req.customer.role >= 2) {
        next();
    } else {
        res.status(500).json({'error': 'Permission denied'});
    }

}

function notLoggedIn(req, res, next) {
    if (!req.customer) next();
    else {
        res.status(403).json({'error': 'Already logged in'});
    }
}
function isLoggedIn(req, res, next) {
    if (req.customer) next();
    else {
        res.status(403).json({'error': 'Must be logged in'});
    }
}

function createToken(customer) {
    return jwt.sign(customer, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(authHeader);

    if (token == null) next();
    else {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            console.log(err);
            //if (err) return res.sendStatus(403)

            req.customer = decoded;
            next();

        });
    }


}

module.exports = {
    authenticateToken,
    notLoggedIn,
    isLoggedIn,
    createToken,
    isAdmin
};