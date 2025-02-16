import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const ComboServices = {
  comboList: async () => {
    const response = await apiService.get("/combo");
    return response.data;
  },

  combocreate: async (postData) => {
    const response = await apiService.post("/combo", postData);
    return response.data;
  },
  viewcombo: async (id) => {
    const response = await apiService.get(`/combo/${id}`);
    return response.data;
  },
  deletecombo: async (id) => {
    const response = await apiService.delete(`/combo/${id}`);
    return response.data;
  },
  comboUpdate: async (id, updatedData) => {
    try {
      const response = await apiService.put(`/combo/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },
};

export default ComboServices;
