import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const AuthenticationsServices = {
  // Define your API functions here
  // getList: async () => {
  //   const response = await apiService.get('/good-category');
  //   return response.data;
  // },
  login: async ({username,password}) => {
    const response = await apiService.post(
      `/login?username=${username}&password=${password}`
    );
    return response.data;
  },
  changePassword: async (changeData) => {
    try {
      const response = await apiService.put(
        "/user/change-password",
        changeData
      );
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw new Error("Failed to change password. Please try again.");
    }
  },
  updatePassword: async (id, old_password, newPassword, confirmPassword) => {
    const payload = {
      id: id,
      old_password: old_password,
      password: newPassword,
      password_confirmation: confirmPassword,
    };
    const response = await apiService.post(
      // `/customers/change-password/${id}`,
      "/users/change-password",
      payload
    );
    return response.data;
  },
  Register: async (registeradmin) => {
    try {
      const response = await apiService.post(
        "/auth/register-admin",
        registeradmin
      );
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw new Error("Failed to change password. Please try again.");
    }
  },

  resetPassword: async (resetCode, newPassword, confirmPassword) => {
    const payload = {
      reset_password_code: resetCode,
      password: newPassword,
      password_confirmation: confirmPassword,
    };
    const response = await apiService.post("/users/reset-password", payload);
    return response.data;
  },

  // forgotPassword: async (forgotPwdData) => {
  //   const response = await apiService.post(
  //     `/auth/forgot-password`,
  //     forgotPwdData
  //   );
  //   return response.data;
  // },

  forgetPassword: async (data) => {
    const payload = { email: data };
    const response = await apiService.post("/users/forgot-password", payload);
    return response.data;
  },

  userRole: async (resetData) => {
    const response = await apiService.get(`/auth/roles`);
    return response.data;
  },
  userRoleManage: async (resetData) => {
    const response = await apiService.get(`/auth/get-users`);
    return response.data;
  },

  viewdata: async (userId) => {
    const response = await apiService.get(`/auth/get-user/${userId}`);
    return response.data;
  },

  // view: async (id) => {
  //   const response = await apiService.get(`/good-category/${id}`);
  //   return response.data;
  // },
  delete: async (id) => {
    const response = await apiService.delete(`/auth/${id}`);
    return response.data;
  },
  updateregister: async (id, updatedData) => {
    const response = await apiService.put(`/auth/${id}`, updatedData);
    return response.data;
  },

  refresh: async (data) => {
    const response = await apiService.post("/refresh", data);
    return response.data;
  },
};

export default AuthenticationsServices;
