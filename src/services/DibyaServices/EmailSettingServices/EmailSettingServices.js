import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const EmailSettingServices = {
  // Define your API functions here
  emailSettingList: async () => {
    const response = await apiService.get("/generalconfig/email-setting");
    return response.data;
  },
  emailSettingCreate: async (postData) => {
    const response = await apiService.post("/generalconfig/email-setting", postData);
    return response.data;
  },
  viewEmailSetting: async (id) => {
    const response = await apiService.get(`/generalconfig/email-setting/${id}`);
    return response.data;
  },
  deleteEmailSetting: async (id) => {
    const response = await apiService.delete(`/generalconfig/email-setting/${id}`);
    return response.data;
  },
  emailSettingUpdate: async (id, updatedData) => {
    try {
      const response = await apiService.put(
        `/generalconfig/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },
};

export default EmailSettingServices;
