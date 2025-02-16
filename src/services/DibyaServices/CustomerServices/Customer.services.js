import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const CustomerServices = {
  // Define your API functions here
  getCustomerList: async () => {
    const response = await apiService.get("/customer");
    return response.data;
  },
  getCustomerDetail: async (id) => {
    const response = await apiService.get(`/customers/${id}`);
    return response.data;
  },
  getCustomerBooking: async (id) => {
    const response = await apiService.get(`/customers/${id}/bookings`);
    return response.data;
  },
  
  guestUserList: async () => {
    const response = await apiService.get("/guestusers");
    return response.data;
  },
  getGuestDetail: async (id) => {
    const response = await apiService.get(
      `/customer/guest/withorderdetail/${id}`
    );
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/guestusers/${id}`);
    return response.data;
  },
};

export default CustomerServices;
