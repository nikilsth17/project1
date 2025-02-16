import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const NotificationService = {
  get: async (id) => {
    const response = await apiService.get(`/notifications/${id}`);
    // console.log("responseeee", response);
    return response.data;
  },

  create: async (data) => {
    try {
      const response = await apiService.post("/notifications", data);
      return response.data;
    } catch (error) {
      console.error("Error updating:", error);
      throw error;
    }
  },

  update: async (id, updatedData) => {
    try {
      const response = await apiService.put(
        `/notifications/markread/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating:", error);
      throw error;
    }
  },

  detail: async (id) => {
    const response = await apiService.get(`/notifications/${id}`);
    console.log("detailresponse", response);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiService.delete(`/notifications/${id}`);
    return response.data;
  },

  clearAll: async(id)=>{
    const response= await apiService.get(`/notifications/markreadall/${id}`);
    return response.data;
  }
};

export default NotificationService;
