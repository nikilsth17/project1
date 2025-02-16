import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const WeeklyService = {
  // get: async ({data}) => {
  //     const response = await apiService.get("/weekly-schedules",data);
  //     // console.log("responseeee",response)
  //     return response.data;
  //   },

  get: async ({ id }) => {
    const response = await apiService.get(`/weekly-schedules/drivers/${id}`);
    return response;
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

export default WeeklyService;
