//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
} from "../../../helpers/fakebackend_helper";

import {
  loginSuccess,
  logoutUserSuccess,
  apiError,
  reset_login_flag,
  loginBegin,
} from "./reducer";

// const fireBaseBackend = getFirebaseBackend();

export const loginUser = (user, history) => async (dispatch) => {
  try {
    let response;
    dispatch(loginBegin());
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.loginUser(user.email, user.password);
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = postJwtLogin({
        email: user.email,
        password: user.password,
        role: user.role,
      });
      // console.log("response", response)
    } else if (process.env.REACT_APP_API_URL) {
      response = postFakeLogin({
        email: user.email,
        password: user.password,
      });
    }

    var data = await response;
    console.log(
      "🚀 ~ file: thunk.js:41 ~ loginUser ~ data:",
      JSON.stringify(data)
    );

    if (data) {
      localStorage.setItem("user", JSON.stringify(data));
      if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
        var finallogin = JSON.stringify(data);
        finallogin = JSON.parse(finallogin);
        data = finallogin.data;
        if (finallogin.status === "success") {
          dispatch(loginSuccess(data));
          if (data.role === "admin") {
            navigate("/users");
          } else if (data.role === "user") {
            navigate("/project");
          }
        } else {
          dispatch(apiError(finallogin));
        }
      } else {
        dispatch(loginSuccess(data));
        if (data.role === "user") {
          history("/project");
        } else {
          history("/users");
        }
      }
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    let fireBaseBackend = getFirebaseBackend();
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = fireBaseBackend.logout;
      dispatch(logoutUserSuccess(response));
    } else {
      dispatch(logoutUserSuccess(true));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type, history) => async (dispatch) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.socialLoginUser(type);
    }
    //  else {
    //   response = postSocialLogin(data);
    // }

    const socialdata = await response;
    if (socialdata) {
      localStorage.setItem("user", JSON.stringify(response));
      dispatch(loginSuccess(response));
      history("/dashboard");
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};
