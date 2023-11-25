import React from 'react'
import { NavLink } from "react-router-dom";

function Navigation() {
  const currentPath = `/homes/1234`
  return (
    <nav>
        <button id="navButton" variant="contained">
            <NavLink to="/">Home</NavLink>
        </button>
        <button id="navButton" variant="contained">
            <NavLink to="/login">Login</NavLink>
        </button>
        <button id="navButton" variant="contained">
            <NavLink to={currentPath}>My Homes</NavLink>
        </button>
        <button id="navButton" variant="contained">
            <NavLink to="/signup">Sign Up</NavLink>
        </button>
        {/* <SignOutButton /> */}
    </nav>
  )
}

export default Navigation
