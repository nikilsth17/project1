import axios from 'axios';
import { getTestResultFailure, getTestResultSuccess,getTestResultRequest,addTestResult } from './reducer';

const apiUrl = window.APP_CONFIG.baseapi + '/TestResult';


export const getTestResult = () => async (dispatch) => {
  const token = localStorage.getItem("token"); // Example: token stored in local storage
  console.log("project token", token)

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  console.log("headers", headers)

    try {
        dispatch(getTestResultRequest()); // Dispatch the fetchModulesRequest action
    
        const response = await axios.get(apiUrl, {headers});
        console.log("response", response);
    
        if (response) {
        const data = response;
        console.log("data", data);
        dispatch(getTestResultSuccess(data));
        }
        
    } catch (error) {
        console.error('Error fetching modules:', error.message);
        dispatch(getTestResultFailure(error.message));
    }
}

// add test result for test case

// export const addTestCaseResult = (testcaseId, testresult) => async (dispatch) => {
//     try {
//       const response = await axios.post(`${apiUrl}/${testcaseId}`, testresult);
//       dispatch(addTestResult(response));
//     } catch (error) {
//       console.error('Error adding module:', error);
//     }
//   }

export const addTestCaseResult = (testcaseId, testresult) => async (dispatch) => {
  const token = localStorage.getItem("token"); // Example: token stored in local storage
  console.log("project token", token)

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  };

  console.log("testresult", testresult)
  try {
    const response = await axios.post(`${apiUrl}/CreateTestResult`, testresult,{headers});
    console.log("add test result response", response)
    dispatch(addTestResult(response));
    dispatch(getTestResultForTestCase(testcaseId));
  } catch (error) {
    console.error('Error adding module:', error);
  }
}

  //get all test results for test id

  export const getTestResultForTestCase = (testcaseId) => async (dispatch) => {

    const token = localStorage.getItem("token"); // Example: token stored in local storage
    console.log("project token", token)
  
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    try {
      dispatch(getTestResultRequest()); // Dispatch the fetchModulesRequest action
  
      const response = await axios.get(`${apiUrl}/byTestcaseId?testcaseid=${testcaseId}`, {headers});
      console.log("response", response);
  
      if (response) {
        const data = response;
        console.log("data", data);
        dispatch(getTestResultSuccess(data));
      }
      
    } catch (error) {
      console.log(error)
    }
  }

