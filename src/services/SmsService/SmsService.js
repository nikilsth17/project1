import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const SmsService = {
  get: async () => {
    const response = await apiService.get("/sms-templates");
    return response.data;
  },

  update: async (id, updatedData) => {
    try {
      const response = await apiService.put(
        `/sms-templates/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating:", error);
      throw error;
    }
  },
};

export default SmsService;
