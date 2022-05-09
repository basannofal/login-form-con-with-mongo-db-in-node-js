const jwt = require("jsonwebtoken");
const ragister = require("../model/ragister");

const auth = async (req,res,next) => {
    try {
        
        const token = req.cookies.jwt;
        const verifyuser = jwt.verify(token, "mynameisnofalandmyfathernameisfarhan");
        console.log(verifyuser);

        const user = await ragister.findOne({_id: verifyuser._id});
        console.log(user);
        
        req.token = token;
        req.user = user;
        
        next();
    } catch (err) {
        res.redirect("login")
    }
}

module.exports = auth;