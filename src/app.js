const express = require("express");
const mongoose =require("mongoose");
const app = express();
const hbs = require("hbs");
// const async = require("hbs/lib/async");
const path = require("path");
port = process.env.PORT || 3000;
require("./db/conn")
const ragisters = require("./model/ragister");
const cookieparser = require("cookie-parser");
const auth = require("./middleware/auth");


const temlatepath= path.join(__dirname, "../templates/views");
const patipath= path.join(__dirname, "../templates/partials")

app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({extended:false}));

app.set("view engine", "hbs");
app.set("views", temlatepath);
hbs.registerPartials(patipath);

app.get( "/", (req,res) => {
    res.render("index");
})




app.get( "/wellcome", auth, (req,res) => {
    // console.log(`the cookies is ${req.cookies.jwt}`);
    res.render("wellcome");
});


app.get("/logout", auth, async(req,res) => {
    try {
        res.clearCookie("jwt");
        console.log("logout");
        await req.user.save();
        res.redirect("login");
    } catch (err) {
        
        res.send(err);
    }
})


app.get( "/login", (req,res) => {
    res.render("login");
});



app.post( "/login", async (req,res) => {
    try {
        
        const user = req.body.userid;
        const pass = req.body.pass;

        const userdetail = await ragisters.findOne({userid:user});
        const token = await userdetail.generateauthtoken();
        // console.log(token);
        res.cookie("jwt", token, {
            expires : new Date(Date.now()+30000),
            httpOnly:true,
        });
        if(userdetail.pass === pass)
        {
         
                res.render("index");
        }else{
            res.send("login detail is in correct");
        }


    } catch (err) {
        res.status(400).send("invalid email");
    }
});







// app.get( "/wellcome", (req,res) => {
//     // const name =  ragisters.findOne({userid:user});
//    try {
//         res.render("wellcome")
//    } catch (err) {
//        res.send(err)
//    }
//     // res.send(name.name);
// });







app.get( "/ragister", (req,res) => {
    res.render("ragister");
})


app.post( "/ragister",  async(req,res) => {
    try {
        const ragisterpeople = new ragisters({
            fname:req.body.fname,
            mname:req.body.mname,
            lname:req.body.lname,
            userid:req.body.userid,
            email:req.body.email,
            pass:req.body.pass
        });
      

        const token = await ragisterpeople.generateauthtoken();
        // console.log(token);

        res.cookie("jwt", token, {
            expires : new Date(Date.now()+30000),
            httpOnly:true
        });
        // console.log(cookie);
        const ragistered = await ragisterpeople.save();
        
        res.status(201).redirect("login");
    } catch (err) {
        res.status(400).send(err);
    }
})







app.listen(port, () => {
    console.log("connected");
})


