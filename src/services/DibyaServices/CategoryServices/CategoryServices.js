import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const CategoryServices = {
  categoryList: async () => {
    const response = await apiService.get("/categoryv1");
    return response.data;
  },
  subcategoryList: async () => {
    const response = await apiService.get("/categoryv1/subcategory");
    return response.data;
  },

  maincategoryList: async () => {
    const response = await apiService.get("/categoryv1/maincategory");
    return response.data;
  },
  maincategory: async () => {
    const response = await apiService.get("/categoryv1");
    return response.data;
  },

  categorycreate: async (postData) => {
    const response = await apiService.post("/categoryv1", postData);
    return response.data;
  },
  viewcategory: async (id) => {
    const response = await apiService.get(
      `/categoryv1/withsubcategorycategory?Id=${id}`
    );
    return response.data;
  },
  deletecategory: async (id) => {
    const response = await apiService.delete(`/categoryv1/${id}`);
    return response.data;
  },
  categoryUpdate: async (id, updatedData) => {
    try {
      const response = await apiService.put(`/categoryv1/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },

  viewitems: async (id) => {
    const response = await apiService.get(`/items/itemdetail/${id}`);
    return response.data;
  },
};

export default CategoryServices;
