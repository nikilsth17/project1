import React, { useEffect, useState } from "react";
import { Navigate, Route } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch } from "react-redux";

import { useProfile } from "../Components/Hooks/UserHooks";

import { logoutUser } from "../slices/thunks";
import _BaseAPIService from "../services/_BaseAPIService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthProtected = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userProfile, loading, token } = useProfile();

  // Logout function to clear session and dispatch logout action
  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    dispatch(logoutUser()); // Dispatch Redux logout action
    navigate("/login"); // Redirect to login page
  };

  // Token setup logic
  useEffect(() => {
    if (userProfile && !loading && token) {
      setAuthorization(token);
    } else if (!userProfile && loading && !token) {
      toast.error("You are not authorized to access this page!");
      handleLogout();
    }
  }, [token, userProfile, loading, navigate]);

  // Browser close/logout handling
  // useEffect(() => {
  //   // Set the session flag when the app loads

  //   // Handle the beforeunload event
  //   const handleBeforeUnload = (event) => {
  //     const sessionCheck = sessionStorage.getItem('sessionChecked');

  //     if (sessionCheck) {
  //       // If the flag is present, remove it (refresh case)
  //       sessionStorage.removeItem('sessionChecked');
  //       // localStorage.clear();
  //     } else {
  //       // If the flag is not present, logout (browser close case)
  //       handleLogout();
  //     }
  //   };

  //   // Attach the event listener
  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   // Cleanup the event listener
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [dispatch]);

  // Redirect if not authorized
  if (!userProfile && loading && !token) {
    return <Navigate to="/login" />;
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      element={<Component {...rest} />}
    />
  );
};

export { AuthProtected, AccessRoute };
