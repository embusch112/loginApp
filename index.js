const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const Speakeasy = require("speakeasy");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session"); 

const bcrypt = require("bcrypt");
const saltRound = 10;


const app = express();

app.use(express.json());


app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    key: "userId",
    secret: "super",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24 * 1000
    }
}))

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "1234",
    database: "loginsystem", 
});

app.post("/toptgen", (req,res) => {
    const username = req.body.username;
    var secret = Speakeasy.generateSecret({length: 20})
    var secret_32 = secret.base32;
    // db.query("INSERT INTO users (OTP) VALUES (?) WHERE username = ?", [secret_32,username])
    // update DemoTable1569 set StudentId='Carol_321' where StudentName='Carol Taylor';
    db.query("UPDATE users SET OTP=? WHERE username=?",[secret_32,username])
    console.log(secret_32);
    res.send(secret_32);

});




app.post("/register", (req, res) => {

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password,saltRound,(err,hash)=>{

        if(err){
            console.log(err);
        }

        db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username,email],

        (err,result) => {
            if(err){
                res.send({err: err});
            }
            if(result.length > 0){
                res.send({message: "Username or email already exists"});
            }   else{
                db.query("INSERT INTO users (email,username,password,OTP) VALUES (?,?,?,null)", [email,username,hash],
                (err,result) => {
                    console.log(err);
                },
                req.session.user = result,
                console.log(req.session.user),
                res.send(result)
                );
            }
        }
    
        );
    })

});

app.get("/login", (req,res)=>{
    if(req.session.user){
        res.send({loggedIn: true,user: req.session.user})
    }   else{res.send({loggedIn: false})

    }
})

app.get("/logout", function(req, res){
    res.clearCookie('userId');
    res.send('cookie foo cleared');
 });


app.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const code = req.body.code;

    db.query("SELECT * FROM users WHERE username = ?;", [username],
    (err,result) => {
        
        if(err){
            res.send({err: err});
        }  
        if(result.length > 0){
            if(result[0].OTP){
                let x = Speakeasy.totp.verify({
                    secret: result[0].OTP,
                    encoding: "base32",
                    token: code,
                    window: 1
                })
                if(x == true){
                    bcrypt.compare(password,result[0].password, (err,response)=> {
                        if(response){
                          req.session.user = result
                          console.log(req.session.user);
                          res.send(result)
                        }  else{
                          res.send({message: "Incorrect Username or Password"});
                        }
                      })
                }   else{
                    res.send({message: "Incorrect code"});
                }
            }   else{
                bcrypt.compare(password,result[0].password, (err,response)=> {
                    if(response){
                      req.session.user = result
                      console.log(req.session.user);
                      res.send(result)
                    }  else{
                      res.send({message: "Incorrect Username or Password"});
                    }
                  })
            }





        }   else{
            res.send({message: "Incorrect Username or Password"});
        }
        
    }
    );
});



app.listen(3001, () => {
    console.log("Listening at Port: 3001");
});