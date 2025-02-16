import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const SettingService = {
  get: async () => {
    const response = await apiService.get("/setting");

    console.log("responseeee",response)
    return response.data;
  },

  update: async (id, updatedData) => {
    try {
      const response = await apiService.patch(`/setting/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating:", error);
      throw error;
    }
  },
};

export default SettingService;
