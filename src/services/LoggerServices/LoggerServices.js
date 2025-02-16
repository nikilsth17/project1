import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const LoggerService = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get("/log/listfiles");
    return response.data;
  },
  getLogDetail: async (id) => {
    const response = await apiService.get(`/log/getfilecontent?fileName=${id}`);
    return response.data;
  },
};

export default LoggerService;
