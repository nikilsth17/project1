import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const UnitServices = {
  // Define your API functions here
  unitList: async () => {
    const response = await apiService.get("/unitv1");
    return response.data;
  },

  viewunit: async (id) => {
    const response = await apiService.get(`/unitv1/${id}`);
    return response.data;
  },
  deleteunit: async (id) => {
    const response = await apiService.delete(`/unitv1/${id}`);
    return response.data;
  },
  createunit: async (postData) => {
    const response = await apiService.post("/unitv1", postData);
    return response.data;
  },

  update: async (id, updatedData) => {
    try {
      const response = await apiService.put(`/unitv1/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },
};

export default UnitServices;
