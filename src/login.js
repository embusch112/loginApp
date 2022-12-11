import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Axios from 'axios';
import ReactTooltip from 'react-tooltip';
import "./index.css"
import "./App.css"
function App(){
const navigate = useNavigate();

const [emailReg, setEmailReg] = useState('');
const [usernameReg, setUsernameReg] = useState('');
const [passwordReg, setPasswordReg] = useState('');

const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const[code,setCode] = useState('');

const[userCreateStatus,setUserCreateStatus] = useState('');
const[loginStatus, setLoginStatus] = useState('');

Axios.defaults.withCredentials = true;

function charIsLetter(char) {
  if (typeof char !== 'string') {
    return false;
  }
  return /^[a-zA-Z]+$/.test(char);
}
function charIsNumber(char) {
  if (typeof char !== 'string') {
    return false;
  }
  return /^[0-9]+$/.test(char);
}
function charIsSpecial(char) {
  if (typeof char !== 'string') {
    return false;
  }
  return /^[!@#\$%\^\&*\)\(+=._-]+$/.test(char);
}

const register = () => {
  let passSize = false;
  let passLetter = false;
  let passNum = false;
  let passSpecial = false;
  let emailSize = true;
  let userSize = true;
  
  if(emailSize.length < 45){
    emailSize = true;
  }
  if(userSize.length < 30){
    userSize = true;
  }

  if(passwordReg.length > 6){
    passSize = true;
  }

  for (var i = 0; i < passwordReg.length; i++) {
    if(charIsLetter(passwordReg.charAt(i))){
      passLetter = true;
      break;
    }
  }

  for (var i = 0; i < passwordReg.length; i++) {
    if(charIsNumber(passwordReg.charAt(i))){
      passNum = true;
      break;
    }
  }

  for (var i = 0; i < passwordReg.length; i++) {
    if(charIsSpecial(passwordReg.charAt(i))){
      passSpecial = true;
      break;
    }
  }
  console.log(passSize,passLetter,passNum,passSpecial,emailSize,userSize)
  if(passSize === true && passLetter === true && passNum === true && passSpecial === true && emailSize === true && userSize === true){

    Axios.post("http://localhost:3001/register", {
      email: emailReg,
      username: usernameReg,
      password: passwordReg,
      }).then((response)=> {
        
        if(response.data.message){
            setUserCreateStatus(response.data.message);
        } else{
          //successful usercreation
          document.cookie = usernameReg;
          navigate("/dashboard");
        }
  
      });
  }else{
    setUserCreateStatus("Password does not meet standards")
  }

};


const login = () => {
  Axios.post("http://localhost:3001/login", {
    email: emailReg,
    username: username,
    password: password,
    code: code
    }).then((response)=> {

      if(response.data.message){
        setLoginStatus(response.data.message);
        console.log(loginStatus)
      } else{
        //successful login
        setLoginStatus(response.data[0].username);
        document.cookie = username;
        navigate("/dashboard");
      }

    });
};

useEffect(()=>{
  Axios.get("http://localhost:3001/login").then((response)=>{
        if(response.data.loggedIn === true){
          navigate("/dashboard");
        }
  })
}, [])

  return(
    <div className="App">

        <div>
        <h1>Registration</h1>
        <label>Email</label>
        <input type="text" placeholder="Email..." onChange={(e)=>{setEmailReg(e.target.value)}}/>
        <h6>{"\n"}</h6>
        <label>Username</label>
        <input type="text" placeholder="Username..." onChange={(e)=>{setUsernameReg(e.target.value)}}/>
        <h6>{"\n"}</h6>
        <label>Password</label>
        <input type="password" placeholder="Password..." onChange={(e)=>{setPasswordReg(e.target.value)}}/>
        <h6>{"\n"}</h6>
        <a data-tip="Passwords must be atleast 6 characters long and must contain atleast 1 letter, 1 number, and 1 special character"> [!] </a>
        <ReactTooltip place="bottom" type="error" effect="solid"/>
        <button className ="btn btn-primary btn-lg" onClick={register}>Register</button>
        <h6>{userCreateStatus}</h6>
      </div>

      <div>
        <h1>Login</h1>
        <label>Username</label>
        <input type="text" placeholder="Username..." onChange={(e)=>{setUsername(e.target.value)}}/>
        <h6>{"\n"}</h6>
        <label>Password</label>
        <input type="password" placeholder="Password..." onChange={(e)=>{setPassword(e.target.value)}}/>
        <h6>{"\n"}</h6>
        <label>2Factor</label>
        <input type="text" placeholder="2Factor Code..." onChange={(e)=>{setCode(e.target.value)}}/>
        <h6>{"\n"}</h6>
        <a data-tip="If 2factor is not enabled on this account, leave field blank"> [!] </a>
        <ReactTooltip place="bottom" type="error" effect="solid"/>
        <button className ="btn btn-primary btn-lg" onClick={login}>Login</button>
      </div>
      <h1>{loginStatus}</h1>
    </div>
  );
}

export default App;
