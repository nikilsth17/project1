import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const RequestLogServices = {
  // Define your API functions here
  deleteRequestLog: async () => {
    const response = await apiService.delete("/serilogrequest/truncatetable");
    return response.data;
  },
};

export default RequestLogServices;
