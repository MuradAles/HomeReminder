import React from 'react'
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";

function Navigation() {
  const currentPath = `/homes/1234`
  return (
    <nav className='navHeader'>
        <div>
            <h1 className="appTitle">Home Reminder</h1>
        </div>
        <div className='navButtons'>
            <Button bsClass="navButton" variant="custom">
                <NavLink className="navLink" to="/">Home</NavLink>
            </Button>
            <Button id="navButton" variant="custom">
                <NavLink className="navLink" to="/login">Login</NavLink>
            </Button>
            <Button id="navButton" variant="custom">
                <NavLink className="navLink" to={currentPath}>My Homes</NavLink>
            </Button>
            <Button id="navButton" variant="custom">
                <NavLink className="navLink" to="/signup">Sign Up</NavLink>
            </Button>
        </div>
        {/* <SignOutButton /> */}
    </nav>
  )
}

export default Navigation
