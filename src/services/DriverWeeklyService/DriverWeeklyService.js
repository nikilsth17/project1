import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const DriverWeeklyService = {
  get: async () => {
    const response = await apiService.get("/weekly-schedules");
    // console.log("responseeee",response)
    return response.data;
  },
  getById: async (id) => {
    const response = await apiService.get(`/weekly-schedules/drivers/${id}`);
    // console.log("responseeee",response)
    return response.data;
  },
  update: async (id, updatedData) => {
    try {
      const response = await apiService.put(
        `/weekly-schedules/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating:", error);
      throw error;
    }
  },
};

export default DriverWeeklyService;
