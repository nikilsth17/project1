import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const DepoService = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get("/depot-office");
    return response.data;
  },
  create: async (postData) => {
    var temp = postData.postalCodeStartingWith;
    const list = temp.split(",");
    const objectList = list.map((item) => {
      return {
        code: item,
      };
    });
    const response = await apiService.post("/depot-office", {
      ...postData,
      postalCodeStartingWith: objectList,
    });
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get(`/depot-office/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/depot-office/${id}`);
    return response.data;
  },
  update: async (id, updatedData) => {
    var temp = updatedData.postalCodeStartingWith;
    const list = temp.split(",");
    const objectList = list.map((item) => {
      return {
        code: item,
      };
    });
    console.log("🚀 ~ objectList ~ objectList:", objectList);
    const response = await apiService.put(`/depot-office/${id}`, {
      ...updatedData,
      postalCodeStartingWith: objectList,
    });
    return response.data;
  },
};

export default DepoService;
