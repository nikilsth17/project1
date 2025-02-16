import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const CustomerAust = {
  // Define your API functions here
  getListpage: async (pageNumber, pageSize) => {
    try {
      const response = await apiService.get(
        `/customer?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer list:", error);
      throw error; // Re-throw the error to handle it at a higher level if needed
    }
  },

  getList: async () => {
    const response = await apiService.get(`/customer`);
    return response.data;
  },

  create: async (postData) => {
    const response = await apiService.post("/customer", postData);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get(`/customer/${id}`);
    return response.data;
  },
  viewWithTxn: async (id) => {
    const response = await apiService.get(`/customer/${id}/WithTxn`);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiService.delete(`/customer/${id}`);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await apiService.put(`/customer/${id}`, updatedData);
    return response.data;
  },
  updatecustomerType: async (id, customerTypeId) => {
    const response = await apiService.put(
      `/customer/${id}/customertype?CustomerTypeId=${customerTypeId}`
    );
    return response.data;
  },
  customerVerify: async (id) => {
    const response = await apiService.put(`/customer/${id}/verify`);
    return response.data;
  },

  getCustomerList: async (
    userEmail,
    createdDateFrom,
    createdDateTo,
    address,
    phoneNumber,
    isSystemVerified,
    firstName
  ) => {
    const filterList = [];

    if (createdDateFrom) {
      filterList.push(`createdDateFrom=${createdDateFrom}`);
    }
    if (createdDateTo) {
      filterList.push(`createdDateTo=${createdDateTo}`);
    }
    if (firstName) {
      filterList.push(`firstName=${firstName}`);
    }
    if (userEmail) {
      filterList.push(`userEmail=${userEmail}`);
    }
    if (address) {
      filterList.push(`address=${address}`);
    }
    if (phoneNumber) {
      filterList.push(`phoneNumber=${phoneNumber}`);
    }
    if (isSystemVerified) {
      filterList.push(`isSystemVerified=${isSystemVerified}`);
    }

    const filterString = filterList.join("&");

    try {
      const response = await apiService.get(
        `/customer/customerlist${filterString ? `?${filterString}` : ""}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer list:", error);
      throw error; // Re-throw the error to handle it at a higher level if needed
    }
  },

  getCustomerNameList: async ({ nameFilter }) => {
    const response = await apiService.get(
      `/customer/customernamelist?nameOrEmail=${nameFilter}`
    );
    return response.data;
  },
};

export default CustomerAust;
