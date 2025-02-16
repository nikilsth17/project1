// thunk.js

import { loginSuccess, loginfailure, logout } from "./reducer";
import axios from "axios";
import toast from "react-hot-toast";
import _BaseAPIService from "../../../services/_BaseAPIService";
import { getLoggedInUser } from "../../../helpers/fakebackend_helper";

const apiUrl = window.APP_CONFIG.api1.baseapi + "/login";
const authUser = getLoggedInUser();
console.log("authUserr", authUser);

export const login = (credentials, history) => async (dispatch) => {
  try {
    const response = await axios.post(apiUrl, credentials);
    console.log(response);
    const user = response;

    if (user) {
      // Store the user data and token first
      _BaseAPIService.storeToken(user.token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.token);

      // Dispatch login success before checking user type
      dispatch(loginSuccess(user));

      history("/user");

      toast.success("Welcome to cosmos driving");
    } else {
      dispatch(loginfailure());
      // toast.error("Invalid username or password. Please try again.");
    }
  } catch (error) {
    dispatch(loginfailure());

    toast.error("Invalid username or password. Please try again.");
  }
};
export const logoutUser = () => (dispatch) => {
  // Clear the user data and token from local storage.
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("lastCalendarView");

  // Dispatch the logout action.
  dispatch(logout());
};
