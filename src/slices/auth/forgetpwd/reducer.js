import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  token: "",
  forgetSuccessMsg: null,
  forgetError: null,
};

const forgotPasswordSlice = createSlice({
  name: "forgotpwd",
  initialState,
  reducers: {
      userForgetPasswordSuccess(state, action) {
          state.forgetSuccessMsg = action.payload
      },
      userForgetPasswordError(state, action) {
          state.forgetError = action.payload
      },
      userToken(state, action) {
        state.token = action.payload
    },
  },
});

export const {
  userForgetPasswordSuccess,
  userForgetPasswordError,
  userToken
} = forgotPasswordSlice.actions

export default forgotPasswordSlice.reducer;
