import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const SuburbService = {
  get: async () => {
    const response = await apiService.get("/suburbs/active");
    // console.log("responseeee",response)
    return response.data;
  },

  getAll: async () => {
    const response = await apiService.get("/suburbs");
    // console.log("responseeee",response)
    return response.data;
  },
  create: async (data) => {
    try {
      const response = await apiService.post("/suburbs", data);
      return response.data;
    } catch (error) {
      console.error("Error updating:", error);
      throw error;
    }
  },
  update: async (id, updatedData) => {
    try {
      const response = await apiService.put(`/suburbs/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating:", error);
      throw error;
    }
  },
  detail: async (id) => {
    const response = await apiService.get(`/suburbs/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/suburbs/${id}`);
    return response.data;
  },
};

export default SuburbService;
