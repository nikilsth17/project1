import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const HeaderServices = {
  // Define your API functions here
  headersList: async () => {
    const response = await apiService.get("/generalconfig");
    return response.data;
  },
  headerscreate: async (postData) => {
    const response = await apiService.post("/generalconfig", postData);
    return response.data;
  },
  viewheaders: async (id) => {
    const response = await apiService.get(`/generalconfig/${id}`);
    return response.data;
  },
  deleteheaders: async (id) => {
    const response = await apiService.delete(`/generalconfig/${id}`);
    return response.data;
  },
  headersUpdate: async (id, updatedData) => {
    try {
      const response = await apiService.put(
        `/generalconfig/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },
};

export default HeaderServices;
