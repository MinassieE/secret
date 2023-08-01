
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB").then(()=>{
    console.log("Database connected!");
}).catch((err)=>{
    console.log(err);
})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res)=>{
    res.render("home");
})
app.get("/login", (req, res)=>{
    res.render("login");
})
app.get("/register", (req, res)=>{
    res.render("register");
})

app.post("/register", (req, res)=>{
    const userName = req.body.username;
    const password = req.body.password;
    const newUser = new User({
        email: userName,
        password: password
    })

    newUser.save().then(()=>{
        res.render("secrets");
    }).catch((err)=>{
        if(err){
            res.send("error has occured!");
            console.log(err);
        }
    })
})

app.post("/login", (req, res)=>{
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email: userName}).then((foundUser)=>{
        if(foundUser.password === password){
            res.render("secrets");
        } 
    }).catch((err)=>{
        if(err){
            res.send("error has occured!");
            console.log(err);
        } else {
            res.send("No user found by this email");
        }
    })
})

app.listen(3000, ()=>{
    console.log("server running ...")
})