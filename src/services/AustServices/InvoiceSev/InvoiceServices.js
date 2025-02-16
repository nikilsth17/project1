import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const InvoiceServices = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get("/invoice");
    return response.data;
  },
  create: async (postData) => {
    const response = await apiService.post("/good-category", postData);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get(`/invoice/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/invoice/${id}`);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await apiService.put(`/invoice/${id}`, updatedData);
    return response.data;
  },
  invoiceGetList: async ({
    customerId,
    createdDateTo,
    createdDateFrom,
    totalAmountMin,
    totalAmountMax,
    isPaid,
    duePayment,
    refNumber,
    pageNumber,
    pageSize,
  }) => {
    console.log("🚀 ~ pageNumber:", pageNumber);
    console.log("🚀 ~ pageSize:", pageSize);
    var filterList = [];

    if (customerId) {
      filterList.push(`customerId=${customerId}`);
    }
    if (createdDateFrom) {
      filterList.push(`createdDateFrom=${createdDateFrom}`);
    }
    if (createdDateTo) {
      filterList.push(`createdDateTo=${createdDateTo}`);
    }
    if (totalAmountMin) {
      filterList.push(`totalAmountMin=${totalAmountMin}`);
    }
    if (totalAmountMax) {
      filterList.push(`totalAmountMax=${totalAmountMax}`);
    }
    if (isPaid !== undefined) {
      filterList.push(`isPaid=${isPaid}`);
    }

    if (duePayment !== undefined) {
      filterList.push(`duePayment=${duePayment.toString()}`);
    }
    // if (remainingPayment !== undefined) {
    //   filterList.push(`remainingPayment=${remainingPayment}`);
    // }
    if (refNumber) {
      filterList.push(`refNumber=${refNumber}`);
    }
    if (pageNumber) {
      filterList.push(`pageNumber=${pageNumber}`);
    }
    if (pageSize) {
      filterList.push(`pageSize=${pageSize}`);
    }

    var filterString = filterList.join("&");

    const response = await apiService.get(`/invoice?${filterString}`);

    return response.data;
  },
};
export default InvoiceServices;
