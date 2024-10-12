const JWT = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
    //Get the user from jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "please authenticate using a valid token" })
    }
    try {
        const data = JWT.verify(token, process.env.JWT_SECRETE);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "please authenticate using a valid token" })
    }


}



module.exports = fetchuser;