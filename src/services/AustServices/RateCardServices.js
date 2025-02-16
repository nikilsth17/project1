import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const RatecardServices = {
  getList: async () => {
    try {
      const response = await apiService.get("/ratecard");
      return response.data;
    } catch (error) {
      console.error("Error fetching ratecard list:", error);
      throw error;
    }
  },
  create: async (postData) => {
    try {
      const response = await apiService.post("/ratecard", postData);
      return response.data;
    } catch (error) {
      console.error("Error creating ratecard:", error);
      throw error;
    }
  },
  view: async (id) => {
    try {
      const response = await apiService.get(`/ratecard/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching ratecard details:", error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await apiService.delete(`/ratecard/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting ratecard:", error);
      throw error;
    }
  },
  update: async (id, updatedData) => {
    try {
      const response = await apiService.put(`/ratecard/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },
};

export default RatecardServices;
