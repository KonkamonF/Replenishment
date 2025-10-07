import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom"; // Import useNavigate

// You'd typically use CSS modules or a separate CSS file for styling
const formStyle = {
  display: "flex",
  flexDirection: "column",
  width: "300px",
  margin: "50px auto",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const inputStyle = {
  padding: "10px",
  margin: "10px 0",
  border: "1px solid #ddd",
  borderRadius: "3px",
};

const buttonStyle = {
  padding: "10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "3px",
  cursor: "pointer",
  marginTop: "10px",
};

export default function Login() {
 

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Login</h2>
      <form style={formStyle}>
        
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email or Username"
          
          style={inputStyle}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
         
          style={inputStyle}
        />

        {/* Submit Button */}
        <button type="submit" style={buttonStyle}>
          Log In
        </button>
      </form>
      
      {/* This is your link to the main dashboard. 
        It's better to use 'superadmin' directly if that's the main entry point after login.
      */}
      <Link to="/app" style={{ display: "block", marginTop: "10px" }}>
        Go to SuperAdmin Dashboard (For testing purposes)
      </Link>
    </div>
  );
}