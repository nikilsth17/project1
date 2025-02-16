import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const EventService = {
  getList: async (month, year, driverId) => {
    const userString = localStorage.getItem("user");
    const user = JSON.parse(userString);
    const token = user.token;
    console.log("token", token);
    const response = await apiService.get("/appointments/calendar", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        month: month, // Add the month
        year: year, // Add the year
        driver: driverId,
      },
    });
    console.log("responsecalendar", response);
    return response.data;
  },

  create: async (data) => {
    const response = await apiService.post("/appointments", data);
    return response.data;
  },

  updateStatus: async (id, data) => {
    const response = await apiService.patch(
      `/appointments/update-status/${id}`,
      data
    );
    return response.data;
  },
};

export default EventService;
