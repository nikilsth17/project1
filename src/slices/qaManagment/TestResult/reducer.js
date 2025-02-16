import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    testresult: [],
    loading: false,
    error: null,
}

const testresultSlice = createSlice({
    name: 'testresult',
    initialState,
    reducers: {
        getTestResultRequest(state) {
            state.loading = true;
        },
        getTestResultSuccess(state, action) {
            state.testresult = action.payload;
            state.loading = false;
            state.error = null;
        },
        getTestResultFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        addTestResult(state, action) {
            state.testresult.push(action.payload);
        },
    },
});

export const  {getTestResultRequest, getTestResultSuccess, getTestResultFailure, addTestResult} = testresultSlice.actions;

export default testresultSlice.reducer;