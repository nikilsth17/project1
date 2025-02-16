// authSlice.j
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  errorMsg: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },   
    loginfailure: (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.errorMsg = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout, loginfailure } = authSlice.actions;

export default authSlice.reducer;
