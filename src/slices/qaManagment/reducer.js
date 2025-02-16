import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Name: "",
  Description: "",
  ComboPrice: "",
  formFile: "",
  isActive: true,
  Items: [
    {
      itemId: "",
      quantity: 0,
    },
  ],
};

const getItemSlice = createSlice({
  name: "getItem",
  initialState,
  reducers: {
    handleNameChange: (state, action) => {
      state.Name = action.payload;
    },
    handleDescriptionChange: (state, action) => {
      state.Description = action.payload;
    },
    setComboPrice: (state, action) => {
      state.ComboPrice = action.payload;
    },
    setformFile: (state, action) => {
      state.formFile = action.payload;
    },
    handlePAddNewItem: (state, action) => {
      state.Items.push({
        itemId: "",
        quantity: 0,
      });
    },
    handlePRemoveItem: (state, action) => {
      state.Items.splice(action.payload, 1);
    },
    setItem: (state, action) => {
      state.Items = action.payload;
    },
    setItemInput: (state, action) => {
      state.ItemInput = action.payload;
    },
  },
});

export const {
  handleNameChange,
  handleDescriptionChange,
  setComboPrice,
  setformFile,
  handlePAddNewItem,
  handlePRemoveItem,
  setItem,
  setItemInput,
} = getItemSlice.actions;

export default getItemSlice.reducer;
