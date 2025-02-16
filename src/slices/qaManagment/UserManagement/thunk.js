import axios from 'axios';
import { fetchUser, fetchUserSuccess, fetchUserFailure,addUser, updateUser } from './reducer';

// Import the deleteUser action from your reducer
import { deleteUser } from './reducer';
import { getLoggedInUser } from '../../../helpers/fakebackend_helper';
import {toast} from 'react-hot-toast';


const apiUrl = window.APP_CONFIG.baseapi + '/User';



export const getUsers = () => async (dispatch) => {



  const user = getLoggedInUser();
  console.log("UserList", user)
  
  const token = user?.token; // Example: token stored in local storage
  console.log("token", token)
  const headers = {
    Authorization: `Bearer ${token}`,
  };
 

    try {
            // Define your request headers
   
        dispatch(fetchUser());

        if(headers !== null){
            console.log("Reached HEREE")
          const response = await axios.get(apiUrl, {headers});
        
       
        
        // Log the entire response object to inspect its structure
        console.log("response", response);

        // Make sure response.data is not undefined
        if (response) {
            const data = response;
            console.log("data", data);
            dispatch(fetchUserSuccess(data));
        } else {
            console.log("No data found in the response.");
        }
      }
    } catch (error) {
        console.log("error", error);
        dispatch(fetchUserFailure(error.message));
    }
};

export const addUsers = (newUser) => async (dispatch) => {
  const token = localStorage.getItem("token"); 
  const headers = {
    Authorization: `Bearer ${token}`,
  };
try {
  // Assuming your API supports POST request to add a new user
  const response = await axios.post(`${apiUrl}`, newUser, headers);
  console.log("response", response)
  if (response){
    dispatch(addUser(response)) // Assuming the response contains the newly added user data
    toast.success("User added successfully");
    dispatch(getUsers());

   
  }
  
  
} catch (error) {

    toast.error("Failed! Username or email already exists");
}   

};



export const deleteUserById = (userId) => async (dispatch) => {
  const user = getLoggedInUser();
  console.log("UserList", user)
  
  const token = user?.token; // Example: token stored in local storage
  console.log("token", token)
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    // Send a DELETE request to the API
    await axios.delete(`${apiUrl}/${userId}`, headers);
    
    // Dispatch the deleteUser action to update the state
    dispatch(deleteUser(userId));
  } catch (error) {
    console.log(error);
    toast.error(error);
    // Handle error if needed
  }
};


export const updateUserById = (userId, updatedUserData) => async (dispatch) => {
    console.log("Reached here", userId , updatedUserData)
    const user = getLoggedInUser();
   
  
  const token = user?.token; // Example: token stored in local storage
 
  const headers = {
    Authorization: `Bearer ${token}`,
  };

       // Assuming your API supports POST request to add a new user
      
     
    try {
      // Send a PUT request to the API to update user data
     
      
      const response = await axios.put(`${apiUrl}/${userId}`, updatedUserData, headers);
      // console.log(response)
  
      // Dispatch the updateUser action to update the state
      if (response) {
        dispatch(updateUser(response)); // Assuming the response contains the updated user data
      } else {
        console.log('No data found in the response.');
      }
    } catch (error) {
      console.log('error', error);
      toast.error(error);
      // Handle error if needed
    }
  };
  