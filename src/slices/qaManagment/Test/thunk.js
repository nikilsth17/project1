import axios from 'axios';
import { fetchTestCaseRequest, fetchTestCaseSuccess, fetchTestCaseFailure, addTestCase, updateTestCase, deleteTestCase } from './reducer';

const apiUrl = window.APP_CONFIG.baseapi + '/TestCase';

export const fetchTestCaseForModule = (moduleId) => async (dispatch) => {
    
  const token = localStorage.getItem("token"); // Example: token stored in local storage
  console.log("project token", token)

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    dispatch(fetchTestCaseRequest()); // Dispatch the fetchModulesRequest action


    const response = await axios.get(`${apiUrl}/GetListWithLastResult?moduleId=${moduleId}`, {headers});
    console.log("response", response);

    if (response) {
      const data = response;
      console.log("data", data);
      dispatch(fetchTestCaseSuccess(data));
    }
    
  } catch (error) {
    console.error('Error fetching modules:', error.message);
    dispatch(fetchTestCaseFailure(error.message));
  }
}

// export const addTestCaseForModule = (moduleId, testcase) => async (dispatch) => {
//   try {
//     const response = await axios.post(`${apiUrl}/byModule/${moduleId}`, testcase);
//     dispatch(addTestCase(response));
//   } catch (error) {
//     console.error('Error adding module:', error);
//   }
// }

export const addTestCaseForModule = (moduleId, testcase) => async (dispatch) => {
    
  const token = localStorage.getItem("token"); // Example: token stored in local storage
  console.log("project token", token)

  const headers = {
    Authorization: `Bearer ${token}`,
  };
    try {
      const response = await axios.post(`${apiUrl}`, testcase, {headers});
      dispatch(addTestCase(response));
    } catch (error) {
      console.error('Error adding module:', error);
    }
  }

export const updateTestCaseByID =(testcaseId, updatedTestCaseData) => async (dispatch) => {
    
  const token = localStorage.getItem("token"); // Example: token stored in local storage
  console.log("project token", token)

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.put(`${apiUrl}/${testcaseId}`, updatedTestCaseData, {headers});
    console.log("REACHED HEREeeeee", response)
    dispatch(updateTestCase(response));
  } catch (error) {
    console.error('Error updating module:', error);
  }
}


export const deleteTestCaseByID = (testcaseId) => async (dispatch) => {
    
  const token = localStorage.getItem("token"); // Example: token stored in local storage
  console.log("project token", token)

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    await axios.delete(`${apiUrl}/${testcaseId}`, {headers});
    dispatch(deleteTestCase(testcaseId));
  } catch (error) {
    console.error('Error deleting module:', error);
  }
}

//get all test cases 
export const getallTestCases = () => async (dispatch) => {
    
  const token = localStorage.getItem("token"); // Example: token stored in local storage
  console.log("project token", token)

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    dispatch(fetchTestCaseRequest()); // Dispatch the fetchModulesRequest action

    const response = await axios.get(`${apiUrl}`, {headers});
    console.log("response", response);

    if (response) {
      const data = response;
      console.log("data", data);
      dispatch(fetchTestCaseSuccess(data));
    }
    
  } catch (error) {
    console.error('Error fetching modules:', error.message);
    dispatch(fetchTestCaseFailure(error.message));
  }
}