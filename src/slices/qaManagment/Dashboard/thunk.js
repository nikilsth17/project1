// Import Axios
import axios from 'axios';

// Import your Redux actions
import {
  fetchDashboardDataRequest,
  fetchDashboardDataSuccess,
  fetchDashboardDataFailure,
} from './reducer.js'; // Replace with the actual path to your dashboardSlice

// Define your API endpoint URL
const apiUrl = window.APP_CONFIG.baseapi + '/DataCount/viewmodel';

// Define the thunk action to fetch data from the API
export const fetchDashboardData = () => async (dispatch) => {

  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };



  dispatch(fetchDashboardDataRequest()); // Dispatch the request action

  try {
    // Make a GET request to the API
    const response = await axios.get(apiUrl, {headers});

    // Assuming the API response contains the data structure you described
    const data = response;

    // Dispatch the success action with the received data
    dispatch(fetchDashboardDataSuccess(data));
  } catch (error) {
    // Handle any errors and dispatch the failure action with the error message
    dispatch(fetchDashboardDataFailure(error.message || 'An error occurred.'));
  }
};
