import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const DriverAppointmentService = {
  getList: async (driverId) => {
    const response = await apiService.get("/appointments", {
      params: {
        driver: driverId,
      },
    });
    return response.data;
  },
};

export default DriverAppointmentService;
