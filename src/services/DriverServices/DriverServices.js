import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const DriverServices = {
  get: async () => {
    const response = await apiService.get("/drivers");
    // console.log("responseeee",response)
    return response.data;
  },
  getBySuburb: async (id) => {
    const response = await apiService.get(`/suburbs/${id}/drivers`);
    // console.log("responseeee",response)
    return response.data;
  },
  getById: async (id) => {
    const response = await apiService.get(`/drivers/${id}`);
    // console.log("responseeee",response)
    return response.data;
  },
  update: async (id, data) => {
    console.log("🚀 ~ update: ~ data:", data);
    try {
      const response = await apiService.post(`/drivers/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating:", error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await apiService.post("/drivers", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating:", error);
      throw error;
    }
  },
  delete: async (id) => {
    const response = await apiService.delete(`/drivers/${id}`);
    return response.data;
  },

  resetPasswordDriver: async (data) => {
    const response = await apiService.post(`/users/admin-reset-password`, data);
    return response.data;
  },
};

export default DriverServices;
