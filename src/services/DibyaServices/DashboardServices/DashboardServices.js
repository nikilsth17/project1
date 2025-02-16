import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const DashboardServices = {
  list: async (dateRange) => {
    const response = await apiService.get(
      `/admindashboard?dateRange=${dateRange}`
    );
    return response.data;
  },

  graphlist: async () => {
    const response = await apiService.get("/admindashboard/monthwiseamount");
    return response.data;
  },
  donutlist: async () => {
    const response = await apiService.get(
      "/admindashboard/itemwisecontribution"
    );
    return response.data;
  },
};

export default DashboardServices;
