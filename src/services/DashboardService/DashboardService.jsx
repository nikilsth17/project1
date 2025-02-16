import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const DashboardService = {
  getData: async (driverId) => {
    const response = await apiService.get("/dashboard-data", {
      params: {
        driver: driverId,
      },
    });
    return response.data;
  },
};

export default DashboardService;
