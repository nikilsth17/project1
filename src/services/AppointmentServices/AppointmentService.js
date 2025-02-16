import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const AppointmentService = {
  getList: async () => {
    const response = await apiService.get("/appointments");
    return response.data;
  },

  create: async (postData) => {
    const response = await apiService.post("/appointments", postData);
    return response.data;
  },
  confirm: async (data) => {
    const response = await apiService.post("/appointments/confirmed", data);
    return response.data;
  },
  detail: async (id) => {
    const response = await apiService.get(`/appointments/${id}`);
    console.log("detailresponse",response)
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/appointments/${id}`);
    return response.data;
  },
  update: async (id, updatedData) => {
    try {
      const response = await apiService.put(`/appointments/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },
  updateStatus: async (id, status) => {
    try {
      const response = await apiService.patch(`/appointments/update-status/${id}`, status);
      return response.config.data
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },
  // updatePaymentStatus: async (id, status) => {
  //   try {
  //     const response = await apiService.post(`/appointments/${id}/paid`, status);
  //     return response.config.data
  //   } catch (error) {
  //     console.error("Error updating ratecard:", error);
  //     throw error;
  //   }
  // },

    updatePaymentStatus: async (id, status) => {
    try {
      const response = await apiService.post(`/appointments/${id}/payment`, status);
      return response.config.data
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },


  reschedule:async(id,data)=>{
    const response = await apiService.post(`appointments/${id}/admin-reschedule`,data);
    console.log("schedule",response);
    return response.data;
  },

  complete: async (id)=>{
    const response= await apiService.get(`appointments/complete/${id}`);
    return response.data;
  },


  extendTime: async(id,data)=>{
    const response= await apiService.patch(`shift-appointments/${id}`,data);
    return response.data
  }
};

export default AppointmentService;
