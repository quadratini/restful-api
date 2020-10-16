const jwt = require("jsonwebtoken");
require('dotenv').config();

function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user;
        next();
    });
}

module.exports(authenticateToken);