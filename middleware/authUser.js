const jwt = require('jsonwebtoken');
const { SECRET_TOKEN } = require("../config/crypto")


exports.verifyUserToken = async (req, res, next) => {

    try {
        const cookie = req.cookies.token;
        console.log("the cookie is", cookie)
        if (!cookie) {
            return res.status(401).json({
                msg: "Unauthorized user!"
            });
        }

        console.log(SECRET_TOKEN)
        jwt.verify(cookie, SECRET_TOKEN, (err, decode) => {
            res.send(err);
            if (!decode) {
                return res.status(401).json({
                    msg: "user not verified"
                });
            }
        });

        res.status(200).json({
            message: "Authorized User"
        })
        next();
    } catch (error) {
        console.log(error)
        res.status(400).send("Invalid Token");
    }
}


