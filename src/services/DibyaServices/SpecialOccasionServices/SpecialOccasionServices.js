import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const SpecialOccasionServices = {
  // Define your API functions here
  specialList: async () => {
    const response = await apiService.get("/specialoccasions");
    return response.data;
  },
  specialItems: async () => {
    const response = await apiService.get("/specialoccasionitems");
    return response.data;
  },
  viewspecial: async (id) => {
    const response = await apiService.get(`/specialoccasions/${id}`);
    return response.data;
  },
  viewItems: async (id) => {
    const response = await apiService.get(`/specialoccasionitems/${id}`);
    return response.data;
  },
  deletespecial: async (id) => {
    const response = await apiService.delete(`/specialoccasions/${id}`);
    return response.data;
  },
  itemcreate: async (postData) => {
    const response = await apiService.post("/specialoccasionitems", postData);
    return response.data;
  },
  itemupdate: async (id, updatedData) => {
    try {
      const response = await apiService.put(
        `/specialoccasionitems/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },
};

export default SpecialOccasionServices;
