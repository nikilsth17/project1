import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const OneTimeService = {
  get: async (driverId) => {
    const response = await apiService.get("/one-time-schedules", {
      params: {
        driver: driverId,
      },
    });
    // console.log("responseeee", response);
    return response.data;
  },

  create: async (data) => {
    try {
      const response = await apiService.post("/one-time-schedules", data);
      return response.data;
    } catch (error) {
      console.error("Error updating:", error);
      throw error;
    }
  },

  update: async (id, updatedData) => {
    try {
      const response = await apiService.put(
        `/one-time-schedules/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating:", error);
      throw error;
    }
  },

  detail: async (id) => {
    const response = await apiService.get(`/one-time-schedules/${id}`);
    console.log("detailresponse", response);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiService.delete(`/one-time-schedules/${id}`);
    return response.data;
  },
};

export default OneTimeService;
