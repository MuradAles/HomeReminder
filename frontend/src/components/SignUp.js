import React from 'react'
import { useState } from 'react';
import Button from "react-bootstrap/Button";
import IconEye from '../resources/IconEye';
import IconEyeInvisible from '../resources/InvisibleIconEye';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { NavLink } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {isLoggedIn} = useAuth();
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    if (password !== confirmPassword) { //also needs validation for all empty fields
      setError("Password and Confirm Password must match");
      setLoading(false);
      return;
    }

    const endpoint = `http://localhost:4000/users/signup`
    const signupInfo = {
      name: username,
      email: email,
      password: password
    }
    let signupResponse;
    try {
      signupResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(signupInfo)
      });
      const signupData = await signupResponse.json();

      if (signupData.error) {
        setError(signupData.error)
        setLoading(false);
        return;
      }

      setSuccessMessage("Successful Registration! You may now login using your account information.");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(()=> {
        navigate(`/login`)
      }, 1000)
      return signupData

    } catch (e) {
      setError("Please make sure you are running MongoDB");
      setLoading(false);
      return;
    }
  }

  function showToggle(elementId) {
    const passwordElement = document.getElementById(elementId);
    const passwordType = passwordElement?.getAttribute("type");
    if (passwordType === "password") {
      passwordElement?.setAttribute("type", "text");
    } 
    else {
      passwordElement?.setAttribute("type", "password");
    }
  }

  if (isLoggedIn) {
    navigate("/homes")
  }
  
  return (
    <div className='signupWrapper'>
        Sign up
        {error && <div className='errorText'>{error}</div>}
        {successMessage && <div className='successText'>{successMessage}</div>}
        <form>
          <div className='signupContainer'>
            <label>Username</label>
            <input value={username} placeholder='Username' onChange={handleUsernameChange}/>
          </div>
          <div className='signupContainer'>
            <label>Email</label>
            <input value={email} placeholder="Email" onChange={handleEmailChange}/>
          </div>
          <label>Password</label>
          <div className='signupContainer'>
            <input id="passwordInput" type="password" placeholder='Password' value={password} onChange={handlePasswordChange}/>
            <button type="button" className="eyeIcon" onClick={() => { 
              showToggle('passwordInput')
              setShowPassword(!showPassword)}}>
                {showPassword ? <IconEye /> : <IconEyeInvisible />}
            </button>
          </div>
          <label>Confirm Password</label>
          <div className='signupContainer'>
            <input id="passwordConfirmationInput" type="password" placeholder='Confirm Password' value={confirmPassword} onChange={handleConfirmPasswordChange}/>
            <button type="button" className="eyeIcon" onClick={() => { 
              showToggle('passwordConfirmationInput')
              setShowConfirmPassword(!showConfirmPassword)}}>
                {showConfirmPassword ? <IconEye /> : <IconEyeInvisible />}
            </button>
          </div>
          <br/>
          <Button type="submit" onClick={handleSubmit} id="navButton" variant="custom">
            {loading ? <div className="spinner-border text-light" role="status"/> : "Sign Up"}
          </Button>
        </form>
        <div>
          <NavLink to="/login">Already have an account? Login here!</NavLink>
        </div>
    </div>
  )
}

export default SignUp
