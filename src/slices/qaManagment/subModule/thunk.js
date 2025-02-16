import axios from "axios";
import { fetchsubModulesFailure, fetchsubModulesSuccess, fetchsubModulesRequest, updateSubModule, addSubModule, deleteSubModule } from "./reducer";

const apiUrl = window.APP_CONFIG.baseapi + "/Module";

//get submodule for a module
export const fetchSubModulesForModule = (moduleId) => async (dispatch) => {

    const token = localStorage.getItem("token"); // Example: token stored in local storage
    console.log("project token", token)

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      dispatch(fetchsubModulesRequest()); // Dispatch the fetchModulesRequest action

      const response = await axios.get(`${apiUrl}/ListSubModules/${moduleId}`, {headers});
      console.log(`sub modules for moduleid ${moduleId}` , response);
      dispatch(fetchsubModulesSuccess(response));
    } catch (error) {
      console.error('Error fetching modules:', error);
      dispatch(fetchsubModulesFailure(error));
    }
}

//delete submodule
export const deleteSubModulebyid = (subModuleId) => async (dispatch) => {

    const token = localStorage.getItem("token"); // Example: token stored in local storage
    console.log("project token", token)

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {

      const response = await axios.delete(`${apiUrl}/${subModuleId}`, {headers});
      console.log(`deleted sub model ${subModuleId}` , response);
      dispatch(deleteSubModule(subModuleId));

    } catch (error) {
      console.error('Error fetching modules:', error);
      dispatch(fetchsubModulesFailure(error));
    }
  }

//update submodulebyid
 export const updateSubModuleById = (subModuleId, subModule) => async (dispatch) => {

    const token = localStorage.getItem("token"); // Example: token stored in local storage
    console.log("project token", token)

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // console.log('subModule id to update',  subModuleId);
    // console.log('SubModule Data to update', subModule)
    try {


      const response = await axios.put(`${apiUrl}/${subModuleId}`, subModule, {headers});
      console.log(`updated sub model ${subModuleId}` , response);
      dispatch(updateSubModule(response));


    }
    catch (error) {
      console.error('Error fetching modules:', error);
      dispatch(fetchsubModulesFailure(error));
    }

 }

 //add submodule for a module
  export const addSubModuleforModule = (subModule) => async (dispatch) => {

      const token = localStorage.getItem("token"); // Example: token stored in local storage
      console.log("project token", token)

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      console.log('SubModule Data to add', subModule)
      try {


        const response = await axios.post(`${apiUrl}`, subModule, {headers});
        console.log(`added sub model` , response);
        dispatch(addSubModule(response));
        dispatch(fetchSubModulesForModule(subModule.parent_Module_Id));
      }
      catch (error) {
        console.error('Error fetching modules:', error);
        dispatch(fetchsubModulesFailure(error));
      }
    }

