import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const WhatsAppSettingServices = {
  // Define your API functions here
  whatsappSettingList: async () => {
    const response = await apiService.get("/generalconfig/whatsapp-setting");
    return response.data;
  },
  whatsappSettingCreate: async (postData) => {
    const response = await apiService.post("/generalconfig/whatsapp-setting", postData);
    return response.data;
  },
  viewWhatsAppSetting: async (id) => {
    const response = await apiService.get(`/generalconfig/whatsapp-setting/${id}`);
    return response.data;
  },
  deleteWhatsAppSetting: async (id) => {
    const response = await apiService.delete(`/generalconfig/whatsapp-setting/${id}`);
    return response.data;
  },
  whatsappSettingUpdate: async (id, updatedData) => {
    try {
      const response = await apiService.put(
        `/generalconfig/whatsapp-setting/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating WhatsApp setting:", error);
      throw error;
    }
  },
};

export default WhatsAppSettingServices;
