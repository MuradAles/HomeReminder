import React, {useState} from 'react'
import { useAuth } from './AuthContext'
import Button from 'react-bootstrap/esm/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import IconEye from '../resources/IconEye';
import IconEyeInvisible from '../resources/InvisibleIconEye';

function Login() {
  const {AuthUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setError("");

    const endpoint = `http://localhost:4000/users/login`
    const loginInfo = {
      email: email,
      password: password
    }
    let loginResponse;
    let loginData;
    try {
      loginResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(loginInfo)
      });
      loginData = await loginResponse.json();

      if (loginData.error) {
        setError(loginData.error);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.log("Please make sure you are running MongoDB");
      setLoading(false);
      setError("Please make sure you are running MongoDB");
      return;
    }

    setIsLoggedIn(true);
    setAuthUser({
      id: loginData.id,
      email: loginData.email
    })

    setSuccessMessage("Successful login!")
    setEmail("");
    setPassword("");
    setTimeout(()=> {
      navigate(`/homes`)
    }, 1000)
    return loginData
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
        Login
        {error && <div className='errorText'>{error}</div>}
        {successMessage && <div className='successText'>{successMessage}</div>}
        <form>
          <label>Email</label>
          <input value={email} placeholder='Email' onChange={handleEmailChange}/>
          <label>Password</label>
          <div className='signupContainer'>
            <input id="passwordInput" type="password" placeholder='Password' value={password} onChange={handlePasswordChange}/>
            <button type="button" className="eyeIcon" onClick={() => { 
              showToggle('passwordInput')
              setShowPassword(!showPassword)}}>
                {showPassword ? <IconEye /> : <IconEyeInvisible />}
            </button>
          </div>
          <br/>
          <Button type="submit" onClick={handleSubmit} id="navButton" variant="custom">
            {loading ? <div className="spinner-border text-light" role="status"/> : "Login"}
          </Button>
        </form>
        <div>
          <NavLink to="/signup">Don't have an account? Sign up here!</NavLink>
        </div>
    </div>
  )
}

export default Login
