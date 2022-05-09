const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userschema = new mongoose.Schema({
    fname:{
        type:String
    },
    mname:{
        type:String
    },
    lname:{
        type:String
    },
    userid:{
        type:String
    },
    email:{
        type:String
    },
    pass:{
        type:String
    },
    tokens : [{
        token:{
            type:String,
            required:true
        }
    }]
});



userschema.methods.generateauthtoken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()},"mynameisnofalandmyfathernameisfarhan");
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        console.log(token);
        return token;
    } catch (err) {
        res.send("the error part" );
        console.log("the error part");
    }
}


const ragisterdata = new mongoose.model("userdata", userschema);

module.exports = ragisterdata;