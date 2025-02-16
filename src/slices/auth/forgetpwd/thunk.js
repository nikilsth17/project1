import { userForgetPasswordSuccess, userForgetPasswordError, userToken } from "./reducer"

//Include Both Helper File with needed methods

import { getFirebaseBackend } from "../../../helpers/firebase_helper";

import {
  postFakeForgetPwd, postresetPwd,

} from "../../../helpers/fakebackend_helper";

const fireBaseBackend = getFirebaseBackend();
 

export const userForgetPassword = (user, history) => async (dispatch) => {
  try {
    let response;
    let requestBody;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      requestBody = {
        EmailAddress: user.emailAddress,
        // Other necessary fields for the password reset if required by Firebase
      };
      console.log("Request Body for Firebase:", requestBody);
      response = await fireBaseBackend.forgetPassword(requestBody);
      console.log("Response from Firebase:", response);
    } else {
      requestBody = {
        EmailAddress: user.emailAddress,
        // Other necessary fields for the password reset if required by the backend
      };
      console.log("Request Body for Fake Backend:", requestBody);
      response = await postFakeForgetPwd(requestBody);
      console.log("Response from Fake Backend:", response);
    }

    if (response && response.data && response.data.token) {
      const token = response.data.token;

      // Dispatch userToken action to store the token in Redux state
      dispatch(userToken(token));

      // Redirect to the reset password page with the token
      history.push(`/reset-password/${token}`);
    } else {
      console.error("Token not received in the response");
      dispatch(userForgetPasswordError("Token not received in the response."));
    }
  } catch (forgetError) {
    console.error("Error during password reset:", forgetError);
    dispatch(userForgetPasswordError(forgetError));
  }
};