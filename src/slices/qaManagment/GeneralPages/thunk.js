import {
  fetchGeneralPagesRequest,
  fetchGeneralPageRequestSuccess,
  fetchGeneralPagesRequestFailure,
  addGeneralPage,
  getDocumentContentRequest,
  getDocumentContentRequestSuccess,
  getDocumentContentRequestFailure,
  deletePage,
  updatePage
} from "./reducer";
import axios from "axios";

//get all general pages
const apiUrl = window.APP_CONFIG.baseapi + "/GeneralPages";

export const getGeneralPages = () => async (dispatch) => {
  const token = localStorage.getItem("token"); // Example: token stored in local storage
  console.log("REACHED HERE");

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    dispatch(getDocumentContentRequest()); // Dispatch the fetchModulesRequest action
    const response = await axios.get(apiUrl, { headers });
    console.log;

    if (response) {
      const data = response;
      dispatch(getDocumentContentRequestSuccess(data));
    } else {
      console.log("No general page found in the response.");
    }
  } catch (error) {
    console.log(error);
    dispatch(getDocumentContentRequestFailure(error.message));
  }
};

//get general page list by project id

export const getPageByProjectId = (id) => async (dispatch) => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    dispatch(fetchGeneralPagesRequest());
    const response = await axios.get(apiUrl + "/byProjectId/" + id, {
      headers,
    });
    if (response) {
      const data = response;
      dispatch(fetchGeneralPageRequestSuccess(data));
    } else {
      console.log("No general page found in the response.");
    }
  } catch (error) {
    console.log(error);
    dispatch(fetchGeneralPagesRequestFailure(error.message));
  }
};

//get general page list by module id

export const getPageByModuleId = (id) => async (dispatch) => {
  const token = localStorage.getItem("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    dispatch(fetchGeneralPagesRequest());
    const response = await axios.get(apiUrl + "/byModuleId/" + id, { headers });

    if (response) {
      const data = response;
      dispatch(fetchGeneralPageRequestSuccess(data));
    }
    else {
      console.log("No general page found in the response.");
    }

  } catch (error) {
    console.log(error);

  }
}

// create a new page
export const createGeneralPage = (page) => async (dispatch) => {
  const token = localStorage.getItem("token"); // Example: token stored in local storage
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.post(apiUrl, page, { headers });
    const data = response;
    if (data) {
      dispatch(addGeneralPage(data));
    } else {
      console.log("No general page found in the response.");
    }
  } catch (error) {
    console.log(error);
    dispatch(fetchGeneralPagesRequestFailure(error.message));
  }
};

//get general page by generalpage id

export const getGeneralPageById = (id) => async (dispatch) => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    dispatch(getDocumentContentRequest());
    const response = await axios.get(apiUrl + "/" + id, { headers });
    console.log("get general page by generalpage id", response);
    if (response) {
      const data = response;
      dispatch(getDocumentContentRequestSuccess(data));
    } else {
      console.log("No general page found in the response.");
    }
  } catch (error) {
    console.log(error);
    dispatch(getDocumentContentRequestFailure(error));
  }
};


export const deletePagebyId = (id) => async (dispatch) => {

   const token = localStorage.getItem("token"); // Example: token stored in local storage
   console.log("project token", token)

   const headers = {
     Authorization: `Bearer ${token}`,
   };
   try {

     await axios.delete(`${apiUrl}/${id}`, {headers});

     // Dispatch the deleteUser action to update the state
     dispatch(deletePage(id));
   } catch (error) {
     console.log(error);

   }
}

//update general page by id

export const updatePageById =(id, updatedPageData) => async (dispatch) => {

   const token = localStorage.getItem("token");
   const headers={
      Authorization: `Bearer ${token}`
   }

   try {
      const response = await axios.put(`${apiUrl}/${id}`, updatedPageData, {headers});
      console.log("Page to be updated ", response);

      if (response){
         const updatedPage = response;
         dispatch(updatePage(updatedPage));
         dispatch(getGeneralPageById(id));
      }
      else{
         console.log("Failed to update page:", response);
      }

   } catch (error) {
      console.log(error)

   }
}