// addressSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const addressSlice = createSlice({
  name: "address",
  initialState: {
    addressOptions: [],
  },
  reducers: {
    setAddressOptions: (state, action) => {
      state.addressOptions = action.payload;
    },
  },
});

export const { setAddressOptions } = addressSlice.actions;

export default addressSlice.reducer;
