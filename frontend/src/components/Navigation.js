import React, { useState } from 'react'
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useAuth } from './AuthContext';
import Alert from 'react-bootstrap/Alert'

function Navigation() {
  const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
  const [show, setShow] = useState(false);

  const logOut = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
        setIsLoggedIn(false);
        setAuthUser(null);
        setShow(true);
    }
  }

  return (
    <nav className='navHeader'>
        <div>
            <h1 className="appTitle">Home Reminder</h1>
        </div>
        <div className='navButtons'>
            <Button id="navButton" variant="custom">
                <NavLink className="navLink" to="/">Home</NavLink>
            </Button>
            {!isLoggedIn && 
            <Button id="navButton" variant="custom">
                <NavLink className="navLink" to="/login">Login</NavLink>
            </Button> }
            {isLoggedIn && 
            <Button id="navButton" variant="custom">
                <NavLink className="navLink" to={`/homes/${authUser.id}`}>My Homes</NavLink>
            </Button> }
            {isLoggedIn &&
            <Button id="navButton" variant="custom" onClick={logOut}>
                Log Out
            </Button> }
        </div>
        {show && <div className='errorContainer'>
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>User logged out</Alert.Heading>
            </Alert>
        </div> }
        {/* <SignOutButton /> */}
    </nav>
  )
}

export default Navigation
