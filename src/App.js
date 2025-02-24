import React, { useEffect, useState } from "react";

//import Scss
import "./assets/scss/themes.scss";

//imoprt Route
import Route from "./Routes";
import "./App.css";

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper";

// Fake Backend
import fakeBackend from "./helpers/AuthType/fakeBackend";
import { I18nextProvider } from "react-i18next";
import './i18n'; // Import i18n configuration
// Activating fake backend
fakeBackend();
import { Toaster } from "react-hot-toast";

import _BaseAPIService from "./services/_BaseAPIService";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// };

// // init firebase backend
// initFirebaseBackend(firebaseConfig);

function App() {
  // useEffect(() => {
  //   const userString = localStorage.getItem("user");
  //   if (userString) {
  //     _BaseAPIService.startRefreshTokenPolling();
  //   }
  // }, []);
  // const navigate = useNavigate();
  // useEffect(() => {
  //   _BaseAPIService.setupInterceptors(navigate);
  // }, [navigate]);
  return (
    <React.Fragment>
        <Route />
        <Toaster />
    </React.Fragment>
  );
}

export default App;
