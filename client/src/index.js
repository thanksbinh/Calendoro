import React from "react";
import ReactDOM from "react-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { App } from "./App";
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="361670284650-upvmuj28gcqvdnn83mncqs6i8gmlo04g.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
  
);