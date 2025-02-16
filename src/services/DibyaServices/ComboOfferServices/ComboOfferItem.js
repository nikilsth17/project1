import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const ComboOfferServices = {
  comboofferList: async () => {
    const response = await apiService.get("/comboitems");
    return response.data;
  },

  combocreate: async (postData) => {
    const response = await apiService.post("/comboitems", postData);
    return response.data;
  },
  viewcombo: async (id) => {
    const response = await apiService.get(`/comboitems/${id}`);
    return response.data;
  },
  deletecombo: async (id) => {
    const response = await apiService.delete(`/comboitems/${id}`);
    return response.data;
  },
  comboUpdate: async (id, updatedData) => {
    try {
      const response = await apiService.put(`/comboitems/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },
};

export default ComboOfferServices;
