import React from 'react'
import { useAuth } from './AuthContext';

function HomesView() {
  const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
  
  return (
    <div>
        HomesView
        {authUser && <div>{authUser.email}</div>}
    </div>
  )
}

export default HomesView
