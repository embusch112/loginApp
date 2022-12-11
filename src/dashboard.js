import React, {useEffect, useState} from "react";
import Axios from 'axios';
import {useNavigate} from "react-router-dom";
import "./App.css"
import QRCode from 'react-google-qrcode'

function Dashboard(){
const navigate = useNavigate();
const[displaySecret, setDisplaySecret] = useState('');
const[removed, setRemoved] = useState('');

Axios.defaults.withCredentials = true;
const twoFac = () => {
    //do 2 factor stuff here
    setRemoved("")
    let setusername = document.cookie;
    Axios.post("http://localhost:3001/toptgen",{
        username: setusername
    }).then((response)=> {
        setDisplaySecret(response.data);   
    })
};

const Remove = () => {
  let setusername = document.cookie;
  Axios.post("http://localhost:3001/remove",{
    username: setusername
  })

    setRemoved("2Factor Removed");
    setDisplaySecret("");
}

const logout = () => {
  document.cookie = '""; Max-Age=0; path=/; domain='
  Axios.get("http://localhost:3001/logout");
  navigate("/login");
  
};

    return (
      <div className="fColor">
        <h1 className="text-center">Dashboard</h1>
        <h1>User: {document.cookie}</h1>
        <h3>Activate 2Factor: </h3>
        <h6>{"\n"}</h6>
        <button className ="btn btn-primary btn-lg" onClick={twoFac}>New 2Factor</button>
        <button className ="btn btn-primary btn-lg" onClick={Remove}>Remove 2Factor</button>         <h6>{removed}</h6>  
        <h6 className="big">{displaySecret}</h6>
        <QRCode 
        data={displaySecret}
        size={500}
        />
        <h6>{"\n"}</h6>
        <button className ="btn btn-primary btn-lg" onClick={logout}>logout</button>
      </div>
    );
}
  export default Dashboard;