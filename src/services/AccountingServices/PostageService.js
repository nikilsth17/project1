import axios from "axios";

const BASE_URL = "http://api.parcelcalculator.sebs.asia/api/PostalCode/search?";

const PostageService = {
  getList: async (searchQuery) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          query: searchQuery,
        },
      });
      console.log("API Response:", response.data); // Log the response data
      return response.data;
    } catch (error) {
      console.error("Error fetching Postage data:", error); // Log any errors
      throw error;
    }
  },
};

export default PostageService;
