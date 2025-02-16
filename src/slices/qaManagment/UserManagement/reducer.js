import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        fetchUser(state) {
            state.loading = true;
            state.error = null;
        },
        fetchUserSuccess(state, action) {
            state.users = action.payload;
            state.loading = false;
        },
        fetchUserFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        addUser(state, action) {
            state.loading = false;
            state.error = null;
            state.users.push(action.payload);
            
        },
        updateUser(state, action) {
            const updatedUser = action.payload;
            state.users = state.users.map(user =>
              user.id === updatedUser.id ? { ...user, ...updatedUser } : user
            );
          },
        deleteUser(state, action) {
            const id = action.payload;
            state.users = state.users.filter(user => user.id !== id);
        }
    }
})

export const { fetchUser, fetchUserSuccess, fetchUserFailure, addUser, updateUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
