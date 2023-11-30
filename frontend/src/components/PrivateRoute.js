import {Navigate, Outlet} from 'react-router-dom';
import React, {useContext} from 'react';
import { useAuth } from './AuthContext';

const PrivateRoute = () => {
  const {isLoggedIn} = useAuth();
  //console.log(currentUser);
  //console.log('Private Route Comp current user', currentUser);
  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return isLoggedIn ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;