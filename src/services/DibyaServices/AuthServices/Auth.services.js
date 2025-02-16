import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const AuthServices = {
  // Define your API functions here
  getAdminList: async () => {
    const response = await apiService.get("/auth/get-users");
    return response.data;
  },
  getAdminById: async (id) => {
    const response = await apiService.get(`/auth/get-user/${id}`);
    return response.data;
  },
  deleteAdmin: async (id) => {
    const response = await apiService.delete(`/auth/${id}`);
    return response.data;
  },
  updateAdmin: async (id, data) => {
    const response = await apiService.put(`/auth/${id}`, data);
    return response.data;
  },
  getCustomerDetail: async (id) => {
    const response = await apiService.get(`/customer/${id}`);
    return response.data;
  },
  getAuthRoles: async () => {
    const response = await apiService.get(`/auth/roles`);
    return response.data;
  },
  registerAdmin: async (data) => {
    const response = await apiService.post(`/auth/register-admin`, data);
    return response.data;
  },
};

export default AuthServices;
