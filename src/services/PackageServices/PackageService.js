import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const PackageService = {
  getList: async () => {
    const response = await apiService.get("/packages");
    return response.data;
  },

  getPackages: async () => {
    const response = await apiService.get("/admin-packages");
    return response.data;
  },
  create: async (postData) => {
    const response = await apiService.post("/packages", postData);
    return response.data;
  },
  confirm: async (data) => {
    const response = await apiService.post("/packages/confirmed", data);
    return response.data;
  },
  detail: async (id) => {
    const response = await apiService.get(`/packages/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/packages/${id}`);
    return response.data;
  },
  update: async (id, updatedData) => {
    try {
      const response = await apiService.put(`/packages/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },
  getSlot: async ({ date, duration, driver }) => {
    const response = await apiService.get("/time-slots", {
      params: { date, duration, driver },
    });
    console.log("slotresponse", response);

    return response.data;
  },

  getAvailable: async ({ driver }) => {
    const response = await apiService.get("/booking-dates", {
      params: { driver },
    });
    // console.log("🚀 ~ getAvailable: ~ response:", response)
    return response.data;
  },
};

export default PackageService;
