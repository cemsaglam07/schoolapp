const jwt = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(401).send({error: "Authorization token required"});
    }
    const token = authorization.split(" ")[1];
    try {
        req.user = jwt.verify(token, process.env.TOKEN);
        next();
    } catch (err) {
        console.log(err);
        res.status(401).send({error: "Request is not authorized"});
    }
}

module.exports = requireAuth;