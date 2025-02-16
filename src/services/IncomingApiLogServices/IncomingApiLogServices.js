import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const IncomingApiLogServices = {
  // Define your API functions here
  incomingRequestLogDetail: async (id) => {
    const response = await apiService.get(`incomingapilog/getbyid/${id}`);
    return response.data;
  },

  incomingRequestLogList: async ({
    ApplicationName,
    FromDate,
    ToDate,
    Path,
    statusCode,
  }) => {
    var filterList = [];

    if (ApplicationName) {
      filterList.push(`ApplicationName=${ApplicationName}`);
    }
    if (FromDate) {
      filterList.push(`FromDate=${FromDate}`);
    }
    if (ToDate) {
      filterList.push(`ToDate=${ToDate}`);
    }
    if (Path) {
      filterList.push(`Path=${Path}`);
    }
    if (statusCode) {
      filterList.push(`Path=${statusCode}`);
    }

    var filterString = filterList.join("&");

    const response = await apiService.get(`/incomingapilog?${filterString}`);

    return response.data;
  },

  deleteIncomingRequestLog: async () => {
    const response = await apiService.delete("/incomingapilog/truncatetable");
    return response.data;
  },
};

export default IncomingApiLogServices;
