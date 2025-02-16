import axios from 'axios'
import { fetchProjectFailure, fetchProject, fetchProjectSuccess, addProject, updateProject, deleteProject } from './reducer';


const apiUrl = window.APP_CONFIG.baseapi + "/Project";

export const getProjects = () => async (dispatch) => {
    const token = localStorage.getItem("token"); // Example: token stored in local storage
    console.log("project token", token)

    const headers = {
      Authorization: `Bearer ${token}`,
    };
   
    try {
        // console.log("Reached getProjects");
        dispatch(fetchProject());
        const response = await axios.get(apiUrl, {headers});
        // console.log("response", response);

        if (response){
            const data = response;
            // console.log("data", data);
            dispatch(fetchProjectSuccess(data));
        }
        else{
            console.log("No project found in the response.");
        }
        
    } catch (error) {
        
    console.log(error)
    dispatch(fetchProjectFailure(error.message));
        
    }
}

export const createProject = (newProjectData) => async (dispatch) => {
    const token = localStorage.getItem("token"); // Example: token stored in local storage
    console.log("project token", token)

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      // Make the POST request to create a new project
      const response = await axios.post(apiUrl, newProjectData, {headers});
      console.log("response status", response.status);

      const newProject = response;
      dispatch(addProject(newProject));
  
    //   if (response.status === 201) {
    //     const newProject = response;
    //     dispatch(addProject(newProject));
    //   } else {
    //     console.log('Failed to create project:', response);
    //   }
    } catch (error) {
      console.log('Error creating project:', error);
    }
  };

export const updateProjectByID = (projectId, updatedProjectData) => async (dispatch) => {
      
    const token = localStorage.getItem("token"); // Example: token stored in local storage
    console.log("project token", token)

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
        // Send a PUT request to the API
       const response= await axios.put(`${apiUrl}/${projectId}`, updatedProjectData, {headers});
        console.log("response", response);

        if(response){
            const updatedProject = response;
            dispatch(updateProject(updatedProject));
        }
        else{
            console.log("Failed to update project:", response);
        }
        
    } catch (error) {
        console.log(error);
        // Handle error if needed
    }
}

export const deleteProjectById = (projectId) => async (dispatch) => {
      
    const token = localStorage.getItem("token"); // Example: token stored in local storage
    console.log("project token", token)

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      // Send a DELETE request to the API
      await axios.delete(`${apiUrl}/${projectId}`, {headers});
      
      // Dispatch the deleteUser action to update the state
      dispatch(deleteProject(projectId));
    } catch (error) {
      console.log(error);
      // Handle error if needed
    }
}