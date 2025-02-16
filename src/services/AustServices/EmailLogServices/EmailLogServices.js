import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const EmailLogServices = {
  // Define your API functions here

  getEmailLogs: async ({
    fromDate,
    toDate,
    filterString,
    status,
    pageNumber,
    pageSize,
  }) => {
    console.log("🚀 ~ fromDate:", fromDate);
    var filterList = [];

    if (fromDate) {
      filterList.push(`fromDate=${fromDate}`);
    }
    if (toDate) {
      filterList.push(`toDate=${toDate}`);
    }
    if (filterString) {
      filterList.push(`filterString=${filterString}`);
    }
    if (status) {
      filterList.push(`status=${status}`);
    }
    if (pageNumber) {
      filterList.push(`pageNumber=${pageNumber}`);
    }
    if (pageSize) {
      filterList.push(`pageSize=${pageSize}`);
    }

    var filterString = filterList.join("&");
    const response = await apiService.get(
      `/emaillogs/log-list?${filterString}`
    );
    return response.data;
  },
  deleteEmailLogs: async () => {
    const response = await apiService.get(`/emaillogs/truncate`);
  },
};

export default EmailLogServices;
