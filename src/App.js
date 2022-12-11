import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Axios from 'axios';

import "./App.css";

function App(){
const navigate = useNavigate();

const [emailReg, setEmailReg] = useState('');
const [usernameReg, setUsernameReg] = useState('');
const [passwordReg, setPasswordReg] = useState('');

const [username, setUsername] = useState('');
const [password, setPassword] = useState('');

const[userCreateStatus,setUserCreateStatus] = useState('');
const[loginStatus, setLoginStatus] = useState('');

Axios.defaults.withCredentials = true;
const register = () => {
  Axios.post("http://localhost:3001/register", {
    email: emailReg,
    username: usernameReg,
    password: passwordReg,
    }).then((response)=> {
      
      if(response.data.message){
          setUserCreateStatus(response.data.message);
      } else{
        //successful usercreation
        setUserCreateStatus(response.data[0].username);
      }

    });
};


const login = () => {
  Axios.post("http://localhost:3001/login", {
    email: emailReg,
    username: username,
    password: password,
    }).then((response)=> {

      if(response.data.message){
        setLoginStatus(response.data.message);
      } else{
        navigate("/dashboard");
        setLoginStatus(response.data[0].username);
      }

    });
};

useEffect(()=>{
  Axios.get("http://localhost:3001/login").then((response)=>{
        if(response.data.loggedIn === true){
          navigate("/dashboard");
          setLoginStatus(response.data.user[0].username)
        }
  })
}, [])

  return(
    <div className="App">

      <div className="Registration">
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
        <button className ="btn btn-primary btn-lg" onClick={register}>Register</button>
        <h6>{userCreateStatus}</h6>
      </div>










      <div className="login">
        <h1>Login</h1>
        <label>Username</label>
        <input type="text" placeholder="Username..." onChange={(e)=>{setUsername(e.target.value)}}/>
        <h6>{"\n"}</h6>
        <label>Password</label>
        <input type="password" placeholder="Password..." onChange={(e)=>{setPassword(e.target.value)}}/>
        <h6>{"\n"}</h6>
        <button className ="btn btn-primary btn-lg" onClick={login}>Login</button>
      </div>
      <h1>{loginStatus}</h1>
    </div>
  );
}

export default App;
