import axios from 'axios';
import { fetchModulesRequest, fetchModulesSuccess, fetchModulesFailure, addModule, updateModule, deleteModule } from './reducer'; // Update the import path according to your file structure

const apiUrl = window.APP_CONFIG.api1.baseapi + '/Module' ;



//fetch all modules 
export const getModules = () => async (dispatch) => {
    
  const token = localStorage.getItem("token"); // Example: token stored in local storage
  console.log("project token", token)

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {

    dispatch(fetchModulesRequest()); // Dispatch the fetchModulesRequest action
    const response = await axios.get(apiUrl, {headers});

    if (response){
      const data = response;
      dispatch(fetchModulesSuccess(data));
    }
    else{
      console.log("No module found in the response.")
    }
  } catch (error) {
    console.log(error)
    dispatch(fetchModulesFailure(error.message));
  }
}


export const fetchModulesForProject = (projectId) => async (dispatch) => {
    
  const token = localStorage.getItem("token"); // Example: token stored in local storage
  console.log("project token", token)

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    dispatch(fetchModulesRequest()); // Dispatch the fetchModulesRequest action
  
    const response = await axios.get(`${apiUrl}/ModulesbyNullParentId/${projectId}`, {headers});
    console.log("response", response);
    dispatch(fetchModulesSuccess(response));
  } catch (error) {
    console.error('Error fetching modules:', error.message);
    dispatch(fetchModulesFailure(error.message));
  }
};



export const addModuleForProject = (module, id) => async (dispatch) => {
    
  const token = localStorage.getItem("token"); // Example: token stored in local storage
  console.log("project token", token)

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {

  
    const response = await axios.post(apiUrl, module, {headers});
    dispatch(addModule(response));
    dispatch(fetchModulesForProject(id));
  } catch (error) {
    console.error('Error adding module:', error);
  }
}


export const updateModuleByID = (moduleId, updatedModuleData) => async (dispatch) => {
    
  const token = localStorage.getItem("token"); // Example: token stored in local storage
  console.log("project token", token)

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.put(`${apiUrl}/${moduleId}`, updatedModuleData, {headers});
    console.log("update module response", response);
    dispatch(updateModule(response));
  } catch (error) {
    console.error('Error updating module:', error);
  }
}

export const deleteModuleByID = (moduleId) => async (dispatch) => {
    
  const token = localStorage.getItem("token"); // Example: token stored in local storage
  console.log("project token", token)

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {

    //delete request
    await axios.delete(`${apiUrl}/${moduleId}`, {headers});

    //dispatch delete action
    dispatch(deleteModule(moduleId));
  } catch (error) {
    console.error('Error deleting module:', error);
    //handle error here
  }
}

