import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    testcase:[],
    loading:false,
    error:null
}

const testcaseSlice = createSlice({
    name: "testcase",
    initialState,
    reducers:{
        fetchTestCaseRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchTestCaseSuccess: (state, action) =>{
            state.loading= false,
            state.testcase = action.payload
        },
        fetchTestCaseFailure: (state, action) =>{
            state.loading = false,
            state.error = action.payload
        },
        addTestCase: (state, action) =>{
            state.testcase.push(action.payload)
        },
        updateTestCase:(state, action) =>{
            const updatedTestCase = action.payload;
            state.testcase = state.testcase.map(testcase =>
                testcase.id === updatedTestCase.editedEntity.id ? { ...testcase, ...updatedTestCase.editedEntity } : testcase
            );
        },
        deleteTestCase: (state, action) =>{
            const  id  = action.payload;
            state.testcase = state.testcase.filter(testcase => testcase.id !== id);
        },
    },
})

export const {fetchTestCaseRequest, fetchTestCaseSuccess, fetchTestCaseFailure, addTestCase, updateTestCase, deleteTestCase} = testcaseSlice.actions;

export default testcaseSlice.reducer;
