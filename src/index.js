import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter,Route,Routes} from "react-router-dom";
import Login from "./login";
import Dashboard from "./dashboard"
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
    <Route index element={<Login />} />
      <Route path ="login" element={<Login />} />
      <Route path ="dashboard" element={<Dashboard />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

