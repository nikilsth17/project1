import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const ApiLogServices = {
  // Define your API functions here
  deleteApiLog: async () => {
    const response = await apiService.delete(
      "/outgoingapirequest/truncatetable"
    );
    return response.data;
  },
};

export default ApiLogServices;
